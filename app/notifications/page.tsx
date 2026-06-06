import { Suspense } from 'react';
import { Poller } from '@/components/poller';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { MarkNotificationsRead } from '@/features/notifications/components/mark-notifications-read';
import { NotificationList, NotificationListSkeleton } from '@/features/notifications/components/notification-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/notifications' },
  description: 'Activity on your drops.',
  robots: { follow: false, index: false },
  title: 'Activity',
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Activity" />
      <Poller intervalMs={5000} />
      <MarkNotificationsRead />
      <Suspense fallback={<NotificationListSkeleton />}>
        <Crossfade>
          <NotificationList />
        </Crossfade>
      </Suspense>
    </div>
  );
}
