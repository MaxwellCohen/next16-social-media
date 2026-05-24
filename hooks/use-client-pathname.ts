'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns `window.location.pathname` on the client, `null` on the server.
 * Does not call `usePathname` from Next.js — avoids the "uncached data"
 * error in cache-components mode and the rewrite mismatch issue.
 *
 * Uses `useSyncExternalStore` so React can diff server (`null`) vs client
 * (real pathname) without an extra render cycle.
 */
export function useClientPathname(): string | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.location.pathname,
    () => null,
  );
}
