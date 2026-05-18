import 'server-only';

import { cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

const SESSION_COOKIE = 'drop-user';
const DEFAULT_HANDLE = 'aurorascharff';

export const getCurrentUserHandle = cache(async (): Promise<string> => {
  'use cache: private';
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? DEFAULT_HANDLE;
});

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
  return prisma.user.findMany({
    take: 1,
    where: {
      handle: {
        notIn: [
          handle,
          ...followed.map(f => {
            return f.targetHandle;
          }),
        ],
      },
    },
  });
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
