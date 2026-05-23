import { Bookmark, Hash, Home, Search, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { NavLink } from '@/components/ui/nav-link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DropMark } from '@/components/ui/drop-mark';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { UserSwitcher } from '@/features/user/components/user-switcher';
import { getCurrentUser, getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import type { Route } from 'next';

const sidebarLinkBase =
  'flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight transition-colors lg:justify-start lg:px-3';
const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${sidebarLinkBase} ${
    isActive
      ? 'bg-accent/10 text-accent font-bold [&_svg]:stroke-[2.5] dark:bg-accent/15 dark:text-blue-400'
      : 'hover:bg-card dark:hover:bg-card-dark'
  }`;

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
        <NavLink href="/" aria-label="Home" className={sidebarLinkClass}>
          <Home className="h-5 w-5" />
          <span className="hidden lg:inline">Home</span>
        </NavLink>
        <NavLink href="/search" aria-label="Search" className={sidebarLinkClass}>
          <Search className="h-5 w-5" />
          <span className="hidden lg:inline">Search</span>
        </NavLink>
        <NavLink href="/bookmarks" aria-label="Bookmarks" className={sidebarLinkClass}>
          <Bookmark className="h-5 w-5" />
          <span className="hidden lg:inline">Bookmarks</span>
        </NavLink>
        <NavLink href="/tag" aria-label="Tags" className={sidebarLinkClass}>
          <Hash className="h-5 w-5" />
          <span className="hidden lg:inline">Tags</span>
        </NavLink>
        <Suspense fallback={<ProfileLinkSkeleton />}>
          {getCurrentUserHandle().then(handle => (
            <NavLink href={`/u/${handle}` as Route} aria-label="Profile" className={sidebarLinkClass}>
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Profile</span>
            </NavLink>
          ))}
        </Suspense>
      </nav>
      <div className="mt-auto hidden lg:block">
        <div className="border-divider dark:border-divider-dark -mx-6 flex items-center gap-1 border-t px-4 py-3">
          <ErrorBoundary title="Your profile is offline" compact>
            <Suspense fallback={<SidebarProfilePillSkeleton />}>
              <SidebarProfilePill />
            </Suspense>
          </ErrorBoundary>
          <ThemeToggle variant="inline" />
        </div>
      </div>
    </aside>
  );
}

function ProfileLinkSkeleton() {
  return (
    <span className={`${sidebarLinkBase} text-gray opacity-50`}>
      <User className="h-5 w-5" />
      <span className="hidden lg:inline">Profile</span>
    </span>
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

  return <UserSwitcher currentHandle={user.handle} users={allUsers} />;
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
