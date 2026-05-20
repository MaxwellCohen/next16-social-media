'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Tabs } from '@/components/ui/tabs';
import type { Route } from 'next';

export type FeedTab = 'following' | 'discover';

const FEED_TABS: { label: string; value: FeedTab }[] = [
  { label: 'Following', value: 'following' },
  { label: 'Discover', value: 'discover' },
];

export function FeedTabs({ tabPromise }: { tabPromise: Promise<FeedTab> }) {
  const active = use(tabPromise);
  const router = useRouter();

  return (
    <Tabs
      tabs={FEED_TABS}
      active={active}
      action={value => {
        router.push((value === 'following' ? '/' : '/?tab=discover') as Route);
      }}
      label="Feed sections"
    />
  );
}
