import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { toDrop, type Drop } from '@/types/drop';

export const FEED_PAGE_SIZE = 10;

export type FeedPage = { drops: Drop[]; nextCursor: string | null };

export const getFeed = cache(async (cursor: string | null = null): Promise<FeedPage> => {
  'use cache';
  cacheTag('feed');
  cacheLife('seconds');

  await delay(500);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    take: FEED_PAGE_SIZE + 1,
    where: {
      parentId: null,
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
  });
  const hasMore = rows.length > FEED_PAGE_SIZE;
  const page = hasMore ? rows.slice(0, FEED_PAGE_SIZE) : rows;
  return {
    drops: page.map(toDrop),
    nextCursor: hasMore ? page[page.length - 1].createdAt.toISOString() : null,
  };
});

export const getPersonalizedFeed = cache(async (userHandle: string) => {
  'use cache';
  cacheTag('feed', `feed-${userHandle}`);
  cacheLife('seconds');

  await delay(450);
  const follows = await prisma.follow.findMany({
    select: { targetHandle: true },
    where: { followerHandle: userHandle },
  });
  const followedHandles = follows.map(f => {
    return f.targetHandle;
  });
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      authorHandle: { in: [...followedHandles, userHandle] },
      parentId: null,
    },
  });
  return rows.map(toDrop);
});

export const getDrop = cache(async (id: string) => {
  'use cache';
  cacheTag('drops', `drop-${id}`);
  cacheLife('seconds');

  await delay(300);
  const row = await prisma.drop.findUnique({ where: { id } });
  if (!row) notFound();
  return toDrop(row);
});

export const getReplies = cache(async (dropId: string) => {
  'use cache';
  cacheTag(`replies-${dropId}`);
  cacheLife('seconds');

  await delay(800);
  const parent = await prisma.drop.findUnique({
    select: { authorHandle: true },
    where: { id: dropId },
  });
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: dropId },
  });
  // Twitter-style: pin the original author's replies first, then newest-first for everyone else.
  const authorHandle = parent?.authorHandle;
  const authorReplies = authorHandle
    ? rows.filter(r => {
        return r.authorHandle === authorHandle;
      })
    : [];
  const otherReplies = authorHandle
    ? rows.filter(r => {
        return r.authorHandle !== authorHandle;
      })
    : rows;
  return [...authorReplies, ...otherReplies].map(toDrop);
});

export type ProfileFeedItem =
  | { kind: 'drop'; drop: Drop; pinnedAt: number }
  | { kind: 'repost'; drop: Drop; repostedBy: string; pinnedAt: number };

export const getDropsByAuthor = cache(async (handle: string): Promise<ProfileFeedItem[]> => {
  'use cache';
  cacheTag('drops', `user-drops-${handle}`);
  cacheLife('seconds');

  await delay(400);
  const [authored, reposts] = await Promise.all([
    prisma.drop.findMany({
      where: { authorHandle: handle, parentId: null },
    }),
    prisma.repost.findMany({
      include: { drop: true },
      where: { drop: { parentId: null }, userHandle: handle },
    }),
  ]);

  const items: ProfileFeedItem[] = [
    ...authored.map(d => {
      return { drop: toDrop(d), kind: 'drop' as const, pinnedAt: d.createdAt.getTime() };
    }),
    ...reposts.map(r => {
      return {
        drop: toDrop(r.drop),
        kind: 'repost' as const,
        pinnedAt: r.drop.createdAt.getTime() + 1,
        repostedBy: handle,
      };
    }),
  ];
  return items.sort((a, b) => {
    return b.pinnedAt - a.pinnedAt;
  });
});

export const getRepliesByAuthor = cache(async (handle: string) => {
  'use cache';
  cacheTag('drops', `user-replies-${handle}`);
  cacheLife('seconds');

  await delay(400);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { authorHandle: handle, parentId: { not: null } },
  });
  return rows.map(toDrop);
});

export const getDropsByTag = cache(async (tag: string) => {
  'use cache';
  cacheTag('drops', `tag-${tag}`);
  cacheLife('seconds');

  await delay(400);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: null, tags: { contains: tag } },
  });
  return rows.map(toDrop).filter(d => {
    return d.tags.includes(tag);
  });
});

export const getBookmarkedDrops = cache(async (userHandle: string) => {
  'use cache';
  cacheTag(`bookmarks-${userHandle}`);
  cacheLife('seconds');

  await delay(400);
  const rows = await prisma.bookmark.findMany({
    include: { drop: true },
    orderBy: { createdAt: 'desc' },
    where: { drop: { parentId: null }, userHandle },
  });
  return rows.map(r => {
    return toDrop(r.drop);
  });
});
