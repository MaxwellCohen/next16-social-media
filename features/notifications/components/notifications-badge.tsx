'use client';

import { use, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'notifications:last-seen';
const EVENT_NAME = 'notifications:seen';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  };
}

function getLastSeen() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? Number(stored) : null;
}

export function NotificationsBadge({ newestAtPromise }: { newestAtPromise: Promise<string | null> }) {
  const newestAt = use(newestAtPromise);
  const lastSeen = useSyncExternalStore(subscribe, getLastSeen, () => null);

  if (!newestAt) {
    return null;
  }
  const newest = Date.parse(newestAt);
  // First visit (lastSeen === null) shouldn't show a dot.
  if (lastSeen === null || newest <= lastSeen) {
    return null;
  }
  return (
    <span aria-label="Unseen notifications" className="bg-accent ml-auto inline-block h-2 w-2 shrink-0 rounded-full" />
  );
}
