'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Keep an uncontrolled input in sync with a URL search param without clobbering
 * a value the user typed during/before hydration or one preserved by React
 * Activity. Reads `window.location` so the parent route stays statically
 * prerendered.
 *
 *  - On mount (incl. Activity restore): only seed from the URL if the input is
 *    currently empty. Preserves pre-hydration keystrokes and Activity state.
 *  - On back/forward (`popstate`): always sync to the URL.
 */
export function useSyncInputFromSearchParam(ref: RefObject<HTMLInputElement | null>, key: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => new URLSearchParams(window.location.search).get(key) ?? '';

    if (el.value === '') el.value = read();

    const onPopState = () => {
      el.value = read();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [ref, key]);
}
