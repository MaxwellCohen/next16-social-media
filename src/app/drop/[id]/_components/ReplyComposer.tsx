import { ReplyComposerForm } from '@/app/drop/[id]/_components/ReplyComposerForm';
import { getCurrentUser } from '@/data/queries/user';

type Props = {
  dropId: string;
};

/**
 * Reply composer shown above the replies thread on the drop detail page.
 * Server component that fetches the current user; form is a client island.
 */
export async function ReplyComposer({ dropId }: Props) {
  const user = await getCurrentUser();
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 border-b p-4 sm:p-5">
      <ReplyComposerForm dropId={dropId} authorName={user.displayName} authorColor={user.avatarColor} />
    </section>
  );
}

/**
 * Layout-matching skeleton. Reserves the same vertical space as the real
 * composer so the parent drop and the replies thread don't shift when this
 * suspends.
 */
export function ReplyComposerSkeleton() {
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 border-b p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="skeleton-animation h-10 w-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2 pt-1.5">
            <div className="skeleton-animation h-4 w-3/4" />
            <div className="skeleton-animation h-4 w-1/2" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="skeleton-animation h-8 w-20 rounded-full" />
        </div>
      </div>
    </section>
  );
}
