import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export async function getTrendingTags() {
  return getTrendingTagsCached(await isSlowEnabled());
}

async function getTrendingTagsCached(slow: boolean) {
  'use cache';
  cacheTag('trending');
  cacheLife('days');

  await delay(600, slow);
  return countTags(6);
}

export async function getAllTags() {
  return getAllTagsCached(await isSlowEnabled());
}

async function getAllTagsCached(slow: boolean) {
  'use cache';
  cacheTag('trending');
  cacheLife('days');

  await delay(700, slow);
  return countTags();
}

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
