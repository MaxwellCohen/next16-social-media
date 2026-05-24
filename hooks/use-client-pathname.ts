'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Client-only pathname hook. Returns `window.location.pathname` on the
 * client and `null` on the server.
 *
 * This avoids two problems with Next.js's `usePathname`:
 * 1. The "uncached data" error in cache-components mode on dynamic routes.
 * 2. Incorrect pathname during SSR when using rewrites/proxy.
 *
 * Ideally Next.js would ship `usePathname({ ssr: false })` natively so
 * this workaround isn't needed.
 */
export function useClientPathname(): string | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.location.pathname,
    () => null,
  );
}
