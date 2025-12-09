import { NextResponse } from 'next/server';
import { generateSitemapIndex, sitemapIndexToXML } from '@/lib/sitemap-splitter';

/**
 * Generate sitemap index for large datasets
 * Access at /sitemap-index
 * Returns XML sitemap index with references to state-specific sitemaps
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  const { index } = generateSitemapIndex(baseUrl);
  const xml = sitemapIndexToXML(index);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

