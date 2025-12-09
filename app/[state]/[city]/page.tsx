import { notFound } from 'next/navigation';
import { getCityBySlugSync, getNearbyCities, getAllCitiesSync } from '@/lib/cities';
import { generateCityContent } from '@/lib/content-generator';
import { generateSchemaMarkup } from '@/lib/schema';
import { getGoogleMapsStaticUrl } from '@/lib/maps';
import LeadForm from '@/components/LeadForm';
import MobileLeadButton from '@/components/MobileLeadButton';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  // In development, return empty array to avoid pre-rendering all pages
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  // Generate params for all cities (loads from CMS/JSON/fallback)
  const cities = getAllCitiesSync();
  return cities.map(city => {
    const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
    return {
      state: stateSlug,
      city: `${citySlug}-network-cabling`,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: { state: string; city: string };
}): Promise<Metadata> {
  const city = getCityBySlugSync(params.state, params.city);
  
  if (!city) {
    return {
      title: 'City Not Found',
    };
  }

  return {
    title: `Network Cabling Services in ${city.name}, ${city.stateAbbr} | JB Technologies`,
    description: `Professional network cabling installation in ${city.name}, ${city.stateAbbr}. Cat6, fiber optic, and structured cabling services.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: { state: string; city: string };
}) {
  const city = getCityBySlugSync(params.state, params.city);
  
  if (!city) {
    notFound();
  }

  const content = await generateCityContent(city);
  const nearbyCities = getNearbyCities(city, 10);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  const schema = generateSchemaMarkup(city, baseUrl);
  const mapUrl = getGoogleMapsStaticUrl(city);

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
                Network Cabling Services in {city.name}, {city.stateAbbr}
              </h1>
              <div className="w-full h-64 bg-muted rounded-lg mb-4 overflow-hidden relative">
                {/* Dynamic Hero Image */}
                <img
                  src={`/api/og?city=${encodeURIComponent(city.name)}&state=${encodeURIComponent(city.stateAbbr)}`}
                  alt={`Certified Installers: ${city.name} - Network Cabling Technician in ${city.name}, ${city.stateAbbr}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Professional Cabling Services in {city.name}</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {content.introduction}
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Services</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {content.services}
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Cat6 Data Cabling Installation</li>
                <li>Fiber Optic Splicing & Repair</li>
                <li>Structured Cabling Systems</li>
                <li>Network Infrastructure Design</li>
                <li>Low-Voltage Installation</li>
              </ul>
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
                  const stateSlug = params.state;
                  return (
                    <li key={nearbyCity.name}>
                      <Link
                        href={`/${stateSlug}/${citySlug}-network-cabling`}
                        className="text-primary hover:underline"
                      >
                        {nearbyCity.name} Network Cabling
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

