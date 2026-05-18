import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDropsByAuthor, getRepliesByAuthor } from '@/data/queries/drop';
import { getCurrentUser, getUserByHandle, isFollowing } from '@/data/queries/user';
import { Drop, DropListSkeleton } from '@/features/drop/components/Drop';
import { FollowButton } from '@/features/user/components/FollowButton';
import { ProfileTabs } from '@/features/user/components/ProfileTabs';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import { cn, formatCount } from '@/lib/utils';
import type { Metadata } from 'next';

type Params = Pick<PageProps<'/u/[handle]'>, 'params'>;

type Tab = 'drops' | 'replies';

function parseTab(value: string | string[] | undefined): Tab {
  return value === 'replies' ? 'replies' : 'drops';
}

export async function generateMetadata({ params }: PageProps<'/u/[handle]'>): Promise<Metadata> {
  const { handle } = await params;
  const user = await getUserByHandle(handle);
  const title = `${user.displayName} (@${user.handle})`;
  const url = `/u/${user.handle}`;
  return {
    alternates: { canonical: url },
    description: user.bio,
    openGraph: { description: user.bio, title, type: 'profile', url, username: user.handle },
    title,
    twitter: { card: 'summary', creator: `@${user.handle}`, description: user.bio, title },
  };
}

export const unstable_prefetch = 'force-runtime';

export default function ProfilePage({ params, searchParams }: PageProps<'/u/[handle]'>) {
  return (
    <div>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader params={params} />
      </Suspense>
      <Suspense fallback={<ProfileTabsSkeleton />}>
        <ProfileTabsBar params={params} searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<DropListSkeleton />}>
        <ProfileFeed params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProfileTabsBar({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const [{ handle }, sp] = await Promise.all([params, searchParams]);
  return <ProfileTabs handle={handle} active={parseTab(sp.tab)} />;
}

function ProfileTabsSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm" aria-hidden>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <span key={i} className="flex-1 px-4 py-4 text-center">
            <Skeleton className="inline-block h-5 w-16 rounded align-middle" />
          </span>
        );
      })}
    </div>
  );
}

async function ProfileHeader({ params }: Params) {
  const { handle } = await params;
  const [user, current] = await Promise.all([getUserByHandle(handle), getCurrentUser()]);
  const isMe = current.handle === handle;

  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b">
      <div
        className={cn('h-32 w-full bg-gradient-to-br opacity-30 sm:h-40 dark:opacity-40', user.avatarColor)}
        aria-hidden
      />
      <div className="px-5 pb-4">
        <div className="-mt-10 flex items-start justify-between sm:-mt-12">
          <UserAvatar handle={user.handle} size="lg" />
          <div className="flex h-20 items-end sm:h-24">
            {isMe ? null : (
              <Suspense fallback={<Skeleton className="h-8 w-28 rounded-full" />}>
                <ProfileFollowButton handle={user.handle} currentHandle={current.handle} />
              </Suspense>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-tight">{user.displayName}</h1>
            <div className="text-gray font-mono text-xs">@{user.handle}</div>
          </div>
          <p className="text-sm">{user.bio}</p>
          <div className="text-gray flex gap-4 font-mono text-xs">
            <span>
              <strong className="text-black dark:text-white">{formatCount(user.following)}</strong> Following
            </span>
            <span>
              <strong className="text-black dark:text-white">{formatCount(user.followers)}</strong> Followers
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

async function ProfileFollowButton({ handle, currentHandle }: { handle: string; currentHandle: string }) {
  const following = await isFollowing(currentHandle, handle);
  return <FollowButton targetHandle={handle} initialFollowing={following} />;
}

async function ProfileFeed({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const [{ handle }, sp] = await Promise.all([params, searchParams]);
  const tab = parseTab(sp.tab);

  if (tab === 'replies') {
    const replies = await getRepliesByAuthor(handle);
    if (replies.length === 0) {
      return <EmptyState title="No replies yet" body="When they reply to a drop, it'll show up here." />;
    }
    return (
      <ul>
        {replies.map(reply => {
          return (
            <li key={reply.id}>
              <Drop drop={reply} />
            </li>
          );
        })}
      </ul>
    );
  }

  const items = await getDropsByAuthor(handle);
  if (items.length === 0) {
    return <EmptyState title="No drops yet" body="When they post something, it'll show up here." />;
  }
  return (
    <ul>
      {items.map(item => {
        return (
          <li key={`${item.kind}-${item.drop.id}`}>
            <Drop drop={item.drop} repostedBy={item.kind === 'repost' ? item.repostedBy : undefined} />
          </li>
        );
      })}
    </ul>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b">
      <div className="bg-card dark:bg-card-dark h-32 w-full sm:h-40" aria-hidden />
      <div className="px-5 pb-4">
        <div className="-mt-10 flex items-start justify-between sm:-mt-12">
          <div className="rounded-full bg-white dark:bg-black">
            <UserAvatarSkeleton size="lg" />
          </div>
          <div className="flex h-20 items-end sm:h-24">
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <Skeleton className="h-5 w-2/3 rounded" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>
    </header>
  );
}
