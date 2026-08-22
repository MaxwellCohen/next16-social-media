import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { NO_SCRIPTS } from '@/components/demo/demo-queries';

/**
 * Plain HTML form target for the no-JS "Scripts off" escape hatch.
 * Must 303-redirect to a fresh document — CSP meta is locked for the document lifetime,
 * so a soft refresh cannot re-enable scripts.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const enable = form.get('enable') === '1';
  const store = await cookies();

  if (enable) {
    store.delete(NO_SCRIPTS);
  } else {
    store.set(NO_SCRIPTS, '1', { path: '/', sameSite: 'lax' });
  }

  const next = form.get('next');
  const referer = request.headers.get('referer');
  let dest: URL;
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) {
    dest = new URL(next, request.url);
  } else if (referer) {
    dest = new URL(referer);
  } else {
    dest = new URL('/', request.url);
  }

  return NextResponse.redirect(dest, 303);
}
