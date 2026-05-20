import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DropComposer } from '@/features/drop/components/composer';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Feed } from '@/features/drop/components/feed';

export const unstable_prefetch = 'force-runtime';

export default function HomePage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Following</h1>
      </PageHeader>
      <DropComposer />
      <Suspense fallback={<DropListSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}
