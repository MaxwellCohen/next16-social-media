import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/Drop';
import { getBookmarkedDrops } from '@/data/queries/drop';
import { getCurrentUser } from '@/data/queries/user';

export default function BookmarksPage() {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 dark:bg-card-dark/75 sticky top-0 z-10 border-b bg-white/75 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5">
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
    return (
      <div className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-5 py-12 text-center text-sm">
        Nothing saved yet. Bookmark a drop to find it here later.
      </div>
    );
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
