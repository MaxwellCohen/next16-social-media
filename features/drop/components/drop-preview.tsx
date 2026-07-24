'use client';

import { Suspense, use, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export type Preview = { body: string; node: Promise<ReactNode> };

export function DropPreview({ preview }: { preview: Preview | null }) {
  if (!preview) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  return (
    <Suspense key={preview.body} fallback={<PreviewSkeleton />}>
      <PreviewContent node={preview.node} />
    </Suspense>
  );
}

function PreviewContent({ node }: { node: Promise<ReactNode> }) {
  return use(node);
}

function PreviewSkeleton() {
  return <Skeleton className="h-4 w-24 rounded" />;
}
