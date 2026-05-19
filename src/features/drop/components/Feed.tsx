import { Drop } from '@/features/drop/components/drop';
import { FeedList } from '@/features/drop/components/feed-list';
import { getFeed } from '@/features/drop/drop-queries';

export async function Feed() {
  const { drops, nextCursor } = await getFeed();
  return (
    <FeedList initialCursor={nextCursor}>
      {drops.map(drop => {
        return (
          <li key={drop.id}>
            <Drop drop={drop} />
          </li>
        );
      })}
    </FeedList>
  );
}
