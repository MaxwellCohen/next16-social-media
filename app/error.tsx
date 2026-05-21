'use client';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState title="Something went wrong" body="We couldn't load this page. Please try again.">
      <Button onClick={reset}>Try again</Button>
    </EmptyState>
  );
}
