import { Bookmark, Hash, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { SidebarNavLink } from '@/components/navigation/NavLink';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { DropMark } from '@/components/ui/DropMark';
import { getCurrentUser } from '@/data/queries/user';

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

      <div className="border-divider dark:border-divider-dark mt-auto flex flex-col gap-2 rounded-2xl border p-2">
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <Avatar name={user.displayName} color={user.avatarColor} size="sm" />
          <div className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">{user.displayName}</div>
          <Settings className="text-gray h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="border-divider dark:border-divider-dark flex justify-end border-t pt-1.5">
          <ThemeToggle variant="inline" />
        </div>
      </div>
    </aside>
  );
}
