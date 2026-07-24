'use server';

import { isSlowEnabled } from '@/components/demo/demo-slow';
import { DropBody } from '@/features/drop/components/drop-body';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { getCurrentUserHandle, getUserByHandle } from '@/features/user/user-queries';
import { delay } from '@/lib/utils';

export async function renderDropPreview(body: string) {
  await delay(600, await isSlowEnabled());

  return <DropBody body={body} />;
}

export async function renderThreadPreview(bodies: string[]) {
  await delay(600, await isSlowEnabled());
  const user = await getUserByHandle(await getCurrentUserHandle());

  return bodies.map((body, i) => (
    <div key={i} className="flex gap-3">
      <UserAvatar handle={user.handle} size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <header className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
          <span className="font-semibold tracking-tight text-black dark:text-white">{user.displayName}</span>
          <span className="text-gray font-mono text-[12px]">@{user.handle}</span>
        </header>
        <DropBody body={body} />
      </div>
    </div>
  ));
}
