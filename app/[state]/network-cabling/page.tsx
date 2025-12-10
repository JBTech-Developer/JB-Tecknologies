import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStateBySlug, getCitiesByState, getAllStates, getAllCitiesSync } from '@/lib/cities';
import { getAllServicesSync } from '@/lib/services';

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

  // Generate map URL with all cities
  const mapMarkers = cities.slice(0, 20).map(city => 
    `markers=color:0x4285F4|label:${city.name.charAt(0)}|${city.latitude},${city.longitude}`
  ).join('&');
  const mapCenter = cities[0] || { latitude: 33.749, longitude: -84.388 };
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.latitude},${mapCenter.longitude}&zoom=7&size=1200x600&${mapMarkers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;

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
      {/* Debug: Always show this to confirm component is rendering */}
      <div className="bg-blue-100 border-4 border-blue-500 p-4 m-4">
        <p className="text-blue-900 font-bold">✅ PAGE COMPONENT IS RENDERING!</p>
        <p className="text-blue-800">State: {stateData.name}</p>
        <p className="text-blue-800">Cities: {topCities.length}</p>
        <p className="text-blue-800">Services: {services.length}</p>
      </div>
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">
        Network Cabling Services in {stateData.name}
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Professional low-voltage installation and structured cabling solutions throughout {stateData.name}
      </p>

      {/* Map Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Service Areas in {stateData.name}</h2>
        <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <img 
              src={mapUrl} 
              alt={`Map of ${stateData.name} service areas`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Google Maps API key required
            </div>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full p-4 border border-yellow-500 bg-yellow-50 rounded">
              <p className="text-yellow-800">⚠️ No services found. Check console for details.</p>
            </div>
          ) : (
            services.map((service) => (
            <div key={service.slug} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{service.service_name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="text-xs font-semibold text-primary">{service.category}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {service.meta_desc_template.replace(/{City}/g, stateData.name)}
              </p>
              <Link
                href={`/${stateSlugForLinks}/${topCities[0]?.name.toLowerCase().replace(/\s+/g, '-') || 'atlanta'}/${service.slug}`}
                className="text-primary hover:underline text-sm"
              >
                View Services →
              </Link>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Cities Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Cities We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCities.length === 0 ? (
            <div className="col-span-full p-4 border border-yellow-500 bg-yellow-50 rounded">
              <p className="text-yellow-800">⚠️ No cities found. Check console for details.</p>
            </div>
          ) : (
            topCities.map((city) => {
            const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
            // Link to default service (voice-data-cabling-installers) for backwards compatibility
            return (
              <Link
                key={city.name}
                href={`/${stateSlugForLinks}/${citySlug}/voice-data-cabling-installers`}
                className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Population: {city.population.toLocaleString()}
                </p>
              </Link>
            );
          })
          )}
        </div>
      </div>
      </div>
    </>
  );
}

