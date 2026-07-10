import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

const SESSION_COOKIE = 'drop-user';
const DEFAULT_HANDLE = 'aurora';

export async function getCurrentUserHandle(): Promise<string> {
  'use cache: private';

  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? DEFAULT_HANDLE;
}

export async function verifyAuth(): Promise<string> {
  const handle = await getCurrentUserHandle();
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) throw new Error('Unauthorized');
  return handle;
}

export async function getCurrentUser() {
  'use cache: private';
  cacheTag('current-user');

  return getUserByHandle(await getCurrentUserHandle());
}

export async function getUserByHandle(handle: string) {
  'use cache';
  cacheTag('users', `user-${handle}`);
  cacheLife('minutes');

  await delay(500);
  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) notFound();
  return user;
}

export async function getWhoToFollow() {
  return getWhoToFollowForHandle(await getCurrentUserHandle());
}

async function getWhoToFollowForHandle(handle: string) {
  'use cache';
  cacheTag(`who-to-follow:${handle}`);

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
}

export async function isFollowing(targetHandle: string) {
  return isFollowingForHandle(await getCurrentUserHandle(), targetHandle);
}

async function isFollowingForHandle(followerHandle: string, targetHandle: string) {
  'use cache';
  cacheTag(`is-following:${followerHandle}:${targetHandle}`);

  await delay(120);
  const row = await prisma.follow.findUnique({
    where: { followerHandle_targetHandle: { followerHandle, targetHandle } },
  });
  return row !== null;
}

export async function searchUsers(query: string) {
  'use cache';
  cacheTag('users', `search-users-${query}`);
  cacheLife('hours');

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
}

export type DropUserState = {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
};

export async function getUserDropInteractions() {
  return getUserDropInteractionsForHandle(await getCurrentUserHandle());
}

async function getUserDropInteractionsForHandle(handle: string) {
  'use cache';
  cacheTag(`drop-interactions:${handle}`);
  cacheLife('minutes');

  await delay(300);
  const [likes, reposts, bookmarks] = await Promise.all([
    prisma.like.findMany({ select: { dropId: true }, where: { userHandle: handle } }),
    prisma.repost.findMany({ select: { dropId: true }, where: { userHandle: handle } }),
    prisma.bookmark.findMany({ select: { dropId: true }, where: { userHandle: handle } }),
  ]);
  return {
    bookmarked: new Set(bookmarks.map(b => b.dropId)),
    liked: new Set(likes.map(l => l.dropId)),
    reposted: new Set(reposts.map(r => r.dropId)),
  };
}

export async function getAllUsers() {
  'use cache';
  cacheTag('users');
  cacheLife('minutes');

  return prisma.user.findMany({
    orderBy: { handle: 'asc' },
    select: { avatarColor: true, displayName: true, handle: true },
  });
}
