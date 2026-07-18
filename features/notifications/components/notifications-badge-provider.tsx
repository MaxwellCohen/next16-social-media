'use client';

import { createContext, useContext, useState } from 'react';

type NotificationsBadgeContextType = {
  seen: boolean;
  markRead: () => void;
};

const NotificationsBadgeContext = createContext<NotificationsBadgeContextType | null>(null);

export function NotificationsBadgeProvider({ children }: { children: React.ReactNode }) {
  const [seen, setSeen] = useState(false);

  function markRead() {
    setSeen(true);
    void fetch('/api/notifications/read', { keepalive: true, method: 'POST' }).catch(() => {});
  }

  return <NotificationsBadgeContext.Provider value={{ markRead, seen }}>{children}</NotificationsBadgeContext.Provider>;
}

export function useNotificationsBadge() {
  const ctx = useContext(NotificationsBadgeContext);
  if (!ctx) throw new Error('useNotificationsBadge must be used within NotificationsBadgeProvider');
  return ctx;
}
