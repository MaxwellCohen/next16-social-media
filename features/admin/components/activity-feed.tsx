'use client';

import { Heart, MessageCircle, MessageSquare, Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Tile } from '@/features/admin/components/tile';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { cn, timeAgo } from '@/lib/utils';
import type { ActivityItem, ActivityKind } from '@/types/admin';
import type { Route } from 'next';

export const KIND: Record<ActivityKind, { icon: React.ReactNode; color: string }> = {
  drop: { color: 'text-accent', icon: <MessageSquare className="h-4 w-4" /> },
  like: { color: 'text-danger', icon: <Heart className="h-4 w-4" /> },
  reply: { color: 'text-accent', icon: <MessageCircle className="h-4 w-4" /> },
  repost: { color: 'text-success', icon: <Repeat2 className="h-4 w-4" /> },
};

export function ActivityRow({ item, flash }: { item: ActivityItem; flash?: boolean }) {
  const kind = KIND[item.kind];
  return (
    <ViewTransition>
      <li className={cn(flash && 'flash-in')}>
        <Link
          href={`/drop/${item.id}` as Route}
          className="flex items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black"
        >
          <span className={cn('mt-0.5 shrink-0', kind.color)}>{kind.icon}</span>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium text-black dark:text-white">@{item.actorHandle}</span>
            {item.preview && <p className="text-gray truncate text-xs">{item.preview}</p>}
          </div>
          <time className="text-gray shrink-0 font-mono text-xs">{timeAgo(new Date(item.at))}</time>
        </Link>
      </li>
    </ViewTransition>
  );
}

export function ActivityRowSkeleton() {
  return (
    <li className="flex min-h-14 items-start gap-2.5 px-4 py-2.5">
      <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-3 w-40 rounded" />
      </div>
      <Skeleton className="mt-1 h-3 w-6 shrink-0 rounded" />
    </li>
  );
}

export function ActivityFeed({ limit }: { limit?: number }) {
  const { snapshot, flashIds } = useAdmin();
  const items = snapshot ? (limit ? snapshot.recentActivity.slice(0, limit) : snapshot.recentActivity) : [];

  return (
    <Boundary label="ActivityFeed">
      <Tile title="Live activity" action={<span className="bg-accent size-2 animate-pulse rounded-full" />}>
        {!snapshot ? (
          <ul className="pb-2" aria-hidden>
            {Array.from({ length: limit ?? 6 }).map((_, i) => (
              <ActivityRowSkeleton key={i} />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <p className="text-gray px-4 pb-4 text-xs">Waiting for activity…</p>
        ) : (
          <ul className="pb-2">
            {items.map(item => (
              <ActivityRow key={item.id} item={item} flash={flashIds.has(item.id)} />
            ))}
          </ul>
        )}
      </Tile>
    </Boundary>
  );
}
