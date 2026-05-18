import { Suspense } from "react";
import { Drop, DropSkeleton } from "@/components/drop";
import { getBookmarkedDrops } from "@/data/queries/drop";
import { getCurrentUser } from "@/data/queries/user";

export default function BookmarksPage() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-divider/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-5 dark:border-divider-dark/70 dark:bg-black/80">
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
      <div className="text-gray border-b border-divider/70 px-5 py-12 text-center text-sm dark:border-divider-dark/70">
        Nothing saved yet. Bookmark a drop to find it here later.
      </div>
    );
  }

  return (
    <ul>
      {drops.map((drop) => (
        <li key={drop.id}>
          <Drop drop={drop} />
        </li>
      ))}
    </ul>
  );
}

function BookmarksSkeleton() {
  return (
    <ul>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i}>
          <DropSkeleton />
        </li>
      ))}
    </ul>
  );
}
