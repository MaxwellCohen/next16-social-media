import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/drop';
import { FollowButton } from '@/components/follow-button';
import { Avatar } from '@/components/ui/avatar';
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
  if (!user) notFound();

  const current = await getCurrentUser();
  const following = await isFollowing(current.handle, handle);

  return (
    <header className="border-divider/70 dark:border-divider-dark/70 flex flex-col gap-4 border-b p-5">
      <div className="flex items-start gap-4">
        <Avatar name={user.displayName} color={user.avatarColor} size="lg" />
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">{user.displayName}</h1>
          <div className="text-gray font-mono text-xs">@{user.handle}</div>
        </div>
        {user.handle === current.handle ? null : (
          <FollowButton targetHandle={user.handle} initialFollowing={following} />
        )}
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
    </header>
  );
}

async function ProfileFeed({ params }: Params) {
  const { handle } = await params;
  const items = await getDropsByAuthor(handle);
  if (items.length === 0) {
    return (
      <div className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-5 py-8 text-center text-sm">
        No drops yet.
      </div>
    );
  }
  return (
    <ul>
      {items.map(item => {return (
        <li key={`${item.kind}-${item.drop.id}`}>
          <Drop
            drop={item.drop}
            repostedBy={item.kind === 'repost' ? item.repostedBy : undefined}
          />
        </li>
      )})}
    </ul>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 flex flex-col gap-4 border-b p-5">
      <div className="flex items-start gap-4">
        <div className="skeleton-animation h-14 w-14 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="skeleton-animation h-5 w-40" />
          <div className="skeleton-animation h-3 w-24" />
        </div>
      </div>
      <div className="skeleton-animation h-4 w-full" />
    </header>
  );
}

function ProfileFeedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 3 }).map((_, i) => {return (
        <li key={i}>
          <DropSkeleton />
        </li>
      )})}
    </ul>
  );
}
