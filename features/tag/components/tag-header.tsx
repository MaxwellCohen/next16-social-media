import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { getDropsByTag } from '@/features/drop/drop-queries';

export async function TagHeader({ tag }: { tag: string }) {
  const drops = await getDropsByTag(tag);
  return (
    <PageHeader back>
      <div className="text-gray font-mono text-[11px] tracking-wide uppercase">Tag</div>
      <h1 className="text-lg font-bold tracking-tight">#{tag}</h1>
      <div className="text-gray font-mono text-xs">{drops.length} drops</div>
    </PageHeader>
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
