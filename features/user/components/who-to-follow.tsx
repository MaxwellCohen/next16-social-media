import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/features/user/components/follow-button';
import { UserRow } from '@/features/user/components/user-row';
import { getCurrentUserHandle, getWhoToFollow } from '@/features/user/user-queries';

export function WhoToFollow() {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Who to follow</h3>
      </header>
      <Suspense fallback={<WhoToFollowListSkeleton />}>
        <ViewTransition enter="auto" default="none">
          <WhoToFollowList />
        </ViewTransition>
      </Suspense>
    </section>
  );
}

async function WhoToFollowList() {
  const handle = await getCurrentUserHandle();
  const users = await getWhoToFollow(handle);
  if (users.length === 0) {
    return (
      <p className="text-gray px-4 pb-4 text-xs">
        You&apos;re following everyone we can think of.{' '}
        <Link href="/tag" className="text-accent hover:underline">
          Browse tags
        </Link>{' '}
        to find more people.
      </p>
    );
  }
  return (
    <ul className="pb-2">
      {users.map(user => {
        return (
          <ViewTransition key={user.handle}>
            <li>
              <UserRow
                handle={user.handle}
                displayName={user.displayName}
                action={<FollowButton targetHandle={user.handle} followingPromise={Promise.resolve(false)} />}
              />
            </li>
          </ViewTransition>
        );
      })}
    </ul>
  );
}

function WhoToFollowListSkeleton() {
  return (
    <div className="px-4 py-5 sm:px-5">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function WhoToFollowSkeleton() {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Who to follow</h3>
      </header>
      <WhoToFollowListSkeleton />
    </section>
  );
}
