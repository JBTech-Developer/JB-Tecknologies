import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCityBySlugSync, getNearbyCities, getAllCitiesSync } from '@/lib/cities';
import { getAllServicesSync, getServiceBySlug } from '@/lib/services';
import { generateServiceCityContent } from '@/lib/content-generator';
import { generateServiceSchemaMarkup } from '@/lib/schema';
import { getGoogleMapsStaticUrl } from '@/lib/maps';
import LeadForm from '@/components/LeadForm';
import MobileLeadButton from '@/components/MobileLeadButton';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  // In development, return empty array to avoid pre-rendering all pages
  // But we still want to allow dynamic rendering
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  
  // Double loop: Generate params for EVERY City AND EVERY Service
  const cities = getAllCitiesSync();
  const services = getAllServicesSync();
  const paths: Array<{ state: string; city: string; service: string }> = [];
  
  cities.forEach(city => {
    const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
    
    services.forEach(service => {
      paths.push({
        state: stateSlug,
        city: citySlug,
        service: service.slug, // e.g., "fiber-optic-services"
      });
    });
  });
  
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; service: string }> | { state: string; city: string; service: string };
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const city = getCityBySlugSync(resolvedParams.state, resolvedParams.city);
  const service = getServiceBySlug(resolvedParams.service);
  
  if (!city || !service) {
    return {
      title: 'Page Not Found',
    };
  }

  // Replace {City} placeholder in meta description template
  const metaDescription = service.meta_desc_template.replace(/{City}/g, city.name);
  
  return {
    title: `${service.service_name} in ${city.name}, ${city.stateAbbr} | JB Technologies`,
    description: metaDescription,
  };
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ state: string; city: string; service: string }> | { state: string; city: string; service: string };
}) {
  console.log('🟢 SERVICE PAGE - Starting render');
  console.log('🟢 SERVICE PAGE - Raw params:', params);
  
  const resolvedParams = await Promise.resolve(params);
  console.log('🟢 SERVICE PAGE - Resolved params:', resolvedParams);
  console.log('🟢 SERVICE PAGE - State:', resolvedParams.state);
  console.log('🟢 SERVICE PAGE - City:', resolvedParams.city);
  console.log('🟢 SERVICE PAGE - Service:', resolvedParams.service);
  
  const city = getCityBySlugSync(resolvedParams.state, resolvedParams.city);
  console.log('🟢 SERVICE PAGE - City found:', !!city);
  console.log('🟢 SERVICE PAGE - City data:', city);
  
  const service = getServiceBySlug(resolvedParams.service);
  console.log('🟢 SERVICE PAGE - Service found:', !!service);
  console.log('🟢 SERVICE PAGE - Service data:', service);
  
  if (!city) {
    console.error('🔴 SERVICE PAGE - City not found!');
    console.error('  - State slug:', resolvedParams.state);
    console.error('  - City slug:', resolvedParams.city);
    console.error('  - Available cities:', getAllCitiesSync().map(c => ({
      name: c.name,
      state: c.state,
      stateSlug: c.state.toLowerCase().replace(/\s+/g, '-'),
      citySlug: c.name.toLowerCase().replace(/\s+/g, '-')
    })));
  }
  
  if (!service) {
    console.error('🔴 SERVICE PAGE - Service not found!');
    console.error('  - Service slug:', resolvedParams.service);
    console.error('  - Available services:', getAllServicesSync().map(s => s.slug));
  }
  
  if (!city || !service) {
    console.error('🔴 SERVICE PAGE - Calling notFound()');
    notFound();
  }

  console.log('🟢 SERVICE PAGE - Generating content...');
  const content = await generateServiceCityContent(city, service);
  console.log('🟢 SERVICE PAGE - Content generated:', {
    introduction: content.introduction?.substring(0, 50) + '...',
    services: content.services?.substring(0, 50) + '...',
    serviceArea: content.serviceArea?.substring(0, 50) + '...'
  });
  
  const nearbyCities = getNearbyCities(city, 5);
  console.log('🟢 SERVICE PAGE - Nearby cities:', nearbyCities.length);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  const schema = generateServiceSchemaMarkup(city, service, baseUrl);
  const mapUrl = getGoogleMapsStaticUrl(city);
  
  console.log('🟢 SERVICE PAGE - About to render with:');
  console.log('  - City:', city.name);
  console.log('  - Service:', service.service_name);
  console.log('  - Nearby cities:', nearbyCities.length);
  console.log('  - Content exists:', !!content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-black via-luxury-black/95 to-luxury-black/90">
        <div className="absolute inset-0 bg-luxury-black">
          <Image
            src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1920&q=80"
            alt={`${service.service_name} services in ${city.name}, ${city.stateAbbr} - Professional network cabling and infrastructure solutions`}
            fill
            className="object-cover opacity-50"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4 fade-in">
            {service.service_name} in {city.name}, {city.stateAbbr}
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/90 fade-in">
            Professional network infrastructure solutions
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24 pb-24 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Introduction */}
            <section className="fade-in">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-luxury-black">
                {service.service_name} Services in {city.name}
              </h2>
              <p className="text-lg leading-relaxed text-luxury-black/70 whitespace-pre-line">
                {content.introduction}
              </p>
            </section>

            {/* Services */}
            <section className="fade-in">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-luxury-black">
                Our {service.service_name} Services
              </h2>
              <p className="text-lg leading-relaxed text-luxury-black/70 whitespace-pre-line mb-6">
                {content.services}
              </p>
              {service.keywords && service.keywords.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {service.keywords.map((keyword, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 bg-luxury-beige/30 rounded-sm border border-luxury-beige"
                    >
                      <div className="w-2 h-2 rounded-full bg-luxury-blue flex-shrink-0"></div>
                      <span className="text-luxury-black">{keyword}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Service Area */}
            <section className="fade-in">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-luxury-black">
                Service Area
              </h2>
              <p className="text-lg leading-relaxed text-luxury-black/70 whitespace-pre-line">
                {content.serviceArea}
              </p>
            </section>

            {/* Map */}
            <section className="fade-in">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 text-luxury-black">
                Our Location
              </h2>
              <div className="w-full h-96 lg:h-[500px] rounded-lg overflow-hidden luxury-shadow-lg">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <img 
                    src={mapUrl} 
                    alt={`Map showing ${city.name}, ${city.stateAbbr}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-luxury-beige/20 text-luxury-black/60">
                    Google Maps API key required
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Form - Not sticky to prevent covering other widgets */}
            <div className="hidden lg:block fade-in">
              <LeadForm city={city.name} state={city.stateAbbr} />
            </div>
            
            {/* Mobile Lead Button */}
            <MobileLeadButton city={city.name} state={city.stateAbbr} />

            {/* Nearby Cities Widget */}
            <div className="mt-8 lg:mt-12 border border-luxury-beige rounded-lg p-6 lg:p-8 bg-white luxury-shadow fade-in">
              <h3 className="font-display text-xl font-semibold mb-6 text-luxury-black">Nearby Service Areas</h3>
              <ul className="space-y-3">
                {nearbyCities.map((nearbyCity) => {
                  const citySlug = nearbyCity.name.toLowerCase().replace(/\s+/g, '-');
                  const stateSlug = resolvedParams.state;
                  return (
                    <li key={nearbyCity.name}>
                      <Link
                        href={`/${stateSlug}/${citySlug}/${resolvedParams.service}`}
                        className="text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-blue/30 group-hover:bg-luxury-blue transition-colors"></span>
                        {service.service_name} in {nearbyCity.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Other Services Widget */}
            <div className="mt-8 border border-luxury-beige rounded-lg p-6 lg:p-8 bg-white luxury-shadow fade-in">
              <h3 className="font-display text-xl font-semibold mb-6 text-luxury-black">Other Services in {city.name}</h3>
              <ul className="space-y-3">
                {getAllServicesSync()
                  .filter(s => s.slug !== service.slug)
                  .slice(0, 4)
                  .map((otherService) => {
                    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
                    const stateSlug = resolvedParams.state;
                    return (
                      <li key={otherService.slug}>
                        <Link
                          href={`/${stateSlug}/${citySlug}/${otherService.slug}`}
                          className="text-luxury-black/70 hover:text-luxury-blue transition-colors duration-300 text-sm flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-blue/30 group-hover:bg-luxury-blue transition-colors"></span>
                          {otherService.service_name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

