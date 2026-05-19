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
    <div className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black">
      <Link href={`/u/${handle}`} className="shrink-0">
        <Suspense fallback={<UserAvatarSkeleton size="sm" />}>
          <UserAvatar handle={handle} size="sm" />
        </Suspense>
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/u/${handle}`} className="block truncate text-sm font-semibold tracking-tight hover:underline">
          {displayName}
        </Link>
        <div className="text-gray truncate font-mono text-[11px]">@{handle}</div>
      </div>
      {action}
    </div>
  );
}
