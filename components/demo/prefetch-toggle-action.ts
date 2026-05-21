'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'no-prefetch';

export async function togglePrefetch(enable: boolean) {
  const store = await cookies();
  if (enable) {
    store.delete(COOKIE_NAME);
  } else {
    store.set(COOKIE_NAME, '1', { path: '/', sameSite: 'lax' });
  }
}
