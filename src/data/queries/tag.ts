import 'server-only';

import { cacheTag } from 'next/cache';
import { cache } from 'react';
import { getStore } from '@/lib/data';
import { delay } from '@/lib/utils';

export const getTrendingTags = cache(async () => {
  'use cache';
  cacheTag('trending');

  await delay(350);
  const counts = new Map<string, number>();
  for (const drop of getStore().drops) {
    for (const tag of drop.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => {return { count, name }})
    .sort((a, b) => {return b.count - a.count})
    .slice(0, 6);
});
