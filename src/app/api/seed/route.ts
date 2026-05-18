import 'server-only';

import { updateTag } from 'next/cache';
import { resetStore } from '@/lib/data';

export async function POST() {
  resetStore();
  for (const tag of ['feed', 'drops', 'users', 'trending', 'who-to-follow', 'current-user']) {
    updateTag(tag);
  }
  return Response.json({ ok: true });
}
