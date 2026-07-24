'use client';

import { use, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type Preview = { body: string; node: Promise<ReactNode> };

export function DropPreview({ preview }: { preview: Preview | null }) {
  if (!preview) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  return use(preview.node);
}

export function ThreadPreview({ nodes }: { nodes: Promise<ReactNode[]> }) {
  const rendered = use(nodes);
  if (rendered.length === 0) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  return rendered.map((node, i) => (
    <div
      key={i}
      className={cn(
        i === 0 && rendered.length > 1 && 'border-divider/70 dark:border-divider-dark/70 border-b pb-4',
        i > 0 && 'pt-4',
      )}
    >
      {node}
    </div>
  ));
}

export function PreviewSkeleton() {
  return <Skeleton className="h-4 w-24 rounded" />;
}
