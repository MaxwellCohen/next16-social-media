import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { DropList, DropListSkeleton } from '@/features/drop/components/drop';
import { SearchInput } from '@/features/drop/components/search-input';
import { searchDrops } from '@/features/drop/drop-queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export const unstable_prefetch = 'force-runtime';

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Search</h1>
      </PageHeader>
      <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 sm:px-5">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <Suspense fallback={<DropListSkeleton count={3} />}>
        {searchParams.then(sp => {
          const q = typeof sp.q === 'string' ? sp.q : '';
          if (!q) return <EmptyState title="Search drops" body="Type something to search." />;
          return <SearchResults query={q} />;
        })}
      </Suspense>
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const drops = await searchDrops(query);
  if (drops.length === 0) {
    return <EmptyState title="No results" body={`Nothing matched "${query}".`} />;
  }

  return <DropList drops={drops} />;
}
