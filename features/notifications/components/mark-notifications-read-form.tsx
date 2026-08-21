import { Button } from '@/components/ui/button';
import { markNotificationsRead } from '@/features/notifications/notifications-actions';
import { getUnreadNotificationCount } from '@/features/notifications/notifications-queries';

export async function MarkNotificationsReadForm() {
  const count = await getUnreadNotificationCount();
  if (count === 0) return null;
  return (
    <form action={markNotificationsRead} className="ml-auto">
      <Button type="submit" variant="ghost" size="sm">
        Mark as read
      </Button>
    </form>
  );
}
