'use client';

import { useEffect } from 'react';
import { useNotificationsBadge } from '@/features/notifications/components/notifications-badge-provider';

export function MarkNotificationsRead() {
  const { setSeen } = useNotificationsBadge();
  useEffect(() => {
    setSeen(true);
    void fetch('/api/notifications/read', { keepalive: true, method: 'POST' }).catch(() => {});
  }, [setSeen]);
  return null;
}
