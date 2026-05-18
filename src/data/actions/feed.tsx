'use server';

import { getFeed } from '@/data/queries/drop';
import { Drop } from '@/features/drop/components/Drop';

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
