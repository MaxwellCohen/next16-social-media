import { Drop } from '@/features/drop/components/drop';
import { FeedList } from '@/features/drop/components/feed-list';
import { getFeed, getPublicFeed } from '@/features/drop/drop-queries';
import { getCurrentUserHandle } from '@/features/user/user-queries';

export async function Feed() {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getFeed(handle);
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

export async function DiscoverFeed() {
  const { drops, nextCursor } = await getPublicFeed();
  return (
    <FeedList initialCursor={nextCursor} feedType="discover">
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
