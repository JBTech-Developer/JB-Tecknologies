import { City } from './types';

export function generateSchemaMarkup(city: City, baseUrl: string = 'https://jbtech.com') {
  const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `${baseUrl}/${stateSlug}/${citySlug}-network-cabling`;
  const imageUrl = `${baseUrl}/api/og?city=${encodeURIComponent(city.name)}&state=${encodeURIComponent(city.stateAbbr)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `JB Technologies - ${city.name} Cabling Services`,
    image: imageUrl,
    '@id': url,
    url: url,
    telephone: '+1-800-555-0199',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.stateAbbr,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.latitude,
      longitude: city.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Low Voltage Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Cat6 Data Cabling Installation in ${city.name}`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Fiber Optic Splicing & Repair in ${city.name}`,
          },
        },
      ],
    },
  };
}

