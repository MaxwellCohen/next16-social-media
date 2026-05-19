'use server';

import { Drop } from '@/features/drop/components/drop';
import { getFeed } from '@/features/drop/drop-queries';

export async function loadMoreFeed(cursor: string | null) {
  const { drops, nextCursor } = await getFeed(cursor);
  return {
    items: drops.map(drop => {
      return (
        <li key={drop.id}>
          <Drop drop={drop} />
        </li>
      );
    }),
    nextCursor,
  };
}
