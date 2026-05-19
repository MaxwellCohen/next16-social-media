'use server';

import { updateTag } from 'next/cache';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export async function toggleFollow(targetHandle: string) {
  await delay(300);
  const me = await getCurrentUserHandle();
  if (targetHandle === me) {
    return { ok: false as const };
  }
  const existing = await prisma.follow.findUnique({
    where: { followerHandle_targetHandle: { followerHandle: me, targetHandle } },
  });
  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({ where: { followerHandle_targetHandle: { followerHandle: me, targetHandle } } }),
      prisma.user.update({ data: { following: { decrement: 1 } }, where: { handle: me } }),
      prisma.user.update({ data: { followers: { decrement: 1 } }, where: { handle: targetHandle } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.follow.create({ data: { followerHandle: me, targetHandle } }),
      prisma.user.update({ data: { following: { increment: 1 } }, where: { handle: me } }),
      prisma.user.update({ data: { followers: { increment: 1 } }, where: { handle: targetHandle } }),
    ]);
  }
  updateTag(`user-${targetHandle}`);
  updateTag(`user-${me}`);
  updateTag(`is-following-${targetHandle}`);
  updateTag(`who-to-follow-${me}`);
  updateTag('feed');
  return { ok: true as const };
}
