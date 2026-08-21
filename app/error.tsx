'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
      <AlertTriangle className="text-danger h-8 w-8" />
      <p className="text-sm font-medium text-black dark:text-white">Something went wrong</p>
      <p className="text-gray max-w-xs text-sm">We couldn&apos;t load this page. Please try again.</p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
        <PrefetchLink
          href="/"
          className="border-divider dark:border-divider-dark inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold"
        >
          Go home
        </PrefetchLink>
      </div>
    </div>
  );
}
