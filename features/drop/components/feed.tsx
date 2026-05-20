import { ViewTransition } from 'react';
import { Drop } from '@/features/drop/components/drop';
import { FeedList } from '@/features/drop/components/feed-list';
import { getDiscoverFeed, getFeed } from '@/features/drop/drop-queries';
import { getCurrentUserHandle } from '@/features/user/user-queries';

export async function Feed() {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getFeed(handle);
  return (
    <FeedList initialCursor={nextCursor} feedType="following">
      {drops.map(drop => {
        return (
          <ViewTransition key={drop.id}>
            <li>
              <Drop drop={drop} />
            </li>
          </ViewTransition>
        );
      })}
    </FeedList>
  );
}

export async function DiscoverFeed() {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getDiscoverFeed(handle);
  return (
    <FeedList initialCursor={nextCursor} feedType="discover">
      {drops.map(drop => {
        return (
          <ViewTransition key={drop.id}>
            <li>
              <Drop drop={drop} />
            </li>
          </ViewTransition>
        );
      })}
    </FeedList>
  );
}
