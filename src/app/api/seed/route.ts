import 'server-only';

import { updateTag } from 'next/cache';
import { resetStore } from '@/lib/data';

/**
 * Reset the in-memory store back to its seed values. Used by `pnpm seed`
 * during the talk so we can re-run the demo without restarting the server.
 */
export async function POST() {
  resetStore();
  // Invalidate every cached query so the UI reflects the fresh store.
  for (const tag of ['feed', 'drops', 'users', 'trending', 'who-to-follow', 'current-user']) {
    updateTag(tag);
  }
  return Response.json({ ok: true });
}
