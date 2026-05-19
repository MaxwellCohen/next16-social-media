'use client';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h2 className="text-lg font-bold tracking-tight uppercase">Something broke</h2>
      <p className="text-gray text-sm">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
