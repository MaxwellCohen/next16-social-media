import { Bookmark, Hash, Home, Search, User } from 'lucide-react';
import { Suspense } from 'react';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { MobileTabLink } from './sidebar-nav-link';
import type { Route } from 'next';

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider/70 dark:border-divider-dark/70 flex shrink-0 border-t bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:bg-black"
    >
      <Suspense>
        <MobileTabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
        <MobileTabLink href="/search" icon={<Search className="h-5 w-5" />} label="Search" />
        <MobileTabLink href="/tag" icon={<Hash className="h-5 w-5" />} label="Tags" />
        <MobileTabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
      </Suspense>
      <Suspense>
        {getCurrentUserHandle().then(handle => {
          return <MobileTabLink href={`/u/${handle}` as Route} icon={<User className="h-5 w-5" />} label="Profile" />;
        })}
      </Suspense>
    </nav>
  );
}
