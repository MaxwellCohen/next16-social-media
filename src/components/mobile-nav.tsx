import Link from "next/link";
import { Bookmark, Hash, Home, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { DropMark } from "@/components/brand/drop-mark";
import { getCurrentUser } from "@/data/queries/user";

export async function MobileHeader() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-divider/70 bg-white/80 px-4 py-3 backdrop-blur sm:hidden dark:border-divider-dark/70 dark:bg-black/80">
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

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-divider/70 bg-white/90 backdrop-blur sm:hidden dark:border-divider-dark/70 dark:bg-black/90"
    >
      <TabLink href="/" icon={<Home className="h-5 w-5" />} label="Home" />
      <TabLink href="/tag/nextjs" icon={<Hash className="h-5 w-5" />} label="Tags" />
      <TabLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} label="Saved" />
      <TabLink href="/u/aurora" icon={<User className="h-5 w-5" />} label="Profile" />
    </nav>
  );
}

function TabLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      // typedRoutes hint
      href={href as never}
      className="text-gray flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors hover:text-black dark:hover:text-white"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
