import { Bookmark, Hash, Home, Search, User } from 'lucide-react';
import { Suspense } from 'react';
import { NavLink } from '@/components/ui/nav-link';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import type { Route } from 'next';

const mobileTabBase = 'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors';
const mobileTabClass = ({ isActive }: { isActive: boolean }) =>
  `${mobileTabBase} ${
    isActive
      ? 'text-accent font-bold [&_svg]:stroke-[2.5]'
      : 'text-gray font-medium hover:text-black dark:hover:text-white'
  }`;

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      style={{ viewTransitionName: 'mobile-nav' }}
      className="border-divider/70 dark:border-divider-dark/70 sticky bottom-0 z-40 flex shrink-0 border-t bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:bg-black"
    >
      <NavLink href="/" aria-label="Home" className={mobileTabClass}>
        <Home className="h-5 w-5" />
        <span>Home</span>
      </NavLink>
      <NavLink href="/search" aria-label="Search" className={mobileTabClass}>
        <Search className="h-5 w-5" />
        <span>Search</span>
      </NavLink>
      <NavLink href="/tag" aria-label="Tags" className={mobileTabClass}>
        <Hash className="h-5 w-5" />
        <span>Tags</span>
      </NavLink>
      <NavLink href="/bookmarks" aria-label="Saved" className={mobileTabClass}>
        <Bookmark className="h-5 w-5" />
        <span>Saved</span>
      </NavLink>
      <Suspense fallback={<ProfileTabSkeleton />}>
        {getCurrentUserHandle().then(handle => (
          <NavLink href={`/u/${handle}` as Route} aria-label="Profile" className={mobileTabClass}>
            <User className="h-5 w-5" />
            <span>Profile</span>
          </NavLink>
        ))}
      </Suspense>
    </nav>
  );
}

function ProfileTabSkeleton() {
  return (
    <span className={`${mobileTabBase} text-gray font-medium opacity-50`}>
      <User className="h-5 w-5" />
      <span>Profile</span>
    </span>
  );
}
