'use client';

import { use, useEffect } from 'react';
import { useNotificationsBadge } from '@/features/notifications/components/notifications-badge-provider';

export function MarkNotificationsRead({ countPromise }: { countPromise: Promise<number> }) {
  const count = use(countPromise);
  const { markRead } = useNotificationsBadge();
  useEffect(() => {
    if (count > 0) {
      markRead();
    }
  }, [count, markRead]);
  return null;
}
