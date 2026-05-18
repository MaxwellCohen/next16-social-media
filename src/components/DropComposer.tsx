import { NewDropModal } from '@/components/NewDropModal';
import { Avatar } from '@/components/ui/Avatar';
import { getCurrentUser } from '@/data/queries/user';

export async function DropComposer() {
  const user = await getCurrentUser();
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
      <Avatar name={user.displayName} color={user.avatarColor} size="md" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray text-sm">What did you ship today?</span>
        <NewDropModal authorName={user.displayName} authorColor={user.avatarColor} />
      </div>
    </section>
  );
}

export function DropComposerSkeleton() {
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
      <div className="skeleton-animation h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <div className="skeleton-animation h-4 w-44" />
        <div className="skeleton-animation h-9 w-24 rounded-full" />
      </div>
    </section>
  );
}
