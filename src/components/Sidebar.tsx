import { Bookmark, Hash, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { DropMark } from '@/components/ui/DropMark';
import { getCurrentUser } from '@/data/queries/user';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import { SidebarNavLink } from './SidebarNavLink';

export async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="hidden h-full flex-col gap-4 overflow-hidden overscroll-y-none px-4 py-5 sm:flex sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-black dark:text-white"
        aria-label="Drop home"
      >
        <DropMark size={22} className="text-black dark:text-white" />
        <span>drop</span>
      </Link>
      <nav className="flex flex-col gap-0.5 text-sm font-medium">
        <SidebarNavLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
        <SidebarNavLink href={`/u/${user.handle}`} icon={<User className="h-5 w-5" />} label="Profile" />
        <SidebarNavLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Bookmarks" />
        <SidebarNavLink href="/tag/nextjs" icon={<Hash className="h-5 w-5" />} label="Tags" />
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={`/u/${user.handle}`}
          className="hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 rounded-full px-3 py-2 transition-colors"
        >
          <Suspense fallback={<UserAvatarSkeleton size="sm" />}>
            <UserAvatar handle={user.handle} size="sm" />
          </Suspense>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="truncate text-sm font-semibold tracking-tight">{user.displayName}</div>
            <div className="text-gray truncate font-mono text-[11px]">@{user.handle}</div>
          </div>
          <Settings className="text-gray h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <div className="px-3">
          <ThemeToggle variant="inline" />
        </div>
      </div>
    </aside>
  );
}
