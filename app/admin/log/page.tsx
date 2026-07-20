import { Suspense } from 'react';
import { ChipsSkeleton } from '@/components/ui/chips';
import { ActivityRowSkeleton } from '@/features/admin/components/activity-feed';
import { ActivityLogFilters, ActivityLogList, ActivityLogSearch } from '@/features/admin/components/activity-log';
import { Tile } from '@/features/admin/components/tile';
import type { Metadata } from 'next';

export const prefetch = 'allow-runtime';

export const metadata: Metadata = {
  title: 'Activity log · Admin dashboard',
};

export default function ActivityLogPage({ searchParams }: PageProps<'/admin/log'>) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Suspense fallback={<ChipsSkeleton count={5} />}>
          <ActivityLogFilters />
        </Suspense>
        <ActivityLogSearch />
      </div>
      <Suspense
        fallback={
          <Tile title="Activity log">
            <ul className="pb-2" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => (
                <ActivityRowSkeleton key={i} />
              ))}
            </ul>
          </Tile>
        }
      >
        {searchParams.then(sp => {
          const kind = typeof sp.kind === 'string' ? sp.kind : undefined;
          const query = typeof sp.q === 'string' ? sp.q : '';
          return <ActivityLogList kind={kind} query={query} />;
        })}
      </Suspense>
    </div>
  );
}
