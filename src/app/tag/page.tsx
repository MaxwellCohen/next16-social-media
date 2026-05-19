import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TagsList, TagsListSkeleton } from '@/features/tag/components/TagsList';
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
