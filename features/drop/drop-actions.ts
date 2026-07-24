'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { z } from 'zod';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { verifyAuth } from '@/features/user/user-queries';
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

const BANNED_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'bastard', 'dick', 'cunt', 'slut'];

function moderate(body: string): string | null {
  const hit = BANNED_WORDS.find(word => new RegExp(`\\b${word}\\b`, 'i').test(body));
  return hit ? 'Keep it friendly — that post looks a little too spicy to publish.' : null;
}

const postDropSchema = z.object({
  body: z
    .string()
    .min(1, 'Say something')
    .max(1000, '1000 characters max')
    .transform(s => s.replace(/\r\n/g, '\n')),
});

function validateBody(raw: FormDataEntryValue | null) {
  const parsed = postDropSchema.safeParse({ body: raw });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false as const };
  }
  const flagged = moderate(parsed.data.body);
  if (flagged) {
    return { error: flagged, ok: false as const };
  }
  return { body: parsed.data.body, ok: true as const };
}

export async function postDrop(formData: FormData) {
  await delay(300, await isSlowEnabled());

  const validated = validateBody(formData.get('body'));
  if (!validated.ok) {
    return { error: validated.error, ok: false as const };
  }

  const me = await verifyAuth();
  const tags = extractTags(validated.body);
  const drop = await prisma.drop.create({
    data: {
      authorHandle: me,
      body: validated.body,
      createdAt: new Date(),
      tags: tags.join(','),
    },
  });
  updateTag('feed');
  updateTag(`user-drops-${me}`);
  updateTag('trending');
  for (const tag of tags) updateTag(`tag-${tag}`);
  return { drop, ok: true as const };
}

export async function postThread(formData: FormData) {
  await delay(300, await isSlowEnabled());

  const bodies: string[] = [];
  for (const raw of formData.getAll('body')) {
    if (typeof raw === 'string' && raw.trim() === '') continue;
    const result = validateBody(raw);
    if (!result.ok) {
      return { error: result.error, ok: false as const };
    }
    bodies.push(result.body);
  }
  if (bodies.length === 0) {
    return { error: 'Say something', ok: false as const };
  }

  const me = await verifyAuth();
  const allTags = new Set<string>();
  const tagsFor = (body: string) => {
    const tags = extractTags(body);
    for (const tag of tags) allTags.add(tag);
    return tags.join(',');
  };

  const first = await prisma.drop.create({
    data: { authorHandle: me, body: bodies[0], createdAt: new Date(), tags: tagsFor(bodies[0]) },
  });

  const rest = bodies.slice(1);
  if (rest.length > 0) {
    const base = Date.now();
    await prisma.$transaction([
      ...rest.map((body, i) =>
        prisma.drop.create({
          data: {
            authorHandle: me,
            body,
            createdAt: new Date(base + (i + 1) * 1000),
            parentId: first.id,
            tags: tagsFor(body),
          },
        }),
      ),
      prisma.drop.update({ data: { replyCount: { increment: rest.length } }, where: { id: first.id } }),
    ]);
    updateTag(`drop-${first.id}`);
    updateTag(`replies-${first.id}`);
    updateTag(`user-replies-${me}`);
  }

  updateTag('feed');
  updateTag(`user-drops-${me}`);
  updateTag('trending');
  for (const tag of allTags) updateTag(`tag-${tag}`);
  return { drop: first, ok: true as const };
}

export async function postReply(parentId: string, formData: FormData) {
  await delay(600, await isSlowEnabled());

  const validated = validateBody(formData.get('body'));
  if (!validated.ok) {
    return { error: validated.error, ok: false as const };
  }

  const parent = await prisma.drop.findUnique({ where: { id: parentId } });
  if (!parent) return { error: 'Drop not found', ok: false as const };

  const me = await verifyAuth();
  const tags = extractTags(validated.body);
  const [reply] = await prisma.$transaction([
    prisma.drop.create({
      data: {
        authorHandle: me,
        body: validated.body,
        createdAt: new Date(),
        parentId,
        tags: tags.join(','),
      },
    }),
    prisma.drop.update({ data: { replyCount: { increment: 1 } }, where: { id: parentId } }),
  ]);
  if (parent.authorHandle !== me) {
    await prisma.notification.create({
      data: {
        actorHandle: me,
        body: validated.body,
        dropId: parentId,
        kind: 'reply',
        recipientHandle: parent.authorHandle,
      },
    });
    revalidateTag(`notifications:${parent.authorHandle}`, 'max');
  }
  updateTag(`drop-${parentId}`);
  updateTag(`replies-${parentId}`);
  updateTag(`user-replies-${me}`);
  return { ok: true as const, reply };
}

const idSchema = z.string().min(1).max(30);

export async function toggleLike(dropId: string) {
  await delay(300, await isSlowEnabled());
  const id = idSchema.parse(dropId);
  const me = await verifyAuth();
  const existing = await prisma.like.findUnique({ where: { userHandle_dropId: { dropId: id, userHandle: me } } });
  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { userHandle_dropId: { dropId: id, userHandle: me } } }),
      prisma.drop.update({ data: { likeCount: { decrement: 1 } }, where: { id } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.like.create({ data: { dropId: id, userHandle: me } }),
      prisma.drop.update({ data: { likeCount: { increment: 1 } }, where: { id } }),
    ]);
    const drop = await prisma.drop.findUnique({ select: { authorHandle: true }, where: { id } });
    if (drop && drop.authorHandle !== me) {
      await prisma.notification.create({
        data: { actorHandle: me, dropId: id, kind: 'like', recipientHandle: drop.authorHandle },
      });
      revalidateTag(`notifications:${drop.authorHandle}`, 'max');
    }
  }
  updateTag(`drop-${id}`);
  updateTag(`drop-interactions:${me}`);
  return { ok: true as const };
}

export async function toggleRepost(dropId: string) {
  await delay(300, await isSlowEnabled());
  const id = idSchema.parse(dropId);
  const me = await verifyAuth();
  const existing = await prisma.repost.findUnique({ where: { userHandle_dropId: { dropId: id, userHandle: me } } });
  if (existing) {
    await prisma.$transaction([
      prisma.repost.delete({ where: { userHandle_dropId: { dropId: id, userHandle: me } } }),
      prisma.drop.update({ data: { repostCount: { decrement: 1 } }, where: { id } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.repost.create({ data: { dropId: id, userHandle: me } }),
      prisma.drop.update({ data: { repostCount: { increment: 1 } }, where: { id } }),
    ]);
    const drop = await prisma.drop.findUnique({ select: { authorHandle: true }, where: { id } });
    if (drop && drop.authorHandle !== me) {
      await prisma.notification.create({
        data: { actorHandle: me, dropId: id, kind: 'repost', recipientHandle: drop.authorHandle },
      });
      revalidateTag(`notifications:${drop.authorHandle}`, 'max');
    }
  }
  updateTag(`drop-${id}`);
  updateTag(`drop-interactions:${me}`);
  updateTag(`user-drops-${me}`);
  updateTag('feed');
  return { ok: true as const };
}

export async function toggleBookmark(dropId: string) {
  await delay(250, await isSlowEnabled());
  const id = idSchema.parse(dropId);
  const me = await verifyAuth();
  const existing = await prisma.bookmark.findUnique({ where: { userHandle_dropId: { dropId: id, userHandle: me } } });
  if (existing) {
    await prisma.bookmark.delete({ where: { userHandle_dropId: { dropId: id, userHandle: me } } });
  } else {
    await prisma.bookmark.create({ data: { dropId: id, userHandle: me } });
  }
  updateTag(`drop-interactions:${me}`);
  updateTag(`bookmarks:${me}`);
  return { ok: true as const };
}
