import { Suspense } from 'react';
import { ActivityRowSkeleton } from '@/features/admin/components/activity-feed';
import { ActivityLogList, ActivityLogShell } from '@/features/admin/components/activity-log';
import { Tile } from '@/features/admin/components/tile';
import type { Metadata } from 'next';

export const prefetch = 'allow-runtime';

export const metadata: Metadata = {
  title: 'Activity log · Admin dashboard',
};

export default function ActivityLogPage({ searchParams }: PageProps<'/admin/log'>) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5">
      <ActivityLogShell>
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
      </ActivityLogShell>
    </div>
  );
}
