import { NextRequest, NextResponse } from 'next/server';
import { generateSitemapIndex, sitemapToXML } from '@/lib/sitemap-splitter';

/**
 * Generate state-specific sitemap
 * Access at /sitemap-[stateSlug].xml (e.g., /sitemap-georgia.xml)
 * 
 * Note: Next.js App Router handles this route as /sitemap-{stateSlug}.xml
 * where stateSlug is extracted from the URL path
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { stateSlug: string } }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jbtech.com';
  const { stateSitemaps } = generateSitemapIndex(baseUrl);
  
  // Extract state slug from route parameter
  // The route is /sitemap-[stateSlug].xml, so params.stateSlug contains the state slug
  const stateSlug = params.stateSlug || '';
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

