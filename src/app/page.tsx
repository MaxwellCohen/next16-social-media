import { Suspense } from "react";
import { DropComposer } from "@/components/drop-composer";
import { Feed, FeedSkeleton } from "@/components/feed";

export default function HomePage() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-divider/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-5 dark:border-divider-dark/70 dark:bg-black/80">
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
