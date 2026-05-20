'use server';

import { Drop } from '@/features/drop/components/drop';
import { getDiscoverFeed, getFeed } from '@/features/drop/drop-queries';
import { getCurrentUserHandle } from '@/features/user/user-queries';

export async function loadMoreFeed(cursor: string | null) {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getFeed(handle, cursor);
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

export async function loadMorePublicFeed(cursor: string | null) {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getDiscoverFeed(handle, cursor);
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
