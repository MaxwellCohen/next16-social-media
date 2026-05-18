import Link from "next/link";
import { Bookmark, Hash, Home, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { DropMark } from "@/components/brand/drop-mark";
import { getCurrentUser } from "@/data/queries/user";
import { formatCount } from "@/lib/utils";

export async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="sticky top-0 hidden h-screen flex-col gap-4 px-4 py-5 sm:flex sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-black dark:text-white"
        aria-label="Drop home"
      >
        <DropMark size={22} className="text-black dark:text-white" />
        <span>drop</span>
      </Link>

      <nav className="flex flex-col gap-0.5 text-sm font-medium">
        <SidebarLink href="/" icon={<Home className="h-5 w-5" />}>
          Home
        </SidebarLink>
        <SidebarLink href={`/u/${user.handle}`} icon={<User className="h-5 w-5" />}>
          Profile
        </SidebarLink>
        <SidebarLink href="/bookmarks" icon={<Bookmark className="h-5 w-5" />}>
          Bookmarks
        </SidebarLink>
        <SidebarLink href="/tag/nextjs" icon={<Hash className="h-5 w-5" />}>
          Tags
        </SidebarLink>
      </nav>

      <Link
        href={`/u/${user.handle}`}
        className="mt-auto flex items-center gap-3 rounded-full border border-divider bg-white p-2 pr-4 transition-colors hover:bg-card dark:border-divider-dark dark:bg-black dark:hover:bg-card-dark"
      >
        <Avatar name={user.displayName} color={user.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold tracking-tight">
            {user.displayName}
          </div>
          <div className="text-gray truncate font-mono text-[11px]">
            @{user.handle} · {formatCount(user.followers)}
          </div>
        </div>
      </Link>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      // typedRoutes hint
      href={href as never}
      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-colors hover:bg-card dark:hover:bg-card-dark"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
