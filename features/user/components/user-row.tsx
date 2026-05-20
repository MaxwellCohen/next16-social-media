import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

type Props = {
  handle: string;
  displayName: string;
  action?: ReactNode;
};

export function UserRow({ handle, displayName, action }: Props) {
  return (
    <Link
      href={`/u/${handle}`}
      className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b px-4 py-3.5 transition-colors hover:bg-black/[0.02] sm:px-5 dark:hover:bg-white/[0.02]"
    >
      <Suspense fallback={<UserAvatarSkeleton size="sm" />}>
        <UserAvatar handle={handle} size="sm" />
      </Suspense>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold tracking-tight">{displayName}</div>
        <div className="text-gray truncate font-mono text-[11px]">@{handle}</div>
      </div>
      {action}
    </Link>
  );
}
