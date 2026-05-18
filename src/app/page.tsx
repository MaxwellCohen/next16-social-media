import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DropListSkeleton } from '@/features/drop/components/Drop';
import { DropComposer } from '@/features/drop/components/DropComposer';
import { Feed } from '@/features/drop/components/Feed';

export const unstable_prefetch = 'force-runtime';

export default function HomePage() {
  return (
    <div>
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Home</h1>
      </PageHeader>
      <DropComposer />
      <Suspense fallback={<DropListSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}
