import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getStateBySlug, getCitiesByState, getAllStates, getAllCitiesSync } from '@/lib/cities';
import { getAllServicesSync } from '@/lib/services';
import InteractiveStateMap from '@/components/InteractiveStateMap';
import InteractiveStateMapWithSelector from '@/components/InteractiveStateMapWithSelector';

// Log when module loads
console.log('🔵 STATE PAGE MODULE - File loaded! Route: [state]/network-cabling');

export async function generateStaticParams() {
  console.log('🔵 STATE PAGE - generateStaticParams called');
  // In development, return empty array to avoid pre-rendering all pages
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  const states = getAllStates();
  return states.map(state => ({
    state: state.name.toLowerCase().replace(/\s+/g, '-'), // Just the state slug, not with -network-cabling
  }));
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }> | { state: string };
}) {
  console.log('🔵🔵🔵 STATE PAGE - COMPONENT LOADED! 🔵🔵🔵');
  console.log('🔵 STATE PAGE - Starting render');
  console.log('🔵 STATE PAGE - Raw params:', params);
  console.log('🔵 STATE PAGE - Params type:', typeof params);
  console.log('🔵 STATE PAGE - Is Promise?', params instanceof Promise);
  
  // Extract state slug by removing '-network-cabling' suffix
  // Handle Promise during static generation
  const resolvedParams = await Promise.resolve(params);
  console.log('🔵 STATE PAGE - Resolved params:', resolvedParams);
  
  // Route is now /[state]/network-cabling, so state param is just the state slug
  const stateSlug = resolvedParams?.state || '';
  console.log('🔵 STATE PAGE - State slug:', stateSlug);
  console.log('🔵 STATE PAGE - Full param:', resolvedParams?.state);
  
  // Debug: Check what states are available
  const allStates = getAllStates();
  console.log('🔵 STATE PAGE - All available states:', allStates.length);
  console.log('🔵 STATE PAGE - States:', allStates.map(s => ({
    name: s.name,
    abbreviation: s.abbreviation,
    nameSlug: s.name.toLowerCase().replace(/\s+/g, '-'),
    cityCount: s.cities.length
  })));
  
  // Debug: Check if cities are loading
  const allCities = getAllCitiesSync();
  console.log('🔵 STATE PAGE - Total cities loaded:', allCities.length);
  if (allCities.length === 0) {
    console.error('🔴 STATE PAGE - NO CITIES LOADED! This will cause all states to be empty.');
  }
  
  const stateData = getStateBySlug(stateSlug);
  console.log('🔵 STATE PAGE - State data found:', !!stateData);
  console.log('🔵 STATE PAGE - State data:', stateData);
  
  if (!stateData) {
    console.error('🔴 STATE PAGE - State not found!');
    console.error('  - Looking for state slug:', stateSlug);
    console.error('  - Available states:', allStates.map(s => s.name.toLowerCase().replace(/\s+/g, '-')));
    console.error('  - Available abbreviations:', allStates.map(s => s.abbreviation.toLowerCase()));
    
    // Instead of notFound(), show an error page so we can debug
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-red-500 bg-red-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-4">State Not Found</h1>
          <p className="text-red-700 mb-2">Looking for state slug: <strong>{stateSlug}</strong></p>
          <p className="text-red-700 mb-2">Full param: <strong>{resolvedParams?.state}</strong></p>
          <p className="text-red-700 mb-4">Available states:</p>
          <ul className="list-disc list-inside text-red-700">
            {allStates.map(state => (
              <li key={state.abbreviation}>
                {state.name} ({state.abbreviation}) - slug: {state.name.toLowerCase().replace(/\s+/g, '-')}
              </li>
            ))}
          </ul>
          <p className="text-red-700 mt-4">Check the server console for more details.</p>
        </div>
      </div>
    );
  }

  const cities = getCitiesByState(stateSlug);
  console.log('🔵 STATE PAGE - Cities found:', cities.length);
  console.log('🔵 STATE PAGE - Cities:', cities.map(c => c.name));
  
  const topCities = cities.slice(0, 30);
  console.log('🔵 STATE PAGE - Top cities:', topCities.length);
  
  const services = getAllServicesSync();
  console.log('🔵 STATE PAGE - Services found:', services.length);
  console.log('🔵 STATE PAGE - Services:', services.map(s => s.service_name));
  
  if (services.length === 0) {
    console.error('🔴 STATE PAGE - No services found! This will cause empty page.');
  }
  
  if (topCities.length === 0) {
    console.error('🔴 STATE PAGE - No cities found! This will cause empty page.');
  }


  // Use the state slug without suffix for city links
  const stateSlugForLinks = stateData.name.toLowerCase().replace(/\s+/g, '-');
  
  console.log('🔵 STATE PAGE - About to render with:');
  console.log('  - State:', stateData.name);
  console.log('  - Cities:', topCities.length);
  console.log('  - Services:', services.length);
  console.log('  - State slug for links:', stateSlugForLinks);
  console.log('🔵 STATE PAGE - RENDERING CONTENT NOW!');

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] lg:h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-black/95 to-luxury-black/90">
        <div className="absolute inset-0 bg-luxury-black">
          <Image 
            src="/assets/20.png" 
            alt="Network cabling infrastructure"
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4 fade-in">
            Network Cabling Services in {stateData.name}
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/90 fade-in">
            Professional low-voltage installation and structured cabling solutions throughout {stateData.name}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Map Section */}
        <section className="mb-20 fade-in">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8 text-luxury-black text-center">
            Service Areas in {stateData.name}
          </h2>
          <InteractiveStateMapWithSelector 
            cities={cities}
            centerCity={cities[0]}
            height="500px"
            className="h-96 lg:h-[500px]"
            showSelector={true}
          />
        </section>

        {/* Services Section */}
        <section className="mb-20 fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-luxury-black">
              Our Services
            </h2>
            <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto">
              Comprehensive network infrastructure solutions across {stateData.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.length === 0 ? (
              <div className="col-span-full p-6 border border-yellow-500 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">⚠️ No services found. Check console for details.</p>
              </div>
            ) : (
              services.map((service, index) => (
                <div
                  key={service.slug}
                  className="border border-luxury-beige rounded-lg p-6 lg:p-8 bg-white luxury-shadow hover-lift transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="font-display text-xl font-semibold mb-3 text-luxury-black">
                    {service.service_name}
                  </h3>
                  <p className="text-xs font-semibold text-luxury-gold mb-3 uppercase tracking-wide">
                    {service.category}
                  </p>
                  <p className="text-sm text-luxury-black/70 mb-4 leading-relaxed">
                    {service.meta_desc_template.replace(/{City}/g, stateData.name)}
                  </p>
                  <Link
                    href={`/${stateSlugForLinks}/${topCities[0]?.name.toLowerCase().replace(/\s+/g, '-') || 'atlanta'}/${service.slug}`}
                    className="text-luxury-gold hover:text-luxury-black transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
                  >
                    View Services
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Cities Grid */}
        <section className="fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-luxury-black">
              Top Cities We Serve
            </h2>
            <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto">
              Professional network cabling services throughout {stateData.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {topCities.length === 0 ? (
              <div className="col-span-full p-6 border border-yellow-500 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">⚠️ No cities found. Check console for details.</p>
              </div>
            ) : (
              topCities.map((city, index) => {
                const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
                // Link to default service (voice-data-cabling-installers) for backwards compatibility
                return (
                  <Link
                    key={city.name}
                    href={`/${stateSlugForLinks}/${citySlug}/voice-data-cabling-installers`}
                    className="border border-luxury-beige rounded-lg p-6 lg:p-8 bg-white luxury-shadow hover-lift transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <h3 className="font-display text-xl font-semibold mb-2 text-luxury-black group-hover:text-luxury-blue transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-luxury-black/60">
                      Population: {city.population.toLocaleString()}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-luxury-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Services
                      <span>→</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </>
  );
}

