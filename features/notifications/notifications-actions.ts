'use server';

import { revalidateTag } from 'next/cache';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';

export async function markAllNotificationsRead() {
  const me = await verifyAuth();
  await prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { readAt: null, recipientHandle: me },
  });
  revalidateTag(`notifications:${me}`, 'max');
  return { ok: true as const };
}
