'use client';

import { createContext, useContext, useState } from 'react';

type NotificationsBadgeContextType = {
  seen: boolean;
  setSeen: (seen: boolean) => void;
};

const NotificationsBadgeContext = createContext<NotificationsBadgeContextType | null>(null);

export function NotificationsBadgeProvider({ children }: { children: React.ReactNode }) {
  const [seen, setSeen] = useState(false);
  return <NotificationsBadgeContext.Provider value={{ seen, setSeen }}>{children}</NotificationsBadgeContext.Provider>;
}

export function useNotificationsBadge() {
  const ctx = useContext(NotificationsBadgeContext);
  if (!ctx) throw new Error('useNotificationsBadge must be used within NotificationsBadgeProvider');
  return ctx;
}
