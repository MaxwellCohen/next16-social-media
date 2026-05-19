'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { ActionButton } from '@/components/ui/action-button';
import { Skeleton } from '@/components/ui/skeleton';
import { toggleBookmark, toggleLike, toggleRepost } from '@/features/drop/drop-actions';
import type { DropUserState } from '@/features/user/user-queries';
import { cn, formatCount } from '@/lib/utils';
import type { Route } from 'next';

type Props = {
  dropId: string;
  parentId?: string;
  replies: number;
  reposts: number;
  likes: number;
  userStatePromise: Promise<DropUserState>;
};

export function DropActions({ dropId, parentId, replies, reposts, likes, userStatePromise }: Props) {
  const { liked, reposted, bookmarked } = use(userStatePromise);
  return (
    <div className="text-gray -ml-2 flex items-center gap-1 pt-0.5">
      <Link
        href={`/drop/${parentId ?? dropId}` as Route}
        aria-label="Reply"
        onClick={e => {
          e.stopPropagation();
        }}
        className="hover:bg-card dark:hover:bg-card-dark inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors hover:text-black dark:hover:text-white"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{formatCount(replies)}</span>
      </Link>
      <ActionButton
        label="Repost"
        icon={() => {
          return <Repeat2 className="h-4 w-4" />;
        }}
        count={reposts}
        active={reposted}
        activeColor="text-success"
        hoverColor="hover:bg-success/10 hover:text-success"
        action={async () => {
          await toggleRepost(dropId);
        }}
      />
      <ActionButton
        label="Like"
        icon={on => {
          return <Heart className={cn('h-4 w-4', on && 'fill-current')} />;
        }}
        count={likes}
        active={liked}
        activeColor="text-danger"
        hoverColor="hover:bg-danger/10 hover:text-danger"
        action={async () => {
          await toggleLike(dropId);
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
          await toggleBookmark(dropId);
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
            <Skeleton className="h-4 w-4 rounded" />
            {i < 3 ? <Skeleton className="h-3 w-6 rounded" /> : null}
          </span>
        );
      })}
    </div>
  );
}
