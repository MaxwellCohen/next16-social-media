import 'server-only';

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

const SESSION_COOKIE = 'drop-user';
const DEFAULT_HANDLE = 'aurora';

export const getCurrentUserHandle = cache(async (): Promise<string> => {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? DEFAULT_HANDLE;
});

export async function verifyUser(): Promise<string> {
  const handle = await getCurrentUserHandle();
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) throw new Error('Unauthorized');
  return handle;
}

export const getCurrentUser = cache(async () => getUserByHandle(await getCurrentUserHandle()));

export const getUserByHandle = cache(async (handle: string) => {
  await delay(500);
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) notFound();
  return user;
});

export const getWhoToFollow = cache(async (handle: string) => {
  await delay(700);
  const followed = await prisma.follow.findMany({
    select: { targetHandle: true },
    where: { followerHandle: handle },
  });
  return prisma.user.findMany({
    take: 3,
    where: {
      handle: {
        notIn: [handle, ...followed.map(f => f.targetHandle)],
      },
    },
  });
});

export const isFollowing = cache(async (followerHandle: string, targetHandle: string) => {
  await delay(120);
  const row = await prisma.follow.findUnique({
    where: { followerHandle_targetHandle: { followerHandle, targetHandle } },
  });
  return row !== null;
});

export const searchUsers = cache(async (query: string) => {
  await delay(200);
  return prisma.user.findMany({
    take: 5,
    where: {
      OR: [
        { handle: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
});

export type DropUserState = {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
};

export const getDropUserState = cache(async (dropId: string): Promise<DropUserState> => {
  const handle = await getCurrentUserHandle();
  await delay(300);
  const [like, repost, bookmark] = await Promise.all([
    prisma.like.findUnique({ where: { userHandle_dropId: { dropId, userHandle: handle } } }),
    prisma.repost.findUnique({ where: { userHandle_dropId: { dropId, userHandle: handle } } }),
    prisma.bookmark.findUnique({ where: { userHandle_dropId: { dropId, userHandle: handle } } }),
  ]);
  return { bookmarked: bookmark !== null, liked: like !== null, reposted: repost !== null };
});

export const getAllUsers = cache(async () => prisma.user.findMany({
    orderBy: { handle: 'asc' },
    select: { avatarColor: true, displayName: true, handle: true },
  }));
