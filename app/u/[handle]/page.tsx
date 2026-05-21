import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { TabsSkeleton } from '@/components/ui/tabs';
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
    openGraph: { type: 'profile', username: user.handle },
    title,
  };
}

export const unstable_prefetch = 'force-runtime';

export default function ProfilePage({ params, searchParams }: PageProps<'/u/[handle]'>) {
  return (
    <div>
      <PageHeader back>
        <h1 className="text-lg font-bold tracking-tight">Profile</h1>
      </PageHeader>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <Crossfade>
          {params.then(({ handle }) => {
            return <ProfileHeader handle={handle} />;
          })}
        </Crossfade>
      </Suspense>
      <Suspense fallback={<TabsSkeleton />}>
        <Crossfade>
          {Promise.all([params, searchParams]).then(([{ handle }, sp]) => {
            return <ProfileTabs handle={handle} active={parseTab(sp.tab)} />;
          })}
        </Crossfade>
      </Suspense>
      <Suspense fallback={<DropListSkeleton />}>
        <Crossfade>
          {Promise.all([params, searchParams]).then(([{ handle }, sp]) => {
            return <ProfileFeed handle={handle} tab={parseTab(sp.tab)} />;
          })}
        </Crossfade>
      </Suspense>
    </div>
  );
}
