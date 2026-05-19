import { Bookmark, Hash, Home, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DropMark } from '@/components/ui/drop-mark';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { getCurrentUser, getCurrentUserHandle } from '@/features/user/user-queries';
import { SidebarNavLink } from './sidebar-nav-link';
import type { Route } from 'next';

export function Sidebar() {
  return (
    <aside className="hidden h-full flex-col gap-4 overflow-hidden overscroll-y-none px-4 py-5 sm:flex sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-2 pb-2 text-2xl font-bold tracking-tight text-black dark:text-white"
        aria-label="Drop home"
      >
        <DropMark size={28} className="text-black dark:text-white" />
        <span>drop</span>
      </Link>
      <nav className="flex flex-col gap-1.5 text-sm font-medium">
        <Suspense>
          <SidebarNavLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
        </Suspense>
        <Suspense>
          <SidebarProfileLink />
        </Suspense>
        <Suspense>
          <SidebarNavLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Bookmarks" />
        </Suspense>
        <Suspense>
          <SidebarNavLink href="/tag" icon={<Hash className="h-5 w-5" />} label="Tags" />
        </Suspense>
      </nav>
      <div className="border-divider dark:border-divider-dark -mx-4 mt-auto -mb-5 flex items-center gap-1 border-t px-2 py-3 sm:-mx-6 sm:px-4">
        <Suspense fallback={<SidebarProfilePillSkeleton />}>
          <SidebarProfilePill />
        </Suspense>
        <ThemeToggle variant="inline" />
      </div>
    </aside>
  );
}

async function SidebarProfileLink() {
  const handle = await getCurrentUserHandle();
  return <SidebarNavLink href={`/u/${handle}` as Route} icon={<User className="h-5 w-5" />} label="Profile" />;
}

async function SidebarProfilePill() {
  const user = await getCurrentUser();
  return (
    <Link
      href={`/u/${user.handle}`}
      className="hover:bg-card dark:hover:bg-card-dark flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
    >
      <UserAvatar size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-sm font-semibold tracking-tight">{user.displayName}</div>
        <div className="text-gray truncate font-mono text-[11px]">@{user.handle}</div>
      </div>
    </Link>
  );
}

function SidebarProfilePillSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5" aria-hidden>
      <UserAvatarSkeleton size="sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Skeleton className="h-[17px] w-20 rounded" />
        <Skeleton className="h-[15px] w-14 rounded" />
      </div>
    </div>
  );
}
