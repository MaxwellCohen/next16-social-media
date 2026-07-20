'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useId, useRef, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { SeedFromSearchParam } from '@/components/scripts/seed-from-search-param';
import { Chips, ChipsSkeleton } from '@/components/ui/chips';
import { Spinner } from '@/components/ui/spinner';
import { ActivityRow, ActivityRowSkeleton } from '@/features/admin/components/activity-feed';
import { Tile } from '@/features/admin/components/tile';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { useSyncInputToSearchParam } from '@/hooks/use-sync-input-to-search-param';
import type { ActivityKind } from '@/types/admin';
import type { Route } from 'next';

const BASE = '/admin/log';
type Filter = ActivityKind | 'all';

const FILTERS: Filter[] = ['all', 'drop', 'reply', 'like', 'repost'];
const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Drops', value: 'drop' },
  { label: 'Replies', value: 'reply' },
  { label: 'Likes', value: 'like' },
  { label: 'Reposts', value: 'repost' },
];

function parseKind(value: string | undefined | null): Filter {
  return (FILTERS as string[]).includes(value ?? '') ? (value as Filter) : 'all';
}

export function ActivityLogFilters() {
  return <Chips basePath={BASE} param="kind" defaultValue="all" options={FILTER_OPTIONS} label="Activity filters" />;
}

export function ActivityLogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Suspense fallback={<ChipsSkeleton count={5} />}>
          <ActivityLogFilters />
        </Suspense>
        <ActivityLogSearch />
      </div>
      {children}
    </>
  );
}

export function ActivityLogSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [isPending, startTransition] = useTransition();

  useSyncInputToSearchParam(inputRef, 'q');

  return (
    <Boundary label="ActivityLogSearch">
      <div className="relative">
        {isPending ? (
          <Spinner className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-40" />
        ) : (
          <Search className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="q"
          aria-label="Search activity"
          placeholder="Search activity…"
          suppressHydrationWarning
          onChange={event => {
            const value = event.target.value;
            startTransition(() => {
              const params = new URLSearchParams(window.location.search);
              if (value) params.set('q', value);
              else params.delete('q');
              const qs = params.toString();
              router.replace((qs ? `${BASE}?${qs}` : BASE) as Route);
            });
          }}
          className="bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none"
        />
        <SeedFromSearchParam targetId={inputId} param="q" />
      </div>
    </Boundary>
  );
}

export function ActivityLogList({ kind, query }: { kind?: string; query: string }) {
  const { snapshot, flashIds } = useAdmin();
  const activeKind = parseKind(kind);
  const q = query.trim().toLowerCase();

  const items = (snapshot?.recentActivity ?? []).filter(item => {
    if (activeKind !== 'all' && item.kind !== activeKind) return false;
    if (q && !item.actorHandle.toLowerCase().includes(q) && !(item.preview ?? '').toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  return (
    <Boundary label="ActivityLogList">
      <Tile
        title="Activity log"
        action={<span className="text-gray font-mono text-xs">{snapshot ? items.length : ''}</span>}
      >
        {!snapshot ? (
          <ul className="pb-2" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <ActivityRowSkeleton key={i} />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <p className="text-gray px-4 pb-4 text-sm">No matching activity.</p>
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
