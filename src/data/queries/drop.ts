import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getCurrentUserHandle } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { toDrop, type Drop } from '@/types/drop';

export const getFeed = cache(async () => {
  'use cache';
  cacheTag('feed');

  await delay(500);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: null },
  });
  return rows.map(toDrop);
});

export const getPersonalizedFeed = cache(async (userHandle: string) => {
  'use cache';
  cacheTag('feed', `feed-${userHandle}`);

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

  await delay(300);
  const row = await prisma.drop.findUnique({ where: { id } });
  if (!row) notFound();
  return toDrop(row);
});

export const getReplies = cache(async (dropId: string) => {
  'use cache';
  cacheTag(`replies-${dropId}`);

  await delay(800);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'asc' },
    where: { parentId: dropId },
  });
  return rows.map(toDrop);
});

export type ProfileFeedItem =
  | { kind: 'drop'; drop: Drop; pinnedAt: number }
  | { kind: 'repost'; drop: Drop; repostedBy: string; pinnedAt: number };

export const getDropsByAuthor = cache(async (handle: string): Promise<ProfileFeedItem[]> => {
  'use cache';
  cacheTag('drops', `user-drops-${handle}`);

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

export const getDropsByTag = cache(async (tag: string) => {
  'use cache';
  cacheTag('drops', `tag-${tag}`);

  await delay(400);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: null, tags: { contains: tag } },
  });
  return rows.map(toDrop).filter(d => {
    return d.tags.includes(tag);
  });
});

export const isReposted = cache(async (userHandle: string, dropId: string) => {
  'use cache';
  cacheTag(`reposted-${userHandle}-${dropId}`);

  await delay(120);
  const row = await prisma.repost.findUnique({ where: { userHandle_dropId: { dropId, userHandle } } });
  return row !== null;
});

export const isLiked = cache(async (userHandle: string, dropId: string) => {
  'use cache';
  cacheTag(`liked-${userHandle}-${dropId}`);

  await delay(120);
  const row = await prisma.like.findUnique({ where: { userHandle_dropId: { dropId, userHandle } } });
  return row !== null;
});

export const isBookmarked = cache(async (userHandle: string, dropId: string) => {
  'use cache';
  cacheTag(`bookmarked-${userHandle}-${dropId}`);

  await delay(120);
  const row = await prisma.bookmark.findUnique({ where: { userHandle_dropId: { dropId, userHandle } } });
  return row !== null;
});

export const getBookmarkedDrops = cache(async (userHandle: string) => {
  'use cache';
  cacheTag(`bookmarks-${userHandle}`);

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

export type DropUserState = {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
};

export const getDropUserState = cache(async (dropId: string): Promise<DropUserState> => {
  const handle = await getCurrentUserHandle();
  const [liked, reposted, bookmarked] = await Promise.all([
    isLiked(handle, dropId),
    isReposted(handle, dropId),
    isBookmarked(handle, dropId),
  ]);
  return { bookmarked, liked, reposted };
});
