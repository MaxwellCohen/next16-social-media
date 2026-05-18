import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/follow-button";
import { getWhoToFollow } from "@/data/queries/user";

export async function WhoToFollow() {
  const users = await getWhoToFollow();
  return (
    <section className="border-divider dark:border-divider-dark border">
      <header className="border-divider dark:border-divider-dark border-b px-4 py-3">
        <h3 className="text-xs font-bold tracking-wide uppercase">
          Who to follow
        </h3>
      </header>
      <ul>
        {users.map((user) => (
          <li
            key={user.handle}
            className="border-divider dark:border-divider-dark flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
          >
            <Link href={`/u/${user.handle}`} className="shrink-0">
              <Avatar name={user.displayName} color={user.avatarColor} size="sm" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/u/${user.handle}`}
                className="block truncate text-sm font-bold tracking-tight hover:underline"
              >
                {user.displayName}
              </Link>
              <div className="text-gray truncate font-mono text-xs">
                @{user.handle}
              </div>
            </div>
            <FollowButton targetHandle={user.handle} initialFollowing={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WhoToFollowSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark border">
      <header className="border-divider dark:border-divider-dark border-b px-4 py-3">
        <h3 className="text-xs font-bold tracking-wide uppercase">
          Who to follow
        </h3>
      </header>
      <ul>
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="border-divider dark:border-divider-dark flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
          >
            <div className="skeleton-animation h-8 w-8" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="skeleton-animation h-3 w-24" />
              <div className="skeleton-animation h-3 w-16" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
