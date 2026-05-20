'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h2 className="text-lg font-bold tracking-tight uppercase">Something went wrong</h2>
      <p className="text-gray text-sm">We couldn&apos;t load this page. Please try again.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
