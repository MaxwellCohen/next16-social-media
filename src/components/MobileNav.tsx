import { Bookmark, Hash, Home, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { DropMark } from '@/components/ui/DropMark';
import { getCurrentUser } from '@/data/queries/user';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import { MobileTabLink, MobileTabLinkFallback } from './SidebarNavLink';

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
  const user = await getCurrentUser();
  return (
    <Link href={`/u/${user.handle}`} aria-label="Profile">
      <UserAvatar handle={user.handle} size="sm" />
    </Link>
  );
}

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-20 flex border-t bg-white backdrop-blur sm:hidden dark:bg-black"
    >
      <Suspense fallback={<MobileTabLinkFallback href="/" icon={<Home className="h-5 w-5" />} label="Home" />}>
        <MobileTabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
      </Suspense>
      <Suspense
        fallback={<MobileTabLinkFallback href="/tag/nextjs" icon={<Hash className="h-5 w-5" />} label="Tags" />}
      >
        <MobileTabLink href="/tag/nextjs" icon={<Hash className="h-5 w-5" />} label="Tags" />
      </Suspense>
      <Suspense
        fallback={<MobileTabLinkFallback href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />}
      >
        <MobileTabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
      </Suspense>
      <Suspense fallback={<MobileTabLinkFallback href="/" icon={<User className="h-5 w-5" />} label="Profile" />}>
        <MobileProfileTab />
      </Suspense>
    </nav>
  );
}

async function MobileProfileTab() {
  const user = await getCurrentUser();
  return <MobileTabLink href={`/u/${user.handle}`} icon={<User className="h-5 w-5" />} label="Profile" />;
}
