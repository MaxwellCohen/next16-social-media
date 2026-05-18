import { getFeed } from '@/data/queries/drop';
import { Drop } from '@/features/drop/components/Drop';
import { FeedList } from '@/features/drop/components/FeedList';

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
