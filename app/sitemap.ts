import { MetadataRoute } from 'next';
import { getAllCitiesSync, getAllStates } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Add state hub pages (using correct format: /georgia-network-cabling)
  const states = getAllStates();
  states.forEach((state) => {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      url: `${baseUrl}/${stateSlug}-network-cabling`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Add city pages
  const cities = getAllCitiesSync();
  cities.forEach((city) => {
    const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
    routes.push({
      url: `${baseUrl}/${stateSlug}/${citySlug}-network-cabling`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return routes;
}
