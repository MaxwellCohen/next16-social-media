import { Suspense } from 'react';
import { DropComposer } from '@/app/_components/drop-composer';
import { Feed, FeedSkeleton } from '@/app/_components/feed';

export default function HomePage() {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-10 border-b bg-white px-4 py-4 backdrop-blur sm:px-5 dark:bg-black">
        <h1 className="text-lg font-bold tracking-tight">Home</h1>
      </header>

      <Suspense>
        <DropComposer />
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}
