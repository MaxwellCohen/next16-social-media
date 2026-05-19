import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { ProfileFeed } from '@/features/user/components/profile-feed';
import { ProfileHeader, ProfileHeaderSkeleton } from '@/features/user/components/profile-header';
import { ProfileTabs } from '@/features/user/components/profile-tabs';
import { getUserByHandle } from '@/features/user/user-queries';
import type { Metadata } from 'next';

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
        {params.then(({ handle }) => {
          return <ProfileHeader handle={handle} />;
        })}
      </Suspense>
      <Suspense fallback={<ProfileTabsSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ handle }, sp]) => {
          return <ProfileTabs handle={handle} active={parseTab(sp.tab)} />;
        })}
      </Suspense>
      <Suspense fallback={<DropListSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ handle }, sp]) => {
          return <ProfileFeed handle={handle} tab={parseTab(sp.tab)} />;
        })}
      </Suspense>
    </div>
  );
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
