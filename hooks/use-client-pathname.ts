'use client';

import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);

  // popstate fires on back/forward navigation
  window.addEventListener('popstate', callback);

  return () => {
    listeners.delete(callback);
    window.removeEventListener('popstate', callback);
  };
}

// Patch pushState/replaceState once to notify subscribers on soft navigations.
if (typeof window !== 'undefined') {
  const original = { pushState: history.pushState, replaceState: history.replaceState };
  for (const method of ['pushState', 'replaceState'] as const) {
    history[method] = function (...args: Parameters<typeof history.pushState>) {
      original[method].apply(this, args);
      listeners.forEach(fn => fn());
    };
  }
}

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
    subscribe,
    () => window.location.pathname,
    () => null,
  );
}
