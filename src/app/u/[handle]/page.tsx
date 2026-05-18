import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/Drop';
import { FollowButton } from '@/components/FollowButton';
import { UserAvatar, UserAvatarSkeleton } from '@/components/UserAvatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDropsByAuthor } from '@/data/queries/drop';
import { getCurrentUser, getUserByHandle, isFollowing } from '@/data/queries/user';
import { formatCount } from '@/lib/utils';

type Params = Pick<PageProps<'/u/[handle]'>, 'params'>;

export default function ProfilePage({ params }: PageProps<'/u/[handle]'>) {
  return (
    <div>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader params={params} />
      </Suspense>

      <Suspense fallback={<ProfileFeedSkeleton />}>
        <ProfileFeed params={params} />
      </Suspense>
    </div>
  );
}

async function ProfileHeader({ params }: Params) {
  const { handle } = await params;
  const user = await getUserByHandle(handle);

  return (
    <header className="border-divider/70 dark:border-divider-dark/70 flex flex-col gap-4 border-b p-5">
      <div className="flex items-start gap-4">
        <Suspense fallback={<UserAvatarSkeleton size="lg" />}>
          <UserAvatar handle={user.handle} size="lg" />
        </Suspense>
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">{user.displayName}</h1>
          <div className="text-gray font-mono text-xs">@{user.handle}</div>
        </div>
        <Suspense fallback={<div className="skeleton-animation h-8 w-28 rounded-full" />}>
          <ProfileFollowButton handle={user.handle} />
        </Suspense>
      </div>

      <p className="min-h-[2lh] text-sm">{user.bio}</p>

      <div className="text-gray flex gap-4 font-mono text-xs">
        <span>
          <strong className="text-black dark:text-white">{formatCount(user.following)}</strong> Following
        </span>
        <span>
          <strong className="text-black dark:text-white">{formatCount(user.followers)}</strong> Followers
        </span>
      </div>
    </header>
  );
}

async function ProfileFollowButton({ handle }: { handle: string }) {
  const current = await getCurrentUser();
  if (current.handle === handle) return null;
  const following = await isFollowing(current.handle, handle);
  return <FollowButton targetHandle={handle} initialFollowing={following} />;
}

async function ProfileFeed({ params }: Params) {
  const { handle } = await params;
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
    <header className="border-divider/70 dark:border-divider-dark/70 flex flex-col gap-4 border-b p-5">
      <div className="flex items-start gap-4">
        <div className="skeleton-animation h-14 w-14 rounded-full" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="skeleton-animation h-6 w-40 rounded" />
          <div className="skeleton-animation h-3.5 w-24 rounded" />
        </div>
        <div className="skeleton-animation h-8 w-28 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="skeleton-animation h-4 w-full rounded" />
        <div className="skeleton-animation h-4 w-2/3 rounded" />
      </div>
      <div className="flex gap-4">
        <div className="skeleton-animation h-4 w-20 rounded" />
        <div className="skeleton-animation h-4 w-20 rounded" />
      </div>
    </header>
  );
}

function ProfileFeedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <li key={i}>
            <DropSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
