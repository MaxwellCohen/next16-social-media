'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { use, useOptimistic, useTransition } from 'react';
import { ActionButton } from '@/components/ui/ActionButton';
import { toggleBookmark, toggleLike, toggleRepost } from '@/data/actions/drop';
import type { DropUserState } from '@/data/queries/drop';
import type { Drop } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  drop: Drop;
  userStatePromise: Promise<DropUserState>;
};

type LikeState = { liked: boolean; count: number };
type RepostState = { reposted: boolean; count: number };

export function DropActions({ drop, userStatePromise }: Props) {
  const { liked: initialLiked, reposted: initialReposted, bookmarked: initialBookmarked } = use(userStatePromise);
  const [, startTransition] = useTransition();
  const [likeState, setLikeOptimistic] = useOptimistic<LikeState, void>(
    { count: drop.likes, liked: initialLiked },
    state => {
      return {
        count: state.count + (state.liked ? -1 : 1),
        liked: !state.liked,
      };
    },
  );
  const [repostState, setRepostOptimistic] = useOptimistic<RepostState, void>(
    { count: drop.reposts, reposted: initialReposted },
    state => {
      return { count: state.count + (state.reposted ? -1 : 1), reposted: !state.reposted };
    },
  );
  const [bookmarked, setBookmarkOptimistic] = useOptimistic<boolean, void>(initialBookmarked, state => {
    return !state;
  });
  return (
    <div className="text-gray -ml-2 flex items-center gap-1 pt-0.5">
      <ActionButton
        label="Reply"
        icon={<MessageCircle className="h-4 w-4" />}
        count={drop.replies}
        hoverColor="hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white"
      />
      <ActionButton
        label="Repost"
        icon={<Repeat2 className="h-4 w-4" />}
        count={repostState.count}
        active={repostState.reposted}
        activeColor="text-success"
        hoverColor="hover:bg-success/10 hover:text-success"
        onClick={() => {
          startTransition(async () => {
            setRepostOptimistic();
            await toggleRepost(drop.id);
          });
        }}
      />
      <ActionButton
        label="Like"
        icon={<Heart className={cn('h-4 w-4', likeState.liked && 'fill-current')} />}
        count={likeState.count}
        active={likeState.liked}
        activeColor="text-danger"
        hoverColor="hover:bg-danger/10 hover:text-danger"
        onClick={() => {
          startTransition(async () => {
            setLikeOptimistic();
            await toggleLike(drop.id);
          });
        }}
      />
      <ActionButton
        label="Bookmark"
        icon={<Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />}
        active={bookmarked}
        activeColor="text-accent"
        hoverColor="hover:bg-accent/10 hover:text-accent"
        onClick={() => {
          startTransition(async () => {
            setBookmarkOptimistic();
            await toggleBookmark(drop.id);
          });
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
