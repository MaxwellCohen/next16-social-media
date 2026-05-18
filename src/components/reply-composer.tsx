import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/data/queries/user';

/**
 * Read-only reply composer shown above the replies thread.
 * Mirrors the new-drop composer look so the page feels complete,
 * but doesn't actually post (we don't have reply mutations wired yet).
 */
export async function ReplyComposer() {
  const user = await getCurrentUser();
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
      <Avatar name={user.displayName} color={user.avatarColor} size="md" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray text-sm">Reply to this drop…</span>
        <Button size="sm" disabled>
          Reply
        </Button>
      </div>
    </section>
  );
}
