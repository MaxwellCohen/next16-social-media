'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

const HASHTAG_PATTERN = /#(\w+)/g;
const FENCE_PATTERN = /```\w*\n[\s\S]*?\n?```/g;

function extractTags(body: string): string[] {
  const prose = body.replace(FENCE_PATTERN, '');
  const tags = new Set<string>();
  for (const match of prose.matchAll(HASHTAG_PATTERN)) {
    tags.add(match[1].toLowerCase());
  }
  return Array.from(tags);
}

const postDropSchema = z.object({
  body: z
    .string()
    .min(1, 'Say something')
    .max(1000, '1000 characters max')
    .transform(s => {
      return s.replace(/\r\n/g, '\n');
    }),
});

export async function postDrop(formData: FormData) {
  await delay(600);

  const parsed = postDropSchema.safeParse({ body: formData.get('body') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false as const };
  }

  const me = await getCurrentUserHandle();
  const tags = extractTags(parsed.data.body);
  const drop = await prisma.drop.create({
    data: {
      authorHandle: me,
      body: parsed.data.body,
      createdAt: new Date(),
      tags: tags.join(','),
    },
  });
  updateTag('feed');
  updateTag(`user-drops-${me}`);
  updateTag('trending');
  return { drop, ok: true as const };
}

export async function postReply(parentId: string, formData: FormData) {
  await delay(600);

  const parsed = postDropSchema.safeParse({ body: formData.get('body') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false as const };
  }

  const parent = await prisma.drop.findUnique({ where: { id: parentId } });
  if (!parent) return { error: 'Drop not found', ok: false as const };

  const me = await getCurrentUserHandle();
  const tags = extractTags(parsed.data.body);
  const [reply] = await prisma.$transaction([
    prisma.drop.create({
      data: {
        authorHandle: me,
        body: parsed.data.body,
        createdAt: new Date(),
        parentId,
        tags: tags.join(','),
      },
    }),
    prisma.drop.update({ data: { replyCount: { increment: 1 } }, where: { id: parentId } }),
  ]);
  updateTag(`drop-${parentId}`);
  updateTag(`replies-${parentId}`);
  updateTag(`user-replies-${me}`);
  return { ok: true as const, reply };
}

export async function toggleLike(dropId: string) {
  await delay(300);
  const me = await getCurrentUserHandle();
  const existing = await prisma.like.findUnique({ where: { userHandle_dropId: { dropId, userHandle: me } } });
  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { userHandle_dropId: { dropId, userHandle: me } } }),
      prisma.drop.update({ data: { likeCount: { decrement: 1 } }, where: { id: dropId } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.like.create({ data: { dropId, userHandle: me } }),
      prisma.drop.update({ data: { likeCount: { increment: 1 } }, where: { id: dropId } }),
    ]);
  }
  updateTag(`drop-${dropId}`);
  updateTag(`liked-${me}-${dropId}`);
  return { ok: true as const };
}

export async function toggleRepost(dropId: string) {
  await delay(300);
  const me = await getCurrentUserHandle();
  const existing = await prisma.repost.findUnique({ where: { userHandle_dropId: { dropId, userHandle: me } } });
  if (existing) {
    await prisma.$transaction([
      prisma.repost.delete({ where: { userHandle_dropId: { dropId, userHandle: me } } }),
      prisma.drop.update({ data: { repostCount: { decrement: 1 } }, where: { id: dropId } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.repost.create({ data: { dropId, userHandle: me } }),
      prisma.drop.update({ data: { repostCount: { increment: 1 } }, where: { id: dropId } }),
    ]);
  }
  updateTag(`drop-${dropId}`);
  updateTag(`reposted-${me}-${dropId}`);
  updateTag(`user-drops-${me}`);
  updateTag('feed');
  return { ok: true as const };
}

export async function toggleBookmark(dropId: string) {
  await delay(250);
  const me = await getCurrentUserHandle();
  const existing = await prisma.bookmark.findUnique({ where: { userHandle_dropId: { dropId, userHandle: me } } });
  if (existing) {
    await prisma.bookmark.delete({ where: { userHandle_dropId: { dropId, userHandle: me } } });
  } else {
    await prisma.bookmark.create({ data: { dropId, userHandle: me } });
  }
  updateTag(`bookmarked-${me}-${dropId}`);
  updateTag(`bookmarks-${me}`);
  return { ok: true as const };
}
