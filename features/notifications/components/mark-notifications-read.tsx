'use client';

import { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, UNREAD_KEY } from '@/lib/swr';

/** JS enhancement: auto-mark read on visit. Baseline is the page form. */
export function MarkNotificationsRead() {
  const { data: count = 0 } = useSWR<number>(UNREAD_KEY, fetcher);
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (count <= 0) return;

    function markRead() {
      void mutate(UNREAD_KEY, 0, { revalidate: false });
      void fetch('/api/notifications/read', { keepalive: true, method: 'POST' }).catch(() => {});
    }
    // @ts-expect-error - document.prerendering is not typed
    if (typeof document !== 'undefined' && document?.prerendering) {
      document.addEventListener('prerenderingchange', markRead, { once: true });
      return () => document.removeEventListener('prerenderingchange', markRead);
    }

    markRead();
  }, [count, mutate]);
  return null;
}
