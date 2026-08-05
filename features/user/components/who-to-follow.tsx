import { ViewTransition } from 'react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/features/user/components/follow-button';
import { UserRow } from '@/features/user/components/user-row';
import { getWhoToFollow } from '@/features/user/user-queries';

const cardClass = 'border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border';

export async function WhoToFollow() {
  const users = await getWhoToFollow();
  return (
    <section className={cardClass}>
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Who to follow</h3>
      </header>
      {users.length === 0 ? (
        <p className="text-gray px-4 pb-4 text-xs">
          You&apos;re following everyone we can think of.{' '}
          <PrefetchLink href="/tag" className="text-accent hover:underline">
            Browse tags
          </PrefetchLink>{' '}
          to find more people.
        </p>
      ) : (
        <div className="flex flex-col pb-2">
          {users.map(user => (
            <ViewTransition key={user.handle}>
              <UserRow
                handle={user.handle}
                displayName={user.displayName}
                action={<FollowButton targetHandle={user.handle} following={false} />}
              />
            </ViewTransition>
          ))}
        </div>
      )}
    </section>
  );
}

export function WhoToFollowSkeleton() {
  return (
    <div className="px-4 py-4">
      <Skeleton className="mb-3 h-3.5 w-20 rounded" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
