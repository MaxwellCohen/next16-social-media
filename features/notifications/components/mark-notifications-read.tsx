'use client';

import { useEffect } from 'react';

export function MarkNotificationsRead() {
  useEffect(() => {
    // Fire-and-forget: a route handler doesn't trigger a router refresh, so the badge/list
    // revalidate lazily on next navigation rather than blocking or flashing here.
    void fetch('/api/notifications/read', { keepalive: true, method: 'POST' }).catch(() => {});
  }, []);
  return null;
}
