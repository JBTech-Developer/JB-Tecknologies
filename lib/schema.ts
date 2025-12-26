import { City, Service } from './types';

export function generateSchemaMarkup(city: City, baseUrl: string = 'https://jbtech.com') {
  const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `${baseUrl}/${stateSlug}/${citySlug}-network-cabling`;
  // Use Cloudinary URL API for dynamic image generation
  const imageUrl = `https://res.cloudinary.com/jbtech/image/upload/w_1000,co_white,l_text:Arial_80_bold:Serving%20${encodeURIComponent(city.name)}/cabling-bg.jpg`;

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

export function generateServiceSchemaMarkup(city: City, service: Service, baseUrl: string = 'https://jbtech.com') {
  const stateSlug = city.state.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `${baseUrl}/${stateSlug}/${citySlug}/${service.slug}`;
  // Use Cloudinary URL API for dynamic image generation with hero_overlay_text template
  const heroText = service.hero_overlay_text.replace(/{City}/g, city.name);
  const imageUrl = `https://res.cloudinary.com/jbtech/image/upload/w_1000,co_white,l_text:Arial_80_bold:${encodeURIComponent(heroText)}/cabling-bg.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `JB Technologies - ${service.service_name} in ${city.name}`,
    image: imageUrl,
    '@id': url,
    url: url,
    telephone: '+1-770-637-2094',
    priceRange: '$$',
    description: service.meta_desc_template.replace(/{City}/g, city.name),
    areaServed: {
      '@type': 'City',
      name: city.name,
      address: {
        '@type': 'PostalAddress',
        addressRegion: city.stateAbbr,
      },
    },
  };
}

