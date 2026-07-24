import { EmptyState } from '@/components/ui/empty-state';
import { Drop, DropList } from '@/features/drop/components/drop';
import { getDropsByAuthor, getRepliesByAuthor } from '@/features/drop/drop-queries';

import type { ProfileTab } from '@/features/user/components/profile-tabs';

export async function ProfileFeed({ handle, tab }: { handle: string; tab: ProfileTab }) {
  if (tab === 'replies') {
    const replies = await getRepliesByAuthor(handle);
    if (replies.length === 0) {
      return <EmptyState title="No replies yet" body="When they reply to a drop, it'll show up here." />;
    }

    return <DropList drops={replies} />;
  }

  const items = await getDropsByAuthor(handle);
  if (items.length === 0) {
    return <EmptyState title="No drops yet" body="When they post something, it'll show up here." />;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.kind === 'repost' ? `repost:${item.repostedBy}:${item.drop.id}` : `drop:${item.drop.id}`}>
          <Drop drop={item.drop} repostedBy={item.kind === 'repost' ? item.repostedBy : undefined} />
        </li>
      ))}
    </ul>
  );
}
