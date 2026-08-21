import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { RefreshButton } from '@/components/ui/refresh-button';
import { MarkNotificationsRead } from '@/features/notifications/components/mark-notifications-read';
import { MarkNotificationsReadForm } from '@/features/notifications/components/mark-notifications-read-form';
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
      <PageHeader back title="Activity">
        <Suspense fallback={null}>
          <MarkNotificationsReadForm />
        </Suspense>
        <RefreshButton label="Refresh activity" />
      </PageHeader>
      <MarkNotificationsRead />
      <Suspense fallback={<NotificationListSkeleton />}>
        <NotificationList />
      </Suspense>
    </div>
  );
}
