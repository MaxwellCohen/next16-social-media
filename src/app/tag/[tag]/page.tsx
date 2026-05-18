import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/Drop';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDropsByTag } from '@/data/queries/drop';

type Params = Pick<PageProps<'/tag/[tag]'>, 'params'>;

export default function TagPage({ params }: PageProps<'/tag/[tag]'>) {
  return (
    <div>
      <Suspense fallback={<TagHeaderSkeleton />}>
        <TagHeader params={params} />
      </Suspense>

      <Suspense fallback={<TagFeedSkeleton />}>
        <TagFeed params={params} />
      </Suspense>
    </div>
  );
}

async function TagHeader({ params }: Params) {
  const { tag } = await params;
  const drops = await getDropsByTag(tag);
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-10 border-b bg-white px-4 py-4 sm:px-5 dark:bg-black">
      <div className="text-gray font-mono text-[11px] tracking-wide uppercase">Tag</div>
      <h1 className="text-lg font-bold tracking-tight">#{tag}</h1>
      <div className="text-gray font-mono text-xs">{drops.length} drops</div>
    </header>
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
      <div className="skeleton-animation h-3 w-10 rounded" />
      <div className="skeleton-animation mt-1.5 h-6 w-32 rounded" />
      <div className="skeleton-animation mt-1.5 h-3 w-20 rounded" />
    </header>
  );
}

function TagFeedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 4 }).map((_, i) => {
        return (
          <li key={i}>
            <DropSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
