import { EmptyState } from '@/components/ui/empty-state';
import { Drop } from '@/features/drop/components/drop';
import { getDropsByAuthor, getRepliesByAuthor } from '@/features/drop/drop-queries';

export async function ProfileFeed({ handle, tab }: { handle: string; tab: 'drops' | 'replies' }) {
  if (tab === 'replies') {
    const replies = await getRepliesByAuthor(handle);
    if (replies.length === 0) {
      return <EmptyState title="No replies yet" body="When they reply to a drop, it'll show up here." />;
    }

    return (
      <ul>
        {replies.map(reply => {
          return (
            <li key={reply.id}>
              <Drop drop={reply} />
            </li>
          );
        })}
      </ul>
    );
  }

  const items = await getDropsByAuthor(handle);
  if (items.length === 0) {
    return <EmptyState title="No drops yet" body="When they post something, it'll show up here." />;
  }

  return (
    <ul>
      {items.map(item => {
        return (
          <li key={`${item.kind}-${item.drop.id}`}>
            <Drop drop={item.drop} repostedBy={item.kind === 'repost' ? item.repostedBy : undefined} />
          </li>
        );
      })}
    </ul>
  );
}
