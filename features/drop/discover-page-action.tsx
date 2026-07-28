'use server';

import { EmptyState } from '@/components/ui/empty-state';
import type { Page } from '@/components/ui/paginator';
import { Drop } from '@/features/drop/components/drop';
import { MAX_FEED_PAGE } from '@/features/drop/drop-constants';
import { getDiscoverFeed } from '@/features/drop/drop-queries';

export async function renderDiscoverPage(page: number): Promise<Page> {
  const { drops, hasMore } = await getDiscoverFeed(page);
  if (drops.length === 0) {
    return {
      hasMore: false,
      node: (
        <EmptyState title="You already follow everyone" body="Nothing new to discover right now. Check back later." />
      ),
    };
  }
  return {
    hasMore: hasMore && page < MAX_FEED_PAGE,
    node: (
      <ul>
        {drops.map(drop => (
          <li key={drop.id}>
            <Drop drop={drop} />
          </li>
        ))}
      </ul>
    ),
  };
}
