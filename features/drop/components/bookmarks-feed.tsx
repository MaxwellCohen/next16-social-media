import { ViewTransition } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Drop } from '@/features/drop/components/drop';
import { getBookmarkedDrops } from '@/features/drop/drop-queries';

export async function BookmarksFeed() {
  const drops = await getBookmarkedDrops();

  if (drops.length === 0) {
    return <EmptyState title="Nothing saved yet" body="Bookmark a drop to find it here later." />;
  }

  return (
    <ul>
      {drops.map(drop => (
        <ViewTransition key={drop.id} default="none" enter="auto" exit="auto">
          <li className="transition-opacity has-data-pending:opacity-30">
            <Drop drop={drop} />
          </li>
        </ViewTransition>
      ))}
    </ul>
  );
}
