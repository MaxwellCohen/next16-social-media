'use client';

import { useLayoutEffect, type RefObject } from 'react';

/**
 * Sync an uncontrolled input to a URL search param on mount, before paint.
 * Needed on soft navigations because Activity can preserve a stale DOM value
 * that no longer matches the URL.
 */
export function useSyncInputToSearchParam(ref: RefObject<HTMLInputElement | null>, param: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.value = new URLSearchParams(window.location.search).get(param) ?? '';
  }, [ref, param]);
}
