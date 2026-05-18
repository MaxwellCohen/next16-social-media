import 'server-only';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'drop-user';
const DEFAULT_HANDLE = 'aurorascharff';

export async function getCurrentUserHandle(): Promise<string> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? DEFAULT_HANDLE;
}

export async function setCurrentUserHandle(handle: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, handle, { httpOnly: true, path: '/', sameSite: 'lax' });
}
