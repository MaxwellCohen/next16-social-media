'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'notifications:last-seen';

export function NotificationsSeenMarker() {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const lastSeen = stored ? Number(stored) : null;
    const rows = document.querySelectorAll<HTMLElement>('[data-notification-at]');
    let newest = lastSeen ?? 0;

    rows.forEach(row => {
      const at = Date.parse(row.dataset.notificationAt ?? '');
      if (!Number.isFinite(at)) {
        return;
      }
      // Only flash on subsequent visits, never on the very first.
      if (lastSeen !== null && at > lastSeen) {
        row.classList.add('flash-in');
      }
      if (at > newest) {
        newest = at;
      }
    });

    // Mark current newest as seen after the animation has had time to play.
    const timeout = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, String(newest));
      window.dispatchEvent(new Event('notifications:seen'));
    }, 1500);

    return () => {
      window.clearTimeout(timeout);
    };
  });

  return null;
}
