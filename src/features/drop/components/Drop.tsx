import { Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { TagPill } from '@/components/ui/TagPill';
import { getDropUserState } from '@/data/queries/drop';
import { getCurrentUser, getUserByHandle } from '@/data/queries/user';
import { DropActions, DropActionsSkeleton } from '@/features/drop/components/DropActions';
import { DropBody } from '@/features/drop/components/DropBody';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import type { Drop as DropT } from '@/types/drop';

type Props = {
  drop: DropT;
  compact?: boolean;
  repostedBy?: string;
};

export function Drop({ drop, compact = false, repostedBy }: Props) {
  return (
    <article className="group/drop border-divider/70 hover:bg-card/40 dark:border-divider-dark/70 dark:hover:bg-card-dark/40 relative border-b transition-colors">
      <Link href={`/drop/${drop.parentId ?? drop.id}`} aria-label="Open drop" className="absolute inset-0 z-10" />
      {repostedBy ? (
        <Suspense fallback={null}>
          <Reposter handle={repostedBy} />
        </Suspense>
      ) : null}
      <div className="relative flex gap-3 px-4 py-4 sm:px-5">
        <Link href={`/u/${drop.authorHandle}`} className="relative z-20 shrink-0">
          <Suspense fallback={<UserAvatarSkeleton size="md" />}>
            <UserAvatar handle={drop.authorHandle} size="md" />
          </Suspense>
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <header className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
            <Suspense fallback={<AuthorNameSkeleton />}>
              <AuthorName handle={drop.authorHandle} />
            </Suspense>
            <span className="text-gray font-mono text-[12px]">·</span>
            <span className="text-gray font-mono text-[12px]">
              <RelativeTime date={drop.createdAt} />
            </span>
          </header>
          <DropBody body={drop.body} compact={compact} />
          {drop.tags.length > 0 ? (
            <div className="relative z-20 flex flex-wrap gap-1.5">
              {drop.tags.map(t => {
                return <TagPill key={t} tag={t} />;
              })}
            </div>
          ) : null}
          <div className="relative z-20">
            <Suspense fallback={<DropActionsSkeleton />}>
              <DropActions drop={drop} userStatePromise={getDropUserState(drop.id)} />
            </Suspense>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DropSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <div className="skeleton-animation h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="skeleton-animation h-3 w-40" />
          <div className="skeleton-animation h-4 w-full" />
          <div className="skeleton-animation h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function DropListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        return (
          <li key={i}>
            <DropSkeleton />
          </li>
        );
      })}
    </ul>
  );
}

async function AuthorName({ handle }: { handle: string }) {
  const author = await getUserByHandle(handle);
  return (
    <>
      <Link
        href={`/u/${author.handle}`}
        className="relative z-20 font-semibold tracking-tight text-black hover:underline dark:text-white"
      >
        {author.displayName}
      </Link>
      <Link href={`/u/${author.handle}`} className="text-gray relative z-20 font-mono text-[12px]">
        @{author.handle}
      </Link>
    </>
  );
}

function AuthorNameSkeleton() {
  return (
    <>
      <span className="skeleton-animation h-4 w-24 rounded" />
      <span className="skeleton-animation h-3 w-16 rounded" />
    </>
  );
}

async function Reposter({ handle }: { handle: string }) {
  const [reposter, current] = await Promise.all([getUserByHandle(handle), getCurrentUser()]);
  return (
    <Link
      href={`/u/${reposter.handle}`}
      className="text-gray hover:text-success relative z-20 flex w-fit items-center gap-2 px-4 pt-3 text-xs sm:px-5"
    >
      <Repeat2 className="h-3 w-3" />
      <span>{reposter.handle === current.handle ? 'You' : reposter.displayName} reposted</span>
    </Link>
  );
}
