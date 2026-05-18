import 'server-only';

import { cacheTag } from 'next/cache';
import { cache } from 'react';
import { getStore, type Drop } from '@/lib/data';
import { delay } from '@/lib/utils';

function topLevel(drops: Drop[]) {
  return drops.filter(d => {
    return !d.parentId;
  });
}

export const getFeed = cache(async () => {
  'use cache';
  cacheTag('feed');

  await delay(500);
  return topLevel(getStore().drops).sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
});

export const getPersonalizedFeed = cache(async (userHandle: string) => {
  'use cache: private';
  cacheTag('feed', `feed-${userHandle}`);

  await delay(450);
  const store = getStore();
  const follows = store.follows[userHandle] ?? new Set();
  return topLevel(store.drops)
    .filter(d => {
      return follows.has(d.authorHandle) || d.authorHandle === userHandle;
    })
    .sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
});

export const getDrop = cache(async (id: string) => {
  'use cache';
  cacheTag('drops', `drop-${id}`);

  await delay(300);
  return (
    getStore().drops.find(d => {
      return d.id === id;
    }) ?? null
  );
});

export const getReplies = cache(async (dropId: string) => {
  await delay(800);
  return getStore()
    .drops.filter(d => {
      return d.parentId === dropId;
    })
    .sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
});

export type ProfileFeedItem =
  | { kind: 'drop'; drop: import('@/lib/data').Drop; pinnedAt: number }
  | { kind: 'repost'; drop: import('@/lib/data').Drop; repostedBy: string; pinnedAt: number };

/**
 * Profile feed: original drops authored by `handle`, plus drops `handle` reposted.
 * Reposts surface with a `kind: 'repost'` marker so the UI can show a "reposted by …"
 * label and link to the original author.
 */
export const getDropsByAuthor = cache(async (handle: string): Promise<ProfileFeedItem[]> => {
  'use cache';
  cacheTag('drops', `user-drops-${handle}`);

  await delay(400);
  const store = getStore();

  const authored: ProfileFeedItem[] = topLevel(store.drops)
    .filter(d => {
      return d.authorHandle === handle;
    })
    .map(drop => {
      return { drop, kind: 'drop' as const, pinnedAt: drop.createdAt.getTime() };
    });

  const repostedIds = store.reposts[handle] ?? new Set();
  const reposted: ProfileFeedItem[] = [];
  for (const id of repostedIds) {
    const drop = store.drops.find(d => {
      return d.id === id;
    });
    if (!drop || drop.parentId) continue;
    reposted.push({ drop, kind: 'repost' as const, pinnedAt: drop.createdAt.getTime() + 1, repostedBy: handle });
  }

  return [...authored, ...reposted].sort((a, b) => {
    return b.pinnedAt - a.pinnedAt;
  });
});

export const isReposted = cache(async (userHandle: string, dropId: string) => {
  'use cache: private';
  cacheTag(`reposted-${userHandle}-${dropId}`);

  await delay(120);
  return getStore().reposts[userHandle]?.has(dropId) ?? false;
});

export const getDropsByTag = cache(async (tag: string) => {
  'use cache';
  cacheTag('drops', `tag-${tag}`);

  await delay(400);
  return topLevel(getStore().drops)
    .filter(d => {
      return d.tags.includes(tag);
    })
    .sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
});

export const isLiked = cache(async (userHandle: string, dropId: string) => {
  'use cache: private';
  cacheTag(`liked-${userHandle}-${dropId}`);

  await delay(120);
  return getStore().likes[userHandle]?.has(dropId) ?? false;
});

export const isBookmarked = cache(async (userHandle: string, dropId: string) => {
  'use cache: private';
  cacheTag(`bookmarked-${userHandle}-${dropId}`);

  await delay(120);
  return getStore().bookmarks[userHandle]?.has(dropId) ?? false;
});

export const getBookmarkedDrops = cache(async (userHandle: string) => {
  'use cache: private';
  cacheTag(`bookmarks-${userHandle}`);

  await delay(400);
  const store = getStore();
  const ids = store.bookmarks[userHandle] ?? new Set();
  return topLevel(store.drops)
    .filter(d => {
      return ids.has(d.id);
    })
    .sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
});
