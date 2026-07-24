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

export function ThreadPreview({ nodes, avatar }: { nodes: Promise<ReactNode[]>; avatar: ReactNode }) {
  const rendered = use(nodes);
  if (rendered.length === 0) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  return rendered.map((node, i) => (
    <div
      key={i}
      className={cn(
        'flex gap-3',
        i === 0 && rendered.length > 1 && 'border-divider/70 dark:border-divider-dark/70 border-b pb-4',
        i > 0 && 'pt-4',
      )}
    >
      <div className="shrink-0">{avatar}</div>
      <div className="min-w-0 flex-1 pt-1.5">{node}</div>
    </div>
  ));
}

export function PreviewSkeleton() {
  return <Skeleton className="h-4 w-24 rounded" />;
}
