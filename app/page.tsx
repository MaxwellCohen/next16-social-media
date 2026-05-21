import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { TabsSkeleton } from '@/components/ui/tabs';
import { DropComposer } from '@/features/drop/components/composer';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Feed, DiscoverFeed } from '@/features/drop/components/feed';
import { FeedTabs, type FeedTab } from '@/features/drop/components/feed-tabs';

export const unstable_prefetch = 'force-runtime';

function parseTab(value: string | string[] | undefined): FeedTab {
  return value === 'discover' ? 'discover' : 'following';
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  return n > 0 && Number.isInteger(n) ? n : 1;
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  const tabPromise = searchParams.then(sp => parseTab(sp.tab));
  const pagePromise = searchParams.then(sp => parsePage(sp.page));

  return (
    <div>
      <PageHeader title="Home" />
      <DropComposer />
      <Suspense fallback={<TabsSkeleton />}>
        <Crossfade>
          {tabPromise.then(tab => <FeedTabs active={tab} />)}
        </Crossfade>
      </Suspense>
      <Suspense fallback={<DropListSkeleton />}>
        <Crossfade>
          {Promise.all([tabPromise, pagePromise]).then(([tab, page]) => tab === 'discover' ? <DiscoverFeed page={page} /> : <Feed page={page} />)}
        </Crossfade>
      </Suspense>
    </div>
  );
}
