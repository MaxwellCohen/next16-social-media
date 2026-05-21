import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { TagsList, TagsListSkeleton } from '@/features/tag/components/tags-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/tag' },
  description: 'All tags used on Drop.',
  title: 'Tags',
};

export const unstable_prefetch = 'force-runtime';

export default function TagsPage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Tags</h1>
      </PageHeader>
      <Suspense fallback={<TagsListSkeleton />}>
        <Crossfade>
          <TagsList />
        </Crossfade>
      </Suspense>
    </div>
  );
}
