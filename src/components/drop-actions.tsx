"use client";

import { Bookmark, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import {
  toggleBookmark,
  toggleLike,
  toggleRepost,
} from "@/data/actions/drop";
import { cn, formatCount } from "@/lib/utils";

type Props = {
  dropId: string;
  likes: number;
  replies: number;
  reposts: number;
  initialLiked: boolean;
  initialBookmarked: boolean;
};

type LikeState = { liked: boolean; count: number };
type RepostState = { reposted: boolean; count: number };

export function DropActions({
  dropId,
  likes,
  replies,
  reposts,
  initialLiked,
  initialBookmarked,
}: Props) {
  const [, startTransition] = useTransition();

  const [likeState, setLikeOptimistic] = useOptimistic<LikeState, void>(
    { liked: initialLiked, count: likes },
    (state) => ({
      liked: !state.liked,
      count: state.count + (state.liked ? -1 : 1),
    }),
  );

  const [repostState, setRepostOptimistic] = useOptimistic<RepostState, void>(
    { reposted: false, count: reposts },
    (state) => ({ reposted: !state.reposted, count: state.count + 1 }),
  );

  const [bookmarked, setBookmarkOptimistic] = useOptimistic<boolean, void>(
    initialBookmarked,
    (state) => !state,
  );

  return (
    <div className="text-gray -ml-2 flex items-center gap-1 pt-0.5">
      <ActionButton
        label="Reply"
        icon={<MessageCircle className="h-4 w-4" />}
        count={replies}
        hoverColor="hover:bg-accent/10 hover:text-accent"
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
            await toggleRepost(dropId);
          });
        }}
      />

      <ActionButton
        label="Like"
        icon={
          <Heart className={cn("h-4 w-4", likeState.liked && "fill-current")} />
        }
        count={likeState.count}
        active={likeState.liked}
        activeColor="text-danger"
        hoverColor="hover:bg-danger/10 hover:text-danger"
        onClick={() => {
          startTransition(async () => {
            setLikeOptimistic();
            await toggleLike(dropId);
          });
        }}
      />

      <ActionButton
        label="Bookmark"
        icon={
          <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        }
        active={bookmarked}
        activeColor="text-accent"
        hoverColor="hover:bg-accent/10 hover:text-accent"
        onClick={() => {
          startTransition(async () => {
            setBookmarkOptimistic();
            await toggleBookmark(dropId);
          });
        }}
      />
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  onClick?: () => void;
};

function ActionButton({
  label,
  icon,
  count,
  active,
  activeColor,
  hoverColor,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors",
        active && activeColor,
        hoverColor,
      )}
    >
      {icon}
      {typeof count === "number" ? <span>{formatCount(count)}</span> : null}
    </button>
  );
}
