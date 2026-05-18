import { Bookmark, Hash, Home, User } from 'lucide-react';
import Link from 'next/link';
import { DropMark } from '@/components/ui/DropMark';
import { MobileTabLink } from '@/components/NavLink';
import { Avatar } from '@/components/ui/Avatar';
import { getCurrentUser } from '@/data/queries/user';

export async function MobileHeader() {
  const user = await getCurrentUser();
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 backdrop-blur sm:hidden dark:bg-black">
      <Link href={`/u/${user.handle}`} aria-label="Profile">
        <Avatar name={user.displayName} color={user.avatarColor} size="sm" />
      </Link>
      <Link href="/" aria-label="Drop home" className="inline-flex items-center">
        <DropMark size={22} className="text-black dark:text-white" />
      </Link>
      <div className="h-8 w-8" aria-hidden />
    </header>
  );
}

export async function MobileTabBar() {
  const user = await getCurrentUser();
  return (
    <nav
      aria-label="Primary"
      className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-20 flex border-t bg-white backdrop-blur sm:hidden dark:bg-black"
    >
      <MobileTabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
      <MobileTabLink href="/tag/nextjs" icon={<Hash className="h-5 w-5" />} label="Tags" />
      <MobileTabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
      <MobileTabLink href={`/u/${user.handle}`} icon={<User className="h-5 w-5" />} label="Profile" />
    </nav>
  );
}
