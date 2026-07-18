import { prisma } from '@/lib/prisma-client';
import type { ActivityItem, AdminSnapshot, SeriesPoint, TopDrop, TrendingTag } from '@/types/admin';

const MINUTE_MS = 60_000;
const PREVIEW_LENGTH = 80;
const SERIES_MINUTES = 60;

export function preview(body: string): string {
  const oneLine = body.replace(/```[\s\S]*?```/g, '').replace(/\s+/g, ' ').trim();
  return oneLine.length > PREVIEW_LENGTH ? `${oneLine.slice(0, PREVIEW_LENGTH)}…` : oneLine;
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const since = new Date(Date.now() - MINUTE_MS);

  const [drops, replies, users, likes, reposts, dropsLastMinute, tagRows, topRows, recentRows] = await Promise.all([
    prisma.drop.count({ where: { parentId: null } }),
    prisma.drop.count({ where: { parentId: { not: null } } }),
    prisma.user.count(),
    prisma.like.count(),
    prisma.repost.count(),
    prisma.drop.count({ where: { createdAt: { gte: since } } }),
    prisma.drop.findMany({ select: { tags: true }, where: { parentId: null } }),
    prisma.drop.findMany({
      orderBy: { likeCount: 'desc' },
      select: { authorHandle: true, body: true, id: true, likeCount: true, repostCount: true },
      take: 12,
      where: { parentId: null },
    }),
    prisma.drop.findMany({
      orderBy: { createdAt: 'desc' },
      select: { authorHandle: true, body: true, createdAt: true, id: true, parentId: true },
      take: 50,
    }),
  ]);

  const trending = countTags(tagRows, 6);

  const seriesRows = await prisma.drop.findMany({
    select: { createdAt: true },
    where: { createdAt: { gte: new Date(Date.now() - SERIES_MINUTES * MINUTE_MS) } },
  });
  const series = bucketPerMinute(seriesRows);

  const topDrops: TopDrop[] = topRows
    .map(row => ({
        authorHandle: row.authorHandle,
        id: row.id,
        likes: row.likeCount,
        preview: preview(row.body),
        reposts: row.repostCount,
        score: row.likeCount + row.repostCount,
      }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const recentActivity: ActivityItem[] = recentRows.map(row => ({
      actorHandle: row.authorHandle,
      at: row.createdAt.getTime(),
      id: row.id,
      kind: row.parentId ? ('reply' as const) : ('drop' as const),
      preview: preview(row.body),
    }));

  return {
    computedAt: Date.now(),
    dropsLastMinute,
    presence: 0,
    recentActivity,
    series,
    topDrops,
    totals: { drops, likes, replies, reposts, users },
    trending,
  };
}

function bucketPerMinute(rows: { createdAt: Date }[]): SeriesPoint[] {
  const now = Date.now();
  const buckets: SeriesPoint[] = [];
  for (let i = SERIES_MINUTES - 1; i >= 0; i--) {
    const start = now - (i + 1) * MINUTE_MS;
    const end = now - i * MINUTE_MS;
    const count = rows.filter(row => {
      const time = row.createdAt.getTime();
      return time >= start && time < end;
    }).length;
    buckets.push({ count, t: end });
  }
  return buckets;
}

function countTags(rows: { tags: string }[], limit: number): TrendingTag[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!row.tags) continue;
    for (const tag of row.tags.split(',').filter(Boolean)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ count, name }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
