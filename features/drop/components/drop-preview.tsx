'use client';

import { use, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export type Preview = { body: string; node: Promise<ReactNode> };

export function DropPreview({ preview }: { preview: Preview | null }) {
  if (!preview) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  return use(preview.node);
}

export function PreviewSkeleton() {
  return <Skeleton className="h-4 w-24 rounded" />;
}
