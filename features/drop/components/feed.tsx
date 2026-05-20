import { Drop } from '@/features/drop/components/drop';
import { FeedList } from '@/features/drop/components/feed-list';
import { getFeed, getPublicFeed } from '@/features/drop/drop-queries';

export async function Feed() {
  const { drops, nextCursor } = await getFeed();
  return (
    <FeedList initialCursor={nextCursor} feedType="following">
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

export async function PublicFeed() {
  const { drops, nextCursor } = await getPublicFeed();
  return (
    <FeedList initialCursor={nextCursor} feedType="foryou">
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
