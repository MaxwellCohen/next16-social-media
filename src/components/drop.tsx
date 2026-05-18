import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { TagPill } from "@/components/tag-pill";
import { CodeBlock } from "@/components/code-block";
import { DropActions } from "@/components/drop-actions";
import { getUserByHandle, getCurrentUser } from "@/data/queries/user";
import { isLiked, isBookmarked } from "@/data/queries/drop";
import { timeAgo } from "@/lib/utils";
import type { Drop as DropT } from "@/lib/data";

type Props = {
  drop: DropT;
  compact?: boolean;
};

export async function Drop({ drop, compact = false }: Props) {
  const author = await getUserByHandle(drop.authorHandle);
  if (!author) return null;

  const current = await getCurrentUser();
  const liked = await isLiked(current.handle, drop.id);
  const bookmarked = await isBookmarked(current.handle, drop.id);

  return (
    <article className="group/drop border-b border-divider/70 transition-colors hover:bg-card/40 dark:border-divider-dark/70 dark:hover:bg-card-dark/40">
      <div className="flex gap-3 px-4 py-4 sm:px-5">
        <Link href={`/u/${author.handle}`} className="shrink-0">
          <Avatar name={author.displayName} color={author.avatarColor} size="md" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <header className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
            <Link
              href={`/u/${author.handle}`}
              className="font-semibold tracking-tight text-black hover:underline dark:text-white"
            >
              {author.displayName}
            </Link>
            <Link
              href={`/u/${author.handle}`}
              className="text-gray font-mono text-[12px]"
            >
              @{author.handle}
            </Link>
            <span className="text-gray font-mono text-[12px]">·</span>
            <Link
              href={`/drop/${drop.id}`}
              className="text-gray font-mono text-[12px] hover:underline"
            >
              {timeAgo(drop.createdAt)}
            </Link>
          </header>

          <Link
            href={`/drop/${drop.id}`}
            className="text-[15px] leading-snug text-black dark:text-white"
          >
            {renderBody(drop.body)}
          </Link>

          {drop.embeddedCode && !compact ? (
            <CodeBlock lang={drop.embeddedCode.lang} code={drop.embeddedCode.code} />
          ) : null}

          {drop.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {drop.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
            </div>
          ) : null}

          <DropActions
            dropId={drop.id}
            likes={drop.likes}
            replies={drop.replies}
            reposts={drop.reposts}
            initialLiked={liked}
            initialBookmarked={bookmarked}
          />
        </div>
      </div>
    </article>
  );
}

function renderBody(body: string) {
  const parts = body.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      const tag = part.slice(1);
      return (
        <Link
          key={i}
          href={`/tag/${tag}`}
          className="text-accent hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DropSkeleton() {
  return (
    <div className="border-b border-divider/70 px-4 py-4 sm:px-5 dark:border-divider-dark/70">
      <div className="flex gap-3">
        <div className="skeleton-animation h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="skeleton-animation h-3 w-40" />
          <div className="skeleton-animation h-4 w-full" />
          <div className="skeleton-animation h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
