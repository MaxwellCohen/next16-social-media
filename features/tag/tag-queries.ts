import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export const getTrendingTags = cache(async () => {
  'use cache';
  cacheTag('trending');
  cacheLife('minutes');

  await delay(600);
  return countTags(6);
});

export const getAllTags = cache(async () => {
  'use cache';
  cacheTag('trending');
  cacheLife('minutes');

  await delay(700);
  return countTags();
});

async function countTags(limit?: number) {
  const rows = await prisma.drop.findMany({ select: { tags: true }, where: { parentId: null } });
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.tags) continue;
    for (const tag of row.tags.split(',').filter(Boolean)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const sorted = Array.from(counts.entries())
    .map(([name, count]) => ({ count, name }))
    .sort((a, b) => b.count - a.count);
  return limit ? sorted.slice(0, limit) : sorted;
}
