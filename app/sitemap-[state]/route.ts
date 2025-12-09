import { NextRequest, NextResponse } from 'next/server';
import { generateSitemapIndex, sitemapToXML } from '@/lib/sitemap-splitter';

/**
 * Generate state-specific sitemap
 * Access at /sitemap-[stateSlug] (e.g., /sitemap-georgia)
 * Returns XML content with proper headers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { state: string } }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  const { stateSitemaps } = generateSitemapIndex(baseUrl);
  
  // Extract state slug from route parameter
  const stateSlug = params.state || '';
  const stateSitemap = stateSitemaps.get(stateSlug);

  if (!stateSitemap) {
    return new NextResponse('Sitemap not found', { status: 404 });
  }

  const xml = sitemapToXML(stateSitemap);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

