'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

const handleSchema = z.string().min(1).max(30).regex(/^\w+$/);
const SESSION_COOKIE = 'drop-user';

export async function switchUser(handle: string) {
  const parsed = handleSchema.safeParse(handle);
  if (!parsed.success) return { error: 'User not found', ok: false as const };

  const target = parsed.data;
  const store = await cookies();
  store.set(SESSION_COOKIE, target, { path: '/', sameSite: 'lax' });
  updateTag('current-user');
  return { ok: true as const };
}

export async function toggleFollow(targetHandle: string) {
  await delay(100, await isSlowEnabled());
  const parsed = handleSchema.safeParse(targetHandle);
  if (!parsed.success) return { error: 'User not found', ok: false as const };

  const target = parsed.data;
  const me = await verifyAuth();
  if (target === me) {
    return { error: "You can't follow yourself", ok: false as const };
  }
  const user = await prisma.user.findUnique({ select: { handle: true }, where: { handle: target } });
  if (!user) return { error: 'User not found', ok: false as const };

  const existing = await prisma.follow.findUnique({
    where: { followerHandle_targetHandle: { followerHandle: me, targetHandle: target } },
  });
  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({ where: { followerHandle_targetHandle: { followerHandle: me, targetHandle: target } } }),
      prisma.user.update({ data: { following: { decrement: 1 } }, where: { handle: me } }),
      prisma.user.update({ data: { followers: { decrement: 1 } }, where: { handle: target } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.follow.create({ data: { followerHandle: me, targetHandle: target } }),
      prisma.user.update({ data: { following: { increment: 1 } }, where: { handle: me } }),
      prisma.user.update({ data: { followers: { increment: 1 } }, where: { handle: target } }),
    ]);
    await prisma.notification.create({
      data: { actorHandle: me, kind: 'follow', recipientHandle: target },
    });
    revalidateTag(`notifications:${target}`, 'max');
  }
  updateTag(`user-${target}`);
  updateTag(`user-${me}`);
  updateTag(`is-following:${me}:${target}`);
  updateTag(`who-to-follow:${me}`);
  updateTag('feed');
  return { ok: true as const };
}
