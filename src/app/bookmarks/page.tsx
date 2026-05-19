import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BookmarksFeed } from '@/features/drop/components/BookmarksFeed';
import { DropListSkeleton } from '@/features/drop/components/Drop';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/bookmarks' },
  description: 'Drops you bookmarked.',
  openGraph: {
    description: 'Drops you bookmarked.',
    title: 'Bookmarks',
    type: 'website',
    url: '/bookmarks',
  },
  robots: { follow: false, index: false },
  title: 'Bookmarks',
  twitter: { card: 'summary', description: 'Drops you bookmarked.', title: 'Bookmarks' },
};

export const unstable_prefetch = 'force-runtime';

export default function BookmarksPage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Bookmarks</h1>
      </PageHeader>
      <Suspense fallback={<DropListSkeleton count={3} />}>
        <BookmarksFeed />
      </Suspense>
    </div>
  );
}
