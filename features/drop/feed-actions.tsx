'use server';

import { ViewTransition } from 'react';
import { Drop } from '@/features/drop/components/drop';
import { getDiscoverFeed, getFeed } from '@/features/drop/drop-queries';
import { getCurrentUserHandle } from '@/features/user/user-queries';

export async function loadMoreFeed(cursor: string | null) {
  const handle = await getCurrentUserHandle();
  const { drops, nextCursor } = await getFeed(handle, cursor);
  return {
    items: drops.map(drop => {
      return (
        <ViewTransition key={drop.id}>
          <li>
            <Drop drop={drop} />
          </li>
        </ViewTransition>
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
        <ViewTransition key={drop.id}>
          <li>
            <Drop drop={drop} />
          </li>
        </ViewTransition>
      );
    }),
    nextCursor,
  };
}
