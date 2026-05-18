'use server';

import { updateTag } from 'next/cache';
import { resetStore } from '@/lib/data';

export async function resetDemo() {
  resetStore();
  for (const tag of ['feed', 'drops', 'users', 'trending', 'who-to-follow', 'current-user']) {
    updateTag(tag);
  }
}
