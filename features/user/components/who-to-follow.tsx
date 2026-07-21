import { ViewTransition } from 'react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/features/user/components/follow-button';
import { UserRow } from '@/features/user/components/user-row';
import { getWhoToFollow } from '@/features/user/user-queries';

export async function WhoToFollowList() {
  const users = await getWhoToFollow();
  if (users.length === 0) {
    return (
      <p className="text-gray px-4 pb-4 text-xs">
        You&apos;re following everyone we can think of.{' '}
        <PrefetchLink href="/tag" className="text-accent hover:underline">
          Browse tags
        </PrefetchLink>{' '}
        to find more people.
      </p>
    );
  }
  return (
    <ul className="pb-2">
      {users.map(user => (
        <ViewTransition key={user.handle}>
          <li>
            <UserRow
              handle={user.handle}
              displayName={user.displayName}
              action={<FollowButton targetHandle={user.handle} following={false} />}
            />
          </li>
        </ViewTransition>
      ))}
    </ul>
  );
}

export function WhoToFollowShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Who to follow</h3>
      </header>
      {children}
    </section>
  );
}

export function WhoToFollowListSkeleton() {
  return (
    <div className="px-4 py-4 sm:px-5">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}
