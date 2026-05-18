import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getCurrentUserHandle } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export const getCurrentUser = cache(async () => {
  return getUserByHandle(await getCurrentUserHandle());
});

export const getUserByHandle = cache(async (handle: string) => {
  'use cache';
  cacheTag('users', `user-${handle}`);

  await delay(250);
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) notFound();
  return user;
});

export const getWhoToFollow = cache(async (handle: string) => {
  'use cache';
  cacheTag(`who-to-follow-${handle}`);

  await delay(400);
  const followed = await prisma.follow.findMany({
    select: { targetHandle: true },
    where: { followerHandle: handle },
  });
  const exclude = new Set([
    handle,
    ...followed.map(f => {
      return f.targetHandle;
    }),
  ]);
  const candidates = await prisma.user.findMany({
    take: 3,
    where: { handle: { notIn: [...exclude] } },
  });
  return candidates;
});

export const isFollowing = cache(async (followerHandle: string, targetHandle: string) => {
  'use cache';
  cacheTag(`is-following-${targetHandle}`);

  await delay(120);
  const row = await prisma.follow.findUnique({
    where: { followerHandle_targetHandle: { followerHandle, targetHandle } },
  });
  return row !== null;
});
