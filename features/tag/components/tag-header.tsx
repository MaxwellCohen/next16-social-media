import { Skeleton } from '@/components/ui/skeleton';
import { getDropsByTag } from '@/features/drop/drop-queries';

export async function TagHeader({ tag }: { tag: string }) {
  const drops = await getDropsByTag(tag);
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 sm:px-5">
      <h2 className="text-lg font-bold tracking-tight">#{tag}</h2>
      <div className="text-gray font-mono text-xs">{drops.length} drops</div>
    </div>
  );
}

export function TagHeaderSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5">
      <Skeleton className="h-5 w-28 rounded" />
      <Skeleton className="mt-1 h-3 w-16 rounded" />
    </div>
  );
}
