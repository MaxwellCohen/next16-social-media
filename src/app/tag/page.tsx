import { Hash } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { getAllTags } from '@/data/queries/tag';
import { formatCount } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/tag' },
  description: 'All tags used on Drop.',
  openGraph: { description: 'All tags used on Drop.', title: 'Tags', type: 'website', url: '/tag' },
  title: 'Tags',
  twitter: { card: 'summary', description: 'All tags used on Drop.', title: 'Tags' },
};

export const unstable_prefetch = 'force-runtime';

export default function TagsPage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Tags</h1>
      </PageHeader>
      <Suspense fallback={<TagsListSkeleton />}>
        <TagsList />
      </Suspense>
    </div>
  );
}

async function TagsList() {
  const tags = await getAllTags();
  if (tags.length === 0) {
    return <p className="text-gray p-6 text-sm">No tags yet.</p>;
  }
  return (
    <ul>
      {tags.map(tag => {
        return (
          <li key={tag.name}>
            <Link
              href={`/tag/${tag.name}` as never}
              className="border-divider/70 dark:border-divider-dark/70 hover:bg-card dark:hover:bg-card-dark flex items-center gap-3 border-b px-4 py-3 transition-colors sm:px-5"
            >
              <Hash className="text-gray h-5 w-5 shrink-0" aria-hidden />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold tracking-tight">#{tag.name}</span>
                <span className="text-gray font-mono text-[11px]">
                  {formatCount(tag.count)} {tag.count === 1 ? 'drop' : 'drops'}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function TagsListSkeleton() {
  return (
    <ul aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => {
        return (
          <li
            key={i}
            className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b px-4 py-3 sm:px-5"
          >
            <Hash className="text-gray h-5 w-5 shrink-0" aria-hidden />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
