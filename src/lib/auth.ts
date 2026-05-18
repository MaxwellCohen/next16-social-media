import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

const COOKIE_NAME = 'drop-user';
const DEFAULT_HANDLE = 'aurorascharff';

export const getCurrentUserHandle = cache(async (): Promise<string> => {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? DEFAULT_HANDLE;
});

export async function setCurrentUserHandle(handle: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, handle, { httpOnly: true, path: '/', sameSite: 'lax' });
}
