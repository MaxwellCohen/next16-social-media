import { EmptyState } from '@/components/ui/empty-state';
import { DropList } from '@/features/drop/components/drop';
import { getBookmarkedDrops } from '@/features/drop/drop-queries';
import { getCurrentUser } from '@/features/user/user-queries';

export async function BookmarksFeed() {
  const user = await getCurrentUser();
  const drops = await getBookmarkedDrops(user.handle);

  if (drops.length === 0) {
    return <EmptyState title="Nothing saved yet" body="Bookmark a drop to find it here later." />;
  }

  return <DropList drops={drops} />;
}
