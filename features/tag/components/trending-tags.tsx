import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingTags } from '@/features/tag/tag-queries';
import { formatCount } from '@/lib/utils';

export function TrendingTags() {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold tracking-tight">Trending now</h3>
      </header>
      <Suspense fallback={<TrendingTagsListSkeleton />}>
        <ViewTransition enter="auto" default="none">
          <TrendingTagsList />
        </ViewTransition>
      </Suspense>
    </section>
  );
}

async function TrendingTagsList() {
  const tags = await getTrendingTags();
  return (
    <ul className="pb-2">
      {tags.map(tag => {
        return (
          <li key={tag.name}>
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black"
            >
              <span className="text-sm font-medium text-black dark:text-white">#{tag.name}</span>
              <span className="text-gray font-mono text-xs">{formatCount(tag.count)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function TrendingTagsListSkeleton() {
  return (
    <ul className="pb-2">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <li key={i} className="px-4 py-2.5">
            <Skeleton className="h-5 w-24 rounded" />
          </li>
        );
      })}
    </ul>
  );
}
