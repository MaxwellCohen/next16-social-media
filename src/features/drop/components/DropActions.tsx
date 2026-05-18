'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { ActionButton } from '@/components/design/ActionButton';
import { toggleBookmark, toggleLike, toggleRepost } from '@/data/actions/drop';
import type { DropUserState } from '@/data/queries/drop';
import { cn, formatCount } from '@/lib/utils';
import type { Drop } from '@/types/drop';

type Props = {
  drop: Drop;
  userStatePromise: Promise<DropUserState>;
};

export function DropActions({ drop, userStatePromise }: Props) {
  const { liked, reposted, bookmarked } = use(userStatePromise);
  return (
    <div className="text-gray -ml-2 flex items-center gap-1 pt-0.5">
      <Link
        href={`/drop/${drop.parentId ?? drop.id}`}
        aria-label="Reply"
        onClick={e => {
          e.stopPropagation();
        }}
        className="hover:bg-card dark:hover:bg-card-dark inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors hover:text-black dark:hover:text-white"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{formatCount(drop.replies)}</span>
      </Link>
      <ActionButton
        label="Repost"
        icon={() => {
          return <Repeat2 className="h-4 w-4" />;
        }}
        count={drop.reposts}
        active={reposted}
        activeColor="text-success"
        hoverColor="hover:bg-success/10 hover:text-success"
        action={async () => {
          await toggleRepost(drop.id);
        }}
      />
      <ActionButton
        label="Like"
        icon={on => {
          return <Heart className={cn('h-4 w-4', on && 'fill-current')} />;
        }}
        count={drop.likes}
        active={liked}
        activeColor="text-danger"
        hoverColor="hover:bg-danger/10 hover:text-danger"
        action={async () => {
          await toggleLike(drop.id);
        }}
      />
      <ActionButton
        label="Bookmark"
        icon={on => {
          return <Bookmark className={cn('h-4 w-4', on && 'fill-current')} />;
        }}
        active={bookmarked}
        activeColor="text-accent"
        hoverColor="hover:bg-accent/10 hover:text-accent"
        action={async () => {
          await toggleBookmark(drop.id);
        }}
      />
    </div>
  );
}

export function DropActionsSkeleton() {
  return (
    <div className="text-gray -ml-2 flex items-center gap-1 pt-0.5" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => {
        return (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1.5">
            <span className="skeleton-animation h-4 w-4 rounded" />
            {i < 3 ? <span className="skeleton-animation h-3 w-6 rounded" /> : null}
          </span>
        );
      })}
    </div>
  );
}
