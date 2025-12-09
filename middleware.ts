import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle old state routes: /georgia -> /georgia-network-cabling
  // Only redirect if it's a single-segment path that doesn't already have -network-cabling
  if (pathname.match(/^\/([a-z-]+)$/) && 
      !pathname.includes('network-cabling') && 
      !pathname.includes('/') &&
      pathname !== '/') {
    const stateSlug = pathname.slice(1);
    return NextResponse.redirect(
      new URL(`/${stateSlug}-network-cabling`, request.url),
      301
    );
  }

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

