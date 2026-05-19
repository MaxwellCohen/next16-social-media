'use client';

import { useOffline } from 'next/offline';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const offline = useOffline();
  if (!offline) return null;

  return (
    <div
      className={cn(
        'bg-danger fixed inset-x-0 top-0 z-50 flex items-center justify-center py-1.5 text-xs font-medium text-white sm:py-1',
      )}
    >
      You&apos;re offline — reconnecting…
    </div>
  );
}
