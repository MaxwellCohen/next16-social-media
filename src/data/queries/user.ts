import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getStore } from '@/lib/data';
import { delay } from '@/lib/utils';

export const getCurrentUser = cache(async () => {
  'use cache';
  cacheTag('current-user');

  await delay(150);
  const store = getStore();
  const user = store.users.find(u => {
    return u.handle === store.currentUserHandle;
  });
  if (!user) throw new Error('Current user not found');
  return user;
});

export const getUserByHandle = cache(async (handle: string) => {
  'use cache';
  cacheTag('users', `user-${handle}`);

  await delay(250);
  const user = getStore().users.find(u => {
    return u.handle === handle;
  });
  if (!user) notFound();
  return user;
});

export const getWhoToFollow = cache(async () => {
  'use cache';
  cacheTag('who-to-follow');

  await delay(400);
  const store = getStore();
  const followingSet = store.follows[store.currentUserHandle] ?? new Set();
  return store.users
    .filter(u => {
      return u.handle !== store.currentUserHandle && !followingSet.has(u.handle);
    })
    .slice(0, 3);
});

export const isFollowing = cache(async (followerHandle: string, targetHandle: string) => {
  'use cache: private';
  cacheTag(`is-following-${targetHandle}`);

  await delay(120);
  return getStore().follows[followerHandle]?.has(targetHandle) ?? false;
});
