'use client';

import { Boundary } from '@/components/internal/boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tile } from '@/features/admin/components/tile';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { formatCount } from '@/lib/utils';
import type { Route } from 'next';

export function TopDrops() {
  const { snapshot } = useAdmin();

  return (
    <Boundary label="TopDrops">
      <Tile title="Top drops">
        {!snapshot ? (
          <ol className="pb-2" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <TopDropRowSkeleton key={i} />
            ))}
          </ol>
        ) : snapshot.topDrops.length === 0 ? (
          <p className="text-gray px-4 pb-4 text-xs">No drops yet.</p>
        ) : (
          <ol className="pb-2">
            {snapshot.topDrops.map((drop, index) => (
              <li key={drop.id}>
                <PrefetchLink
                  href={`/drop/${drop.id}` as Route}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black"
                >
                  <span className="text-gray w-4 shrink-0 text-center font-mono text-sm">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">
                    <span className="text-gray">@{drop.authorHandle}</span>{' '}
                    <span className="text-black dark:text-white">{drop.preview}</span>
                  </span>
                  <span className="text-gray shrink-0 font-mono text-xs">{formatCount(drop.score)}</span>
                </PrefetchLink>
              </li>
            ))}
          </ol>
        )}
      </Tile>
    </Boundary>
  );
}

function TopDropRowSkeleton() {
  return (
    <li className="flex min-h-10 items-center gap-3 px-4 py-2.5">
      <Skeleton className="h-3.5 w-4 shrink-0 rounded" />
      <Skeleton className="h-3.5 w-40 max-w-full flex-1 rounded" />
    </li>
  );
}
