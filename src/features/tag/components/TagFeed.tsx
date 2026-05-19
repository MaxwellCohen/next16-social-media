import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDropsByTag } from '@/data/queries/drop';
import { Drop } from '@/features/drop/components/Drop';

export async function TagHeader({ tag }: { tag: string }) {
  const drops = await getDropsByTag(tag);
  return (
    <PageHeader>
      <div className="text-gray font-mono text-[11px] tracking-wide uppercase">Tag</div>
      <h1 className="text-lg font-bold tracking-tight">#{tag}</h1>
      <div className="text-gray font-mono text-xs">{drops.length} drops</div>
    </PageHeader>
  );
}

export async function TagFeed({ tag }: { tag: string }) {
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

export function TagHeaderSkeleton() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5 dark:bg-black">
      <Skeleton className="h-3 w-10 rounded" />
      <Skeleton className="mt-1.5 h-6 w-32 rounded" />
      <Skeleton className="mt-1.5 h-3 w-20 rounded" />
    </header>
  );
}
