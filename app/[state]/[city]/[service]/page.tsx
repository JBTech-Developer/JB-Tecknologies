import { notFound } from 'next/navigation';
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
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">
                {service.service_name} in {city.name}, {city.stateAbbr}
              </h1>
              <div className="w-full h-64 bg-muted rounded-lg mb-4 overflow-hidden relative">
                {/* Dynamic Hero Image using Cloudinary URL API with hero_overlay_text template */}
                <img
                  src={`https://res.cloudinary.com/jbtech/image/upload/w_1000,co_white,l_text:Arial_80_bold:${encodeURIComponent(service.hero_overlay_text.replace(/{City}/g, city.name))}/cabling-bg.jpg`}
                  alt={`${service.service_name} services in ${city.name}, ${city.stateAbbr}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{service.service_name} Services in {city.name}</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {content.introduction}
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our {service.service_name} Services</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {content.services}
              </p>
              {service.keywords && service.keywords.length > 0 && (
                <ul className="list-disc list-inside mt-4 space-y-2">
                  {service.keywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Service Area */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Service Area</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {content.serviceArea}
              </p>
            </section>

            {/* Map */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Location</h2>
              <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <img 
                    src={mapUrl} 
                    alt={`Map showing ${city.name}, ${city.stateAbbr}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Google Maps API key required
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Sticky Form - Hidden on mobile */}
            <div className="hidden lg:block sticky top-4">
              <LeadForm city={city.name} state={city.stateAbbr} />
            </div>
            
            {/* Mobile Lead Button */}
            <MobileLeadButton city={city.name} state={city.stateAbbr} />

            {/* Nearby Cities Widget */}
            <div className="mt-8 border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Nearby Service Areas</h3>
              <ul className="space-y-2">
                {nearbyCities.map((nearbyCity) => {
                  const citySlug = nearbyCity.name.toLowerCase().replace(/\s+/g, '-');
                  const stateSlug = resolvedParams.state;
                  return (
                    <li key={nearbyCity.name}>
                      <Link
                        href={`/${stateSlug}/${citySlug}/${resolvedParams.service}`}
                        className="text-primary hover:underline"
                      >
                        {service.service_name} in {nearbyCity.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Other Services Widget */}
            <div className="mt-8 border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Other Services in {city.name}</h3>
              <ul className="space-y-2">
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
                          className="text-primary hover:underline"
                        >
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

