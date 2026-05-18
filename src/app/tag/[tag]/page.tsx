import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDropsByTag } from '@/data/queries/drop';
import { Drop, DropListSkeleton } from '@/features/drop/components/Drop';
import type { Metadata } from 'next';

type Params = Pick<PageProps<'/tag/[tag]'>, 'params'>;

export async function generateMetadata({ params }: PageProps<'/tag/[tag]'>): Promise<Metadata> {
  const { tag } = await params;
  const title = `#${tag}`;
  const description = `Drops tagged #${tag}`;
  const url = `/tag/${tag}`;
  return {
    alternates: { canonical: url },
    description,
    openGraph: { description, title, type: 'website', url },
    title,
    twitter: { card: 'summary_large_image', description, title },
  };
}

export const unstable_prefetch = 'force-runtime';

export default function TagPage({ params }: PageProps<'/tag/[tag]'>) {
  return (
    <div>
      <Suspense fallback={<TagHeaderSkeleton />}>
        <TagHeader params={params} />
      </Suspense>
      <Suspense fallback={<DropListSkeleton count={4} />}>
        <TagFeed params={params} />
      </Suspense>
    </div>
  );
}

async function TagHeader({ params }: Params) {
  const { tag } = await params;
  const drops = await getDropsByTag(tag);
  return (
    <PageHeader>
      <div className="text-gray font-mono text-[11px] tracking-wide uppercase">Tag</div>
      <h1 className="text-lg font-bold tracking-tight">#{tag}</h1>
      <div className="text-gray font-mono text-xs">{drops.length} drops</div>
    </PageHeader>
  );
}

async function TagFeed({ params }: Params) {
  const { tag } = await params;
  const drops = await getDropsByTag(tag);
  if (drops.length === 0) {
    return <EmptyState title="No drops with this tag yet" body="Be the first to use it." />;
  }
  return (
    <ul>
      {drops.map(drop => {
        return (
          <li key={drop.id}>
            <Drop drop={drop} />
          </li>
        );
      })}
    </ul>
  );
}

function TagHeaderSkeleton() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5 dark:bg-black">
      <Skeleton className="h-3 w-10 rounded" />
      <Skeleton className="mt-1.5 h-6 w-32 rounded" />
      <Skeleton className="mt-1.5 h-3 w-20 rounded" />
    </header>
  );
}
