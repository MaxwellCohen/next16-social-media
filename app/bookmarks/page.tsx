import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { DropList, DropListSkeleton } from '@/features/drop/components/drop';
import { getBookmarkedDrops } from '@/features/drop/drop-queries';
import { getCurrentUser } from '@/features/user/user-queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/bookmarks' },
  description: 'Drops you bookmarked.',
  robots: { follow: false, index: false },
  title: 'Bookmarks',
};

export const unstable_prefetch = 'force-runtime';

export default function BookmarksPage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Bookmarks</h1>
      </PageHeader>
      <Suspense fallback={<DropListSkeleton count={3} />}>
        <Crossfade>
          <BookmarksFeed />
        </Crossfade>
      </Suspense>
    </div>
  );
}

async function BookmarksFeed() {
  const user = await getCurrentUser();
  const drops = await getBookmarkedDrops(user.handle);

  if (drops.length === 0) {
    return <EmptyState title="Nothing saved yet" body="Bookmark a drop to find it here later." />;
  }

  return <DropList drops={drops} />;
}
