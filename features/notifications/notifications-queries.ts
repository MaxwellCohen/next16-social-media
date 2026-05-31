import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import type { Notification } from '@/types/notification';

export const getNotifications = cache(async (): Promise<Notification[]> => {
  'use cache: private';
  cacheTag('notifications');
  cacheLife('seconds');

  await delay(600);

  const handle = await getCurrentUserHandle();

  // Find activity on the current user's drops, plus follows toward them
  const myDropIds = (
    await prisma.drop.findMany({
      select: { id: true },
      where: { authorHandle: handle },
    })
  ).map(d => d.id);

  const [likes, reposts, follows, replies] = await Promise.all([
    prisma.like.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      where: { dropId: { in: myDropIds }, userHandle: { not: handle } },
    }),
    prisma.repost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      where: { dropId: { in: myDropIds }, userHandle: { not: handle } },
    }),
    prisma.follow.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      where: { followerHandle: { not: handle }, targetHandle: handle },
    }),
    prisma.drop.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      where: { authorHandle: { not: handle }, parentId: { in: myDropIds } },
    }),
  ]);

  const items: Notification[] = [
    ...likes.map(l => ({
      actorHandle: l.userHandle,
      createdAt: l.createdAt,
      dropId: l.dropId,
      id: `like-${l.userHandle}-${l.dropId}`,
      kind: 'like' as const,
    })),
    ...reposts.map(r => ({
      actorHandle: r.userHandle,
      createdAt: r.createdAt,
      dropId: r.dropId,
      id: `repost-${r.userHandle}-${r.dropId}`,
      kind: 'repost' as const,
    })),
    ...follows.map(f => ({
      actorHandle: f.followerHandle,
      createdAt: f.createdAt,
      id: `follow-${f.followerHandle}`,
      kind: 'follow' as const,
    })),
    ...replies.map(r => ({
      actorHandle: r.authorHandle,
      body: r.body,
      createdAt: r.createdAt,
      dropId: r.parentId ?? undefined,
      id: `reply-${r.id}`,
      kind: 'reply' as const,
    })),
  ];

  return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 30);
});

export const getNewestNotificationAt = cache(async (): Promise<string | null> => {
  'use cache: private';
  cacheTag('notifications');
  cacheLife('seconds');

  const items = await getNotifications();
  return items[0]?.createdAt.toISOString() ?? null;
});
