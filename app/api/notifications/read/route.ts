import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';

export async function POST() {
  const me = await verifyAuth();
  await prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { readAt: null, recipientHandle: me },
  });
  revalidateTag(`notifications:${me}`, 'max');
  return new NextResponse(null, { status: 204 });
}
