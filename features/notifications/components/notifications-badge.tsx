'use client';

import { use } from 'react';
import { useNotificationsBadge } from '@/features/notifications/components/notifications-badge-provider';

export function NotificationsBadge({ countPromise }: { countPromise: Promise<number> }) {
  const count = use(countPromise);
  const { seen } = useNotificationsBadge();
  if (seen || count === 0) {
    return null;
  }
  return (
    <span
      aria-label={`${count} unread notifications`}
      className="bg-accent ml-auto inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}
