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
    <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 flex items-center gap-3 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
      <div className="text-gray -ml-1 p-1">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-3 w-8 rounded" />
        <Skeleton className="mt-1 h-5 w-28 rounded" />
      </div>
    </header>
  );
}
