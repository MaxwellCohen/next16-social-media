import { Bookmark, Hash, Home, User } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { Suspense } from 'react';
import { DropMark } from '@/components/ui/DropMark';
import { getCurrentUserHandle } from '@/data/queries/user';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import { MobileTabLink, MobileTabLinkSkeleton } from './SidebarNavLink';

export function MobileHeader() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 dark:bg-card-dark/70 sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:hidden">
      <Suspense fallback={<UserAvatarSkeleton size="sm" />}>
        <MobileHeaderAvatar />
      </Suspense>
      <Link href="/" aria-label="Drop home" className="inline-flex items-center">
        <DropMark size={22} className="text-black dark:text-white" />
      </Link>
      <div className="h-8 w-8" aria-hidden />
    </header>
  );
}

async function MobileHeaderAvatar() {
  const handle = await getCurrentUserHandle();
  return (
    <Link href={`/u/${handle}` as Route} aria-label="Profile">
      <UserAvatar size="sm" />
    </Link>
  );
}

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-20 flex border-t bg-white pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden dark:bg-black"
    >
      <Suspense>
        <MobileTabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
      </Suspense>
      <Suspense>
        <MobileTabLink href="/tag" icon={<Hash className="h-5 w-5" />} label="Tags" />
      </Suspense>
      <Suspense>
        <MobileTabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
      </Suspense>
      <Suspense fallback={<MobileTabLinkSkeleton icon={<User className="h-5 w-5" />} label="Profile" />}>
        <MobileProfileTab />
      </Suspense>
    </nav>
  );
}

async function MobileProfileTab() {
  const handle = await getCurrentUserHandle();
  return <MobileTabLink href={`/u/${handle}` as Route} icon={<User className="h-5 w-5" />} label="Profile" />;
}
