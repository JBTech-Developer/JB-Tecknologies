import { getAllStates, getAllCitiesSync } from './cities';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate sitemap split by state for large datasets (5,000+ cities)
 * Returns a sitemap index and individual state sitemaps
 */
export function generateSitemapIndex(baseUrl: string = 'https://jbtech.com'): {
  index: SitemapEntry[];
  stateSitemaps: Map<string, SitemapEntry[]>;
} {
  const states = getAllStates();
  const index: SitemapEntry[] = [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const stateSitemaps = new Map<string, SitemapEntry[]>();

  // Generate individual state sitemaps
  states.forEach((state) => {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    const stateSitemap: SitemapEntry[] = [
      // State hub page
      {
        url: `${baseUrl}/${stateSlug}-network-cabling`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];

    // Add city pages for this state
    const cities = getAllCitiesSync().filter(
      (city) =>
        city.state.toLowerCase().replace(/\s+/g, '-') === stateSlug ||
        city.stateAbbr.toLowerCase() === stateSlug
    );

    cities.forEach((city) => {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
      stateSitemap.push({
        url: `${baseUrl}/${stateSlug}/${citySlug}-network-cabling`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });

    stateSitemaps.set(stateSlug, stateSitemap);

    // Add to index
    index.push({
      url: `${baseUrl}/sitemap-${stateSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return { index, stateSitemaps };
}

/**
 * Convert sitemap entries to XML format
 */
export function sitemapToXML(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  return xml;
}

/**
 * Generate sitemap index XML
 */
export function sitemapIndexToXML(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <sitemap>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;
  return xml;
}

