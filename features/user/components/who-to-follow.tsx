import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/features/user/components/follow-button';
import { UserRow } from '@/features/user/components/user-row';
import { getCurrentUserHandle, getWhoToFollow } from '@/features/user/user-queries';

export async function WhoToFollow() {
  const handle = await getCurrentUserHandle();
  const users = await getWhoToFollow(handle);
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Who to follow</h3>
      </header>
      {users.length === 0 ? (
        <p className="text-gray px-4 pb-4 text-xs">
          You&apos;re following everyone we can think of.{' '}
          <Link href="/tag/nextjs" className="text-accent hover:underline">
            Browse tags
          </Link>{' '}
          to find more people.
        </p>
      ) : (
        <ul className="pb-2">
          {users.map(user => {
            return (
              <li key={user.handle}>
                <UserRow
                  handle={user.handle}
                  displayName={user.displayName}
                  action={<FollowButton targetHandle={user.handle} followingPromise={Promise.resolve(false)} />}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function WhoToFollowSkeleton() {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border p-4">
      <h3 className="mb-3 text-sm font-semibold tracking-tight">Who to follow</h3>
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
