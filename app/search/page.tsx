import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { SearchInput } from '@/features/drop/components/search-input';
import { SearchResults } from '@/features/drop/components/search-results';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export const unstable_prefetch = 'force-runtime';

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div>
      <PageHeader title="Search" />
      <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 sm:px-5">
        <Suspense fallback={<Skeleton className="h-[42px] w-full rounded-lg" />}>
          <SearchInput />
        </Suspense>
      </div>
      <Suspense fallback={<DropListSkeleton count={3} />}>
        <Crossfade>
          {searchParams.then(sp => {
            const q = typeof sp.q === 'string' ? sp.q : '';
            if (!q) return <EmptyState title="Search drops" body="Type something to search." />;
            return <SearchResults query={q} />;
          })}
        </Crossfade>
      </Suspense>
    </div>
  );
}
