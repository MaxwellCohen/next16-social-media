import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { Poller } from '@/components/poller';
import { NotificationList, NotificationListSkeleton } from '@/features/notifications/components/notification-list';
import { NotificationsSeenMarker } from '@/features/notifications/components/notifications-seen-marker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/notifications' },
  description: 'Activity on your drops.',
  robots: { follow: false, index: false },
  title: 'Notifications',
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <Poller intervalMs={5000} />
      <Suspense fallback={<NotificationListSkeleton />}>
        <Crossfade>
          <NotificationList />
        </Crossfade>
        <NotificationsSeenMarker />
      </Suspense>
    </div>
  );
}
