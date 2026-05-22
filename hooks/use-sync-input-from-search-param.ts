'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Keep an uncontrolled input in sync with a URL search param without clobbering
 * any value the user typed during/before hydration. Reads `window.location` so
 * the parent route can stay statically prerendered.
 */
export function useSyncInputFromSearchParam(ref: RefObject<HTMLInputElement | null>, key: string) {
  useEffect(() => {
    const sync = () => {
      const el = ref.current;
      if (!el) return;
      const value = new URLSearchParams(window.location.search).get(key) ?? '';
      if (el.value === '' && value !== '') el.value = value;
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [ref, key]);
}
