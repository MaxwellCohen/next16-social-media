import { Suspense } from 'react';
import { DropListSkeleton } from '@/features/drop/components/Drop';
import { TagFeed, TagHeader, TagHeaderSkeleton } from '@/features/tag/components/TagFeed';
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

export default async function TagPage({ params }: PageProps<'/tag/[tag]'>) {
  const { tag } = await params;
  return (
    <div>
      <Suspense fallback={<TagHeaderSkeleton />}>
        <TagHeader tag={tag} />
      </Suspense>
      <Suspense fallback={<DropListSkeleton count={4} />}>
        <TagFeed tag={tag} />
      </Suspense>
    </div>
  );
}
