import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Extract hostname without port (e.g., example.com, app.example.com, localhost)
  const hostname = host.split(':')[0].toLowerCase();

  // Environment-configured domains
  const landingDomain = (process.env.LANDING_DOMAIN || 'example.com').toLowerCase();
  const appDomain = (process.env.APP_DOMAIN || 'app.example.com').toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${appDomain}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${landingDomain}`;

  // Query parameter override for local development testing (e.g. ?__domain=landing or ?__domain=app)
  const queryDomain = request.nextUrl.searchParams.get('__domain');

  const isLandingHost =
    queryDomain === 'landing' ||
    hostname === landingDomain ||
    hostname === `www.${landingDomain}` ||
    hostname === 'landing.localhost';

  const isAppHost =
    queryDomain === 'app' ||
    hostname === appDomain ||
    hostname === 'app.localhost';

  const pathname = request.nextUrl.pathname;

  // 1. Static files, assets, API routes, and Next.js internals pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Routing when accessing example.com (Landing & Blog)
  if (isLandingHost) {
    // The homepage uses the internal rewrite in next.config.mjs.
    // Blog is served natively on example.com
    if (pathname.startsWith('/blog')) {
      return NextResponse.next();
    }

    // Direct /landing URL is valid on landing domain
    if (pathname === '/landing') {
      return NextResponse.next();
    }

    // App routes (cart, checkout, account, auth, orders, rewards, products, special)
    // redirect to app.example.com
    const appRoutes = [
      '/cart',
      '/checkout',
      '/account',
      '/auth',
      '/orders',
      '/rewards',
      '/products',
      '/special',
    ];

    if (appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
      // In production (or explicit test), redirect to customer app
      const targetUrl = new URL(pathname + request.nextUrl.search, appUrl);
      return NextResponse.redirect(targetUrl, 307);
    }

    return NextResponse.next();
  }

  // 3. Routing when accessing app.example.com (Store App)
  if (isAppHost) {
    // If user accesses /landing on the app domain, redirect to main landing site
    if (pathname === '/landing') {
      return NextResponse.redirect(new URL('/', siteUrl), 307);
    }

    // If user accesses /blog on the app domain, redirect to main blog site
    if (pathname.startsWith('/blog')) {
      return NextResponse.redirect(new URL(pathname + request.nextUrl.search, siteUrl), 307);
    }

    return NextResponse.next();
  }

  // 4. Default fallback (e.g. standard localhost:3000 without custom domain)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
