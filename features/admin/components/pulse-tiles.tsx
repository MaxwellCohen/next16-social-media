'use client';

import { ViewTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Tile } from '@/features/admin/components/tile';
import { useTween } from '@/features/admin/hooks/use-tween';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { formatCount } from '@/lib/utils';

const STAT_LABELS = ['Drops', 'Reposts', 'Likes', 'Users'];

const STAT_CARD =
  'border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 flex flex-col rounded-xl border px-4 py-3';

export function DropsPerMinute() {
  const { snapshot } = useAdmin();
  const value = useTween(snapshot?.dropsLastMinute ?? 0);
  return (
    <Boundary label="DropsPerMinute">
      <Tile title="Drops per minute">
        <div className="flex items-baseline gap-2 px-4 pb-4">
          {snapshot ? (
            <>
              <span className="text-accent font-mono text-5xl font-bold">{value}</span>
              <span className="text-gray text-sm">in the last 60s</span>
            </>
          ) : (
            <Skeleton className="h-12 w-24 rounded" />
          )}
        </div>
      </Tile>
    </Boundary>
  );
}

export function StatTiles() {
  const { snapshot } = useAdmin();
  return (
    <Boundary label="StatTiles">
      <ViewTransition update={{ 'admin-reveal': 'auto', default: 'none' }} default="none">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {!snapshot
          ? STAT_LABELS.map(label => (
              <div key={label} className={`${STAT_CARD} gap-1`} aria-hidden>
                <Skeleton className="h-4 w-10 rounded" />
                <Skeleton className="h-8 w-12 rounded" />
              </div>
            ))
          : [
              { label: 'Drops', value: snapshot.totals.drops },
              { label: 'Reposts', value: snapshot.totals.reposts },
              { label: 'Likes', value: snapshot.totals.likes },
              { label: 'Users', value: snapshot.totals.users },
            ].map(stat => (
              <div key={stat.label} className={`${STAT_CARD} gap-1`}>
                <span className="text-gray text-xs font-medium tracking-wide">{stat.label}</span>
                <StatValue value={stat.value} />
              </div>
            ))}
        </div>
      </ViewTransition>
    </Boundary>
  );
}

function StatValue({ value }: { value: number }) {
  const tweened = useTween(value);
  return <span className="font-mono text-2xl font-bold tracking-tight">{formatCount(tweened)}</span>;
}
