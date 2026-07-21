'use client';

import { Boundary } from '@/components/internal/boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tile } from '@/features/admin/components/tile';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { formatCount } from '@/lib/utils';
import type { Route } from 'next';

export function TrendingBars() {
  const { snapshot } = useAdmin();
  const max = Math.max(1, ...(snapshot?.trending.map(tag => tag.count) ?? []));

  return (
    <Boundary label="TrendingBars">
      <Tile title="Trending tags">
        {!snapshot ? (
          <ul className="pb-2" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <TrendingRowSkeleton key={i} />
            ))}
          </ul>
        ) : snapshot.trending.length === 0 ? (
          <p className="text-gray px-4 pb-4 text-xs">No trending tags yet.</p>
        ) : (
          <ul className="pb-2">
            {snapshot.trending.map(tag => (
              <li key={tag.name}>
                <PrefetchLink
                  href={`/tag/${tag.name}` as Route}
                  className="block px-4 py-2 transition-colors hover:bg-white dark:hover:bg-black"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-black dark:text-white">#{tag.name}</span>
                    <span className="text-gray font-mono text-xs">{formatCount(tag.count)}</span>
                  </div>
                  <div className="bg-card dark:bg-card-dark h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-accent h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${(tag.count / max) * 100}%` }}
                    />
                  </div>
                </PrefetchLink>
              </li>
            ))}
          </ul>
        )}
      </Tile>
    </Boundary>
  );
}

function TrendingRowSkeleton() {
  return (
    <li className="min-h-12 px-4 py-2">
      <Skeleton className="h-3.5 w-20 rounded" />
    </li>
  );
}
