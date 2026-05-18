import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { getBookmarkedDrops } from '@/data/queries/drop';
import { getCurrentUser } from '@/data/queries/user';
import { Drop, DropSkeleton } from '@/features/drop/components/Drop';

export default function BookmarksPage() {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
        <h1 className="text-lg font-bold tracking-tight">Bookmarks</h1>
      </header>
      <Suspense fallback={<BookmarksSkeleton />}>
        <BookmarksFeed />
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
  return (
    <ul>
      {drops.map(drop => {
        return (
          <li key={drop.id}>
            <Drop drop={drop} />
          </li>
        );
      })}
    </ul>
  );
}

function BookmarksSkeleton() {
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
