import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DropComposer } from '@/features/drop/components/composer';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Feed, DiscoverFeed } from '@/features/drop/components/feed';
import { FeedTabs, type FeedTab } from '@/features/drop/components/feed-tabs';

export const unstable_prefetch = 'force-runtime';

function parseTab(value: string | string[] | undefined): FeedTab {
  return value === 'discover' ? 'discover' : 'following';
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  const tabPromise = searchParams.then(sp => {
    return parseTab(sp.tab);
  });

  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Home</h1>
      </PageHeader>
      <Suspense fallback={<FeedTabsSkeleton />}>
        <FeedTabs tabPromise={tabPromise} />
      </Suspense>
      <DropComposer />
      <Suspense fallback={<DropListSkeleton />}>
        {tabPromise.then(tab => {
          return tab === 'discover' ? <DiscoverFeed /> : <Feed />;
        })}
      </Suspense>
    </div>
  );
}

function FeedTabsSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm" aria-hidden>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <span key={i} className="flex-1 px-4 py-4 text-center">
            <Skeleton className="inline-block h-5 w-16 rounded align-middle" />
          </span>
        );
      })}
    </div>
  );
}
