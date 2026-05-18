import Link from 'next/link';
import { getTrendingTags } from '@/data/queries/tag';
import { formatCount } from '@/lib/utils';

export async function TrendingTags() {
  const tags = await getTrendingTags();
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border">
      <header className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold tracking-tight">Trending now</h3>
      </header>
      <ul>
        {tags.map(tag => {return (
          <li key={tag.name}>
            <Link
              href={`/tag/${tag.name}`}
              className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white dark:hover:bg-black"
            >
              <span className="text-sm font-medium text-black dark:text-white">#{tag.name}</span>
              <span className="text-gray font-mono text-xs">{formatCount(tag.count)}</span>
            </Link>
          </li>
        )})}
      </ul>
    </section>
  );
}

export function TrendingTagsSkeleton() {
  return (
    <section className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border p-4">
      <h3 className="mb-3 text-sm font-semibold tracking-tight">Trending now</h3>
      <ul className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => {return (
          <li key={i} className="skeleton-animation h-4 w-32" />
        )})}
      </ul>
    </section>
  );
}
