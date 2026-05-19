import { Suspense } from 'react';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { TagFeed } from '@/features/tag/components/tag-feed';
import { TagHeader, TagHeaderSkeleton } from '@/features/tag/components/tag-header';
import type { Metadata } from 'next';

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
        {params.then(({ tag }) => {
          return <TagHeader tag={tag} />;
        })}
      </Suspense>
      <Suspense fallback={<DropListSkeleton count={4} />}>
        {params.then(({ tag }) => {
          return <TagFeed tag={tag} />;
        })}
      </Suspense>
    </div>
  );
}
