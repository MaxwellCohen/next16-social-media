import { Search } from 'lucide-react';
import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { EmptyState } from '@/components/ui/empty-state';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PageHeader } from '@/components/ui/page-header';
import { Section } from '@/components/ui/section';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { SearchResults } from '@/features/search/components/search-results';
import { SearchShell } from '@/features/search/components/search-shell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export const prefetch = 'allow-runtime';

const inputClass = 'bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none';

function SearchShellFallback() {
  return (
    <>
      <Section className="px-4 py-3 sm:px-5">
        <div className="relative">
          <Search className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input type="search" disabled aria-label="Search drops" placeholder="Search drops…" className={inputClass} />
        </div>
      </Section>
      <DropListSkeleton count={3} />
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <div>
      <PageHeader title="Search" />
      <Suspense fallback={<SearchShellFallback />}>
        <SearchShell>
          <ErrorBoundary title="Search is taking a breather">
            <Suspense fallback={<DropListSkeleton count={3} />}>
              <Crossfade>
                {searchParams.then(sp => {
                  const q = typeof sp.q === 'string' ? sp.q : '';
                  if (!q) return <EmptyState title="Search drops" body="Type something to search." />;
                  return <SearchResults query={q} />;
                })}
              </Crossfade>
            </Suspense>
          </ErrorBoundary>
        </SearchShell>
      </Suspense>
    </div>
  );
}
