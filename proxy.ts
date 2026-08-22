import { NextResponse, type NextRequest } from 'next/server';

/** Document speculation rules for hard navigations when JS is off (CSP `script-src 'none'`). */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  // Matches `NO_SCRIPTS` in components/demo/demo-queries.ts
  if (request.cookies.has('no-scripts')) {
    response.headers.set('Speculation-Rules', '"/speculationrules.json"');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|speculationrules\\.json|favicon.ico|logo.svg).*)'],
};
