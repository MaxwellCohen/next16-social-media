import { Bookmark, Hash, Home, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DropMark } from '@/components/ui/drop-mark';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { UserSwitcher } from '@/features/user/components/user-switcher';
import { getCurrentUser, getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { SidebarNavLink, SidebarNavLinkSkeleton } from './sidebar-nav-link';
import type { Route } from 'next';

export function Sidebar() {
  return (
    <aside
      style={{ viewTransitionName: 'sidebar' }}
      className="sticky top-0 hidden h-dvh flex-col items-center gap-4 overflow-y-auto overscroll-y-contain px-2 py-5 sm:flex lg:items-stretch lg:px-6"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-2 pb-2 text-2xl font-bold tracking-tight text-black dark:text-white"
        aria-label="Drop home"
      >
        <DropMark size={28} className="text-black dark:text-white" />
        <span className="hidden lg:inline">drop</span>
      </Link>
      <nav className="flex flex-col gap-1.5 text-sm font-medium">
        <SidebarNavLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
        <SidebarNavLink href="/search" icon={<Search className="h-5 w-5" />} label="Search" />
        <SidebarNavLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Bookmarks" />
        <SidebarNavLink href="/tag" icon={<Hash className="h-5 w-5" />} label="Tags" />
        <Suspense fallback={<SidebarNavLinkSkeleton icon={<User className="h-5 w-5" />} label="Profile" />}>
          {getCurrentUserHandle().then(handle => {
            return (
              <SidebarNavLink href={`/u/${handle}` as Route} icon={<User className="h-5 w-5" />} label="Profile" />
            );
          })}
        </Suspense>
      </nav>
      <div className="mt-auto hidden lg:block">
        <div className="border-divider dark:border-divider-dark -mx-6 flex items-center gap-1 border-t px-4 py-3">
          <Suspense fallback={<SidebarProfilePillSkeleton />}>
            <SidebarProfilePill />
          </Suspense>
          <ThemeToggle variant="inline" />
        </div>
      </div>
    </aside>
  );
}

async function SidebarProfilePill() {
  const [user, allUsers] = await Promise.all([
    getCurrentUser(),
    prisma.user.findMany({
      orderBy: { handle: 'asc' },
      select: { avatarColor: true, displayName: true, handle: true },
    }),
  ]);

  return (
    <UserSwitcher currentHandle={user.handle} users={allUsers}>
      <CurrentUserAvatar size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-sm font-semibold tracking-tight">{user.displayName}</div>
        <div className="text-gray truncate font-mono text-[11px]">@{user.handle}</div>
      </div>
    </UserSwitcher>
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
