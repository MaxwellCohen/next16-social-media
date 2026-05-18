import { Suspense } from 'react';
import { DropComposer } from '@/features/drop/components/DropComposer';
import { Feed, FeedSkeleton } from '@/features/drop/components/Feed';

export default function HomePage() {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
        <h1 className="text-lg font-bold tracking-tight">Home</h1>
      </header>
      <DropComposer />
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}
