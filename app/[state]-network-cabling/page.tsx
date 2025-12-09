import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStateBySlug, getCitiesByState, getAllStates } from '@/lib/cities';

export async function generateStaticParams() {
  // In development, return empty array to avoid pre-rendering all pages
  if (process.env.NODE_ENV === 'development') {
    return [];
  }
  const states = getAllStates();
  return states.map(state => ({
    state: `${state.name.toLowerCase().replace(/\s+/g, '-')}-network-cabling`,
  }));
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }> | { state: string };
}) {
  // Extract state slug by removing '-network-cabling' suffix
  // Handle Promise during static generation
  const resolvedParams = await Promise.resolve(params);
  const stateSlug = resolvedParams?.state?.replace('-network-cabling', '') || '';
  const stateData = getStateBySlug(stateSlug);
  
  if (!stateData) {
    notFound();
  }

  const cities = getCitiesByState(stateSlug);
  const topCities = cities.slice(0, 30);

  // Generate map URL with all cities
  const mapMarkers = cities.slice(0, 20).map(city => 
    `markers=color:0x4285F4|label:${city.name.charAt(0)}|${city.latitude},${city.longitude}`
  ).join('&');
  const mapCenter = cities[0] || { latitude: 33.749, longitude: -84.388 };
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.latitude},${mapCenter.longitude}&zoom=7&size=1200x600&${mapMarkers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;

  // Use the state slug without suffix for city links
  const stateSlugForLinks = stateData.name.toLowerCase().replace(/\s+/g, '-');

  return (
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

      {/* Cities Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Cities We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCities.map((city) => {
            const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={city.name}
                href={`/${stateSlugForLinks}/${citySlug}-network-cabling`}
                className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Population: {city.population.toLocaleString()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

