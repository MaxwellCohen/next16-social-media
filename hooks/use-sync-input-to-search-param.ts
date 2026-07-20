'use client';

import { useLayoutEffect, type RefObject } from 'react';

const RESTORE_WINDOW_MS = 1500;
let lastTyped: { param: string; at: number } | null = null;

/**
 * Sync an uncontrolled input to a URL search param on mount, before paint.
 * Needed on soft navigations because Activity can preserve a stale DOM value
 * that no longer matches the URL, and to restore focus when a soft navigation
 * spuriously blurs the input.
 */
export function useSyncInputToSearchParam(ref: RefObject<HTMLInputElement | null>, param: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.value = new URLSearchParams(window.location.search).get(param) ?? '';

    function onInput() {
      lastTyped = { at: Date.now(), param };
    }

    function onFocusOut(event: FocusEvent) {
      if (event.relatedTarget) return;
      if (!lastTyped || lastTyped.param !== param || Date.now() - lastTyped.at > RESTORE_WINDOW_MS) return;
      requestAnimationFrame(() => {
        const node = ref.current;
        if (!node || !node.isConnected || document.activeElement === node) return;
        node.focus();
        const end = node.value.length;
        node.setSelectionRange(end, end);
      });
    }

    el.addEventListener('input', onInput);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, [ref, param]);
}
