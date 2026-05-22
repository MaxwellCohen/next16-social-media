'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Keep an uncontrolled input in sync with a URL search param without clobbering
 * any value the user typed during/before hydration. Reads `window.location` so
 * the parent route can stay statically prerendered.
 *
 * Resyncs on:
 *  - mount (handles initial render + Activity restore re-mount)
 *  - back/forward navigation (`popstate`)
 *  - client-side `router.push`/`router.replace` (`navigate` event)
 */
export function useSyncInputFromSearchParam(ref: RefObject<HTMLInputElement | null>, key: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const value = new URLSearchParams(window.location.search).get(key) ?? '';
      if (el.value !== value) el.value = value;
    };

    apply();
    window.addEventListener('popstate', apply);
    window.addEventListener('navigate', apply);
    return () => {
      window.removeEventListener('popstate', apply);
      window.removeEventListener('navigate', apply);
    };
  }, [ref, key]);
}
