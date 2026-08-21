import { type ReactNode } from 'react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { UserAvatar } from '@/features/user/components/user-avatar';
import type { Route } from 'next';

type Props = {
  handle: string;
  displayName: string;
  action?: ReactNode;
};

export function UserRow({ handle, displayName, action }: Props) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0 sm:px-5">
      <PrefetchLink
        href={`/u/${handle}` as Route}
        className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:bg-black/2 dark:hover:bg-white/2"
      >
        <UserAvatar handle={handle} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold tracking-tight">{displayName}</div>
          <div className="text-gray truncate font-mono text-[11px]">@{handle}</div>
        </div>
      </PrefetchLink>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
