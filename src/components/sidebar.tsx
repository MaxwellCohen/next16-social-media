import Link from "next/link";
import { Bookmark, Hash, Home, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { getCurrentUser } from "@/data/queries/user";
import { formatCount } from "@/lib/utils";

export async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="border-divider dark:border-divider-dark flex flex-col gap-6 border-r px-4 py-6 sm:px-6">
      <Link href="/" className="text-accent text-2xl font-bold tracking-tight">
        drop.
      </Link>

      <nav className="flex flex-col gap-1 text-sm font-medium">
        <SidebarLink href="/" icon={<Home className="h-4 w-4" />}>
          Home
        </SidebarLink>
        <SidebarLink href={`/u/${user.handle}`} icon={<User className="h-4 w-4" />}>
          Profile
        </SidebarLink>
        <SidebarLink href="/bookmarks" icon={<Bookmark className="h-4 w-4" />}>
          Bookmarks
        </SidebarLink>
        <SidebarLink href="/tag/nextjs" icon={<Hash className="h-4 w-4" />}>
          Tags
        </SidebarLink>
      </nav>

      <Link
        href={`/u/${user.handle}`}
        className="border-divider dark:border-divider-dark hover:bg-card dark:hover:bg-card-dark mt-auto flex items-center gap-3 border p-3 transition-colors"
      >
        <Avatar name={user.displayName} color={user.avatarColor} size="md" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold tracking-tight">
            {user.displayName}
          </div>
          <div className="text-gray truncate font-mono text-xs">
            @{user.handle} · {formatCount(user.followers)} followers
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
      className="hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 px-3 py-2 tracking-wide uppercase text-xs transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
