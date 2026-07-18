import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';

// Fire-and-forget from the notifications page on mount. A route handler (not a Server
// Action) means no router refresh fires, so revalidateTag('max') just marks the tag
// stale and the badge/list update lazily on the next navigation — no blocking, no flash.
export async function POST() {
  const me = await verifyAuth();
  await prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { readAt: null, recipientHandle: me },
  });
  revalidateTag(`notifications:${me}`, 'max');
  return new NextResponse(null, { status: 204 });
}
