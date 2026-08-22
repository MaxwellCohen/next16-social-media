import 'server-only';

import { cookies } from 'next/headers';

export const NO_PREFETCH = 'no-prefetch';
export const NO_SCRIPTS = 'no-scripts';

export async function isPrefetchEnabled() {
  return !(await cookies()).has(NO_PREFETCH);
}

/** When false, CSP is `script-src 'none'` so Next/React and app scripts cannot run. */
export async function isScriptsEnabled() {
  return !(await cookies()).has(NO_SCRIPTS);
}
