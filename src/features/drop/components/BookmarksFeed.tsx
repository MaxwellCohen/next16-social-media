import { EmptyState } from '@/components/ui/EmptyState';
import { getBookmarkedDrops } from '@/data/queries/drop';
import { getCurrentUser } from '@/data/queries/user';
import { Drop } from '@/features/drop/components/Drop';

export async function BookmarksFeed() {
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
