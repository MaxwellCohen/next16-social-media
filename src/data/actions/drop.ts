'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { getCurrentUserHandle } from '@/lib/auth';
import { getNextDropId, getStore, type Drop } from '@/lib/data';
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

  const parsed = postDropSchema.safeParse({
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false as const };
  }

  const me = await getCurrentUserHandle();
  const drop: Drop = {
    authorHandle: me,
    body: parsed.data.body,
    createdAt: new Date(),
    id: getNextDropId(),
    likes: 0,
    replies: 0,
    reposts: 0,
    tags: extractTags(parsed.data.body),
  };
  getStore().drops.unshift(drop);
  updateTag('feed');
  updateTag(`user-drops-${me}`);
  updateTag('trending');
  return { drop, ok: true as const };
}

export async function postReply(parentId: string, formData: FormData) {
  await delay(600);

  const parsed = postDropSchema.safeParse({
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false as const };
  }

  const store = getStore();
  const parent = store.drops.find(d => {
    return d.id === parentId;
  });
  if (!parent) return { error: 'Drop not found', ok: false as const };

  const me = await getCurrentUserHandle();
  const reply: Drop = {
    authorHandle: me,
    body: parsed.data.body,
    createdAt: new Date(),
    id: getNextDropId(),
    likes: 0,
    parentId,
    replies: 0,
    reposts: 0,
    tags: extractTags(parsed.data.body),
  };
  store.drops.push(reply);
  parent.replies += 1;
  updateTag(`drop-${parentId}`);
  updateTag(`replies-${parentId}`);
  return { ok: true as const, reply };
}

export async function toggleLike(dropId: string) {
  await delay(300);
  const store = getStore();
  const drop = store.drops.find(d => {
    return d.id === dropId;
  });
  if (!drop) return { ok: false as const };

  const me = await getCurrentUserHandle();
  const liked = store.likes[me] ?? (store.likes[me] = new Set());
  if (liked.has(dropId)) {
    liked.delete(dropId);
    drop.likes -= 1;
  } else {
    liked.add(dropId);
    drop.likes += 1;
  }
  updateTag(`drop-${dropId}`);
  updateTag(`liked-${me}-${dropId}`);
  return { likes: drop.likes, ok: true as const };
}

export async function toggleRepost(dropId: string) {
  await delay(300);
  const store = getStore();
  const drop = store.drops.find(d => {
    return d.id === dropId;
  });
  if (!drop) return { ok: false as const };

  const me = await getCurrentUserHandle();
  const reposted = store.reposts[me] ?? (store.reposts[me] = new Set());
  if (reposted.has(dropId)) {
    reposted.delete(dropId);
    drop.reposts -= 1;
  } else {
    reposted.add(dropId);
    drop.reposts += 1;
  }
  updateTag(`drop-${dropId}`);
  updateTag(`reposted-${me}-${dropId}`);
  updateTag(`user-drops-${me}`);
  updateTag('feed');
  return { ok: true as const, reposts: drop.reposts };
}

export async function toggleBookmark(dropId: string) {
  await delay(250);
  const store = getStore();
  const drop = store.drops.find(d => {
    return d.id === dropId;
  });
  if (!drop) return { ok: false as const };

  const me = await getCurrentUserHandle();
  const bookmarks = store.bookmarks[me] ?? (store.bookmarks[me] = new Set());
  if (bookmarks.has(dropId)) {
    bookmarks.delete(dropId);
  } else {
    bookmarks.add(dropId);
  }
  updateTag(`bookmarked-${me}-${dropId}`);
  updateTag(`bookmarks-${me}`);
  return { ok: true as const };
}

export async function toggleFollow(targetHandle: string) {
  await delay(300);
  const store = getStore();
  const meHandle = await getCurrentUserHandle();
  if (targetHandle === meHandle) {
    return { ok: false as const };
  }
  const me = store.users.find(u => {
    return u.handle === meHandle;
  });
  const target = store.users.find(u => {
    return u.handle === targetHandle;
  });
  if (!me || !target) return { ok: false as const };

  const follows = store.follows[meHandle] ?? (store.follows[meHandle] = new Set());

  if (follows.has(targetHandle)) {
    follows.delete(targetHandle);
    me.following -= 1;
    target.followers -= 1;
  } else {
    follows.add(targetHandle);
    me.following += 1;
    target.followers += 1;
  }
  updateTag(`user-${targetHandle}`);
  updateTag(`is-following-${targetHandle}`);
  updateTag('current-user');
  updateTag('who-to-follow');
  updateTag('feed');
  return { ok: true as const };
}
