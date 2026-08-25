import { ExitFade } from '@/components/ui/crossfade';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingTags } from '@/features/tag/tag-queries';
import { formatCount } from '@/lib/utils';
import type { Route } from 'next';

const cardClass = 'border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border';

export async function TrendingTags() {
  const tags = await getTrendingTags();
  return (
    <section className={cardClass}>
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-base font-bold tracking-tight">Trending now</h3>
      </header>
      {tags.length === 0 ? (
        <p className="text-gray px-4 pb-4 text-xs">No trending tags yet.</p>
      ) : (
        <ul className="pb-2">
          {tags.map(tag => (
            <li key={tag.name}>
              <HoverPrefetchLink
                href={`/tag/${tag.name}` as Route}
                className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black"
              >
                <span className="text-sm font-medium text-black dark:text-white">#{tag.name}</span>
                <span className="text-gray font-mono text-xs">{formatCount(tag.count)}</span>
              </HoverPrefetchLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TrendingTagsSkeleton() {
  return (
    <ExitFade>
      <div className="px-4 py-4">
        <Skeleton className="mb-3 h-4 w-24 rounded" />
        <ul>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between py-2">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3 w-6 rounded" />
            </li>
          ))}
        </ul>
      </div>
    </ExitFade>
  );
}
