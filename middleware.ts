import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔷 MIDDLEWARE - Pathname:', pathname);

  // Handle old state routes: /georgia -> /georgia/network-cabling
  // Only redirect if it's a single-segment path that doesn't already have network-cabling
  if (pathname.match(/^\/([a-z-]+)$/) && 
      !pathname.includes('network-cabling') && 
      !pathname.includes('/') &&
      pathname !== '/') {
    const stateSlug = pathname.slice(1);
    console.log('🔷 MIDDLEWARE - Redirecting to:', `/${stateSlug}/network-cabling`);
    return NextResponse.redirect(
      new URL(`/${stateSlug}/network-cabling`, request.url),
      301
    );
  }

  // Handle old format: /georgia-network-cabling -> /georgia/network-cabling
  if (pathname.match(/^\/([a-z-]+)-network-cabling\/?$/) && !pathname.includes('/network-cabling/')) {
    const stateSlug = pathname.replace('-network-cabling', '').replace(/\//g, '');
    console.log('🔷 MIDDLEWARE - Redirecting old format to:', `/${stateSlug}/network-cabling`);
    return NextResponse.redirect(
      new URL(`/${stateSlug}/network-cabling`, request.url),
      301
    );
  }

  console.log('🔷 MIDDLEWARE - Passing through:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

