import { Bookmark, Hash, Home, User } from 'lucide-react';
import { Suspense } from 'react';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { MobileTabLink } from './sidebar-nav-link';
import type { Route } from 'next';

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-20 flex border-t bg-white pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden dark:bg-black"
    >
      <Suspense>
        <MobileTabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
        <MobileTabLink href="/tag" icon={<Hash className="h-5 w-5" />} label="Tags" />
        <MobileTabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
        <MobileProfileTab />
      </Suspense>
    </nav>
  );
}

async function MobileProfileTab() {
  const handle = await getCurrentUserHandle();
  return <MobileTabLink href={`/u/${handle}` as Route} icon={<User className="h-5 w-5" />} label="Profile" />;
}
