'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { loadMoreFeed, loadMorePublicFeed } from '@/features/drop/feed-actions';

type Props = {
  children: ReactNode;
  feedType: 'following' | 'discover';
  initialCursor: string | null;
};

export function FeedList({ children, initialCursor, feedType }: Props) {
  const [more, setMore] = useState<ReactNode[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [pending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    startTransition(async () => {
      const loader = feedType === 'discover' ? loadMorePublicFeed : loadMoreFeed;
      const next = await loader(cursor);
      setMore(prev => {
        return [...prev, ...next.items];
      });
      setCursor(next.nextCursor);
    });
  }

  return (
    <>
      <ul>
        {children}
        {more}
      </ul>
      {cursor ? (
        <div className="flex justify-center p-6">
          <Button variant="secondary" size="sm" onClick={loadMore} disabled={pending}>
            {pending ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      ) : null}
    </>
  );
}
