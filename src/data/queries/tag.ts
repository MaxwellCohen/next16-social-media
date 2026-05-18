import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export const getTrendingTags = cache(async () => {
  'use cache';
  cacheTag('trending');
  cacheLife('minutes');

  await delay(350);
  const rows = await prisma.drop.findMany({ select: { tags: true } });
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.tags) continue;
    for (const tag of row.tags.split(',').filter(Boolean)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => {
      return { count, name };
    })
    .sort((a, b) => {
      return b.count - a.count;
    })
    .slice(0, 6);
});
