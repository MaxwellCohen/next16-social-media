import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { DropActions } from '@/components/drop-actions';
import { TagPill } from '@/components/tag-pill';
import { Avatar } from '@/components/ui/avatar';
import { isLiked, isBookmarked } from '@/data/queries/drop';
import { getUserByHandle, getCurrentUser } from '@/data/queries/user';
import type { Drop as DropT } from '@/lib/data';
import { timeAgo } from '@/lib/utils';

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
    <article className="group/drop border-divider/70 hover:bg-card/40 dark:border-divider-dark/70 dark:hover:bg-card-dark/40 border-b transition-colors">
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
            <Link href={`/u/${author.handle}`} className="text-gray font-mono text-[12px]">
              @{author.handle}
            </Link>
            <span className="text-gray font-mono text-[12px]">·</span>
            <Link href={`/drop/${drop.id}`} className="text-gray font-mono text-[12px] hover:underline">
              {timeAgo(drop.createdAt)}
            </Link>
          </header>

          <DropBody body={drop.body} dropId={drop.id} compact={compact} />

          {drop.embeddedCode && !compact ? (
            <CodeBlock lang={drop.embeddedCode.lang} code={drop.embeddedCode.code} />
          ) : null}

          {drop.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {drop.tags.map(t => {return (
                <TagPill key={t} tag={t} />
              )})}
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
    if (part.startsWith('#')) {
      const tag = part.slice(1);
      return (
        <Link key={i} href={`/tag/${tag}`} className="text-accent hover:underline">
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Parses a drop body and renders prose segments and fenced code blocks
 * (```lang ... ```). Prose links to the drop detail page; code blocks render
 * inline with syntax highlighting.
 */
function DropBody({ body, dropId, compact }: { body: string; dropId: string; compact: boolean }) {
  const segments = splitCode(body);
  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          if (compact) return null;
          return <CodeBlock key={i} lang={segment.lang} code={segment.code} />;
        }
        return (
          <Link key={i} href={`/drop/${dropId}`} className="text-[15px] leading-snug text-black dark:text-white">
            {renderBody(segment.text)}
          </Link>
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
