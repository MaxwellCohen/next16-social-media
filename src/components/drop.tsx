import { Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { DropActions } from '@/components/drop-actions';
import { RelativeTime } from '@/components/relative-time';
import { TagPill } from '@/components/tag-pill';
import { Avatar } from '@/components/ui/avatar';
import { isBookmarked, isLiked, isReposted } from '@/data/queries/drop';
import { getCurrentUser, getUserByHandle } from '@/data/queries/user';
import type { Drop as DropT } from '@/lib/data';

type Props = {
  drop: DropT;
  compact?: boolean;
  /** Handle of the user whose timeline reposted this drop, if any. */
  repostedBy?: string;
};

export async function Drop({ drop, compact = false, repostedBy }: Props) {
  const author = await getUserByHandle(drop.authorHandle);
  if (!author) return null;

  const current = await getCurrentUser();
  const liked = await isLiked(current.handle, drop.id);
  const reposted = await isReposted(current.handle, drop.id);
  const bookmarked = await isBookmarked(current.handle, drop.id);
  const reposter = repostedBy ? await getUserByHandle(repostedBy) : null;

  return (
    <article className="group/drop border-divider/70 hover:bg-card/40 dark:border-divider-dark/70 dark:hover:bg-card-dark/40 relative border-b transition-colors">
      {/*
        Card-wide click target. Sits on top via z-0, while every interactive
        descendant (avatar link, name link, tag pills, action buttons, code
        blocks for selection) opts back in with `relative z-10`.
      */}
      <Link
        href={`/drop/${drop.id}`}
        aria-label={`Drop by ${author.displayName}`}
        className="absolute inset-0 z-0"
      />
      {reposter ? (
        <Link
          href={`/u/${reposter.handle}`}
          className="text-gray hover:text-success relative z-10 flex w-fit items-center gap-2 px-4 pt-3 text-xs sm:px-5"
        >
          <Repeat2 className="h-3 w-3" />
          <span>{reposter.handle === current.handle ? 'You' : reposter.displayName} reposted</span>
        </Link>
      ) : null}
      <div className="relative flex gap-3 px-4 py-4 sm:px-5">
        <Link href={`/u/${author.handle}`} className="relative z-10 shrink-0">
          <Avatar name={author.displayName} color={author.avatarColor} size="md" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <header className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
            <Link
              href={`/u/${author.handle}`}
              className="relative z-10 font-semibold tracking-tight text-black hover:underline dark:text-white"
            >
              {author.displayName}
            </Link>
            <Link href={`/u/${author.handle}`} className="text-gray relative z-10 font-mono text-[12px]">
              @{author.handle}
            </Link>
            <span className="text-gray font-mono text-[12px]">·</span>
            <span className="text-gray font-mono text-[12px]">
              <RelativeTime date={drop.createdAt} />
            </span>
          </header>

          <DropBody body={drop.body} compact={compact} />

          {drop.embeddedCode && !compact ? (
            <div className="relative z-10">
              <CodeBlock lang={drop.embeddedCode.lang} code={drop.embeddedCode.code} />
            </div>
          ) : null}

          {drop.tags.length > 0 ? (
            <div className="relative z-10 flex flex-wrap gap-1.5">
              {drop.tags.map(t => {
                return <TagPill key={t} tag={t} />;
              })}
            </div>
          ) : null}

          <div className="relative z-10">
            <DropActions
              dropId={drop.id}
              likes={drop.likes}
              replies={drop.replies}
              reposts={drop.reposts}
              initialLiked={liked}
              initialReposted={reposted}
              initialBookmarked={bookmarked}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function renderBody(body: string) {
  const parts = body.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) {
      const tag = part.slice(1);
      return (
        <Link key={i} href={`/tag/${tag}`} className="text-accent relative z-10 hover:underline">
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Parses a drop body and renders prose segments and fenced code blocks
 * (```lang ... ```). Code blocks render inline with syntax highlighting and
 * sit above the card-wide click target so users can select code freely.
 */
function DropBody({ body, compact }: { body: string; compact: boolean }) {
  const segments = splitCode(body);
  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          if (compact) return null;
          return (
            <div key={i} className="relative z-10">
              <CodeBlock lang={segment.lang} code={segment.code} />
            </div>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-snug text-black dark:text-white">
            {renderBody(segment.text)}
          </p>
        );
      })}
    </div>
  );
}

type Segment = { type: 'text'; text: string } | { type: 'code'; lang: string; code: string };

const FENCE = /```(\w*)\n([\s\S]*?)\n?```/g;

function splitCode(body: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  for (const match of body.matchAll(FENCE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      const text = body.slice(lastIndex, start).trim();
      if (text) segments.push({ text, type: 'text' });
    }
    segments.push({
      code: match[2],
      lang: match[1] || 'bash',
      type: 'code',
    });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < body.length) {
    const text = body.slice(lastIndex).trim();
    if (text) segments.push({ text, type: 'text' });
  }
  if (segments.length === 0) {
    segments.push({ text: body, type: 'text' });
  }
  return segments;
}

export function DropSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5">
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
