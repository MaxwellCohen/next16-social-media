'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Tabs } from '@/components/ui/tabs';
import type { Route } from 'next';

export type ProfileTab = 'drops' | 'replies';

export function ProfileTabs({ handle, active }: { handle: string; active: ProfileTab }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const tabs: { label: string; value: ProfileTab; href: Route }[] = [
    { label: 'Drops', value: 'drops', href: `/u/${handle}` as Route },
    { label: 'Replies', value: 'replies', href: `/u/${handle}?tab=replies` as Route },
  ];

  return (
    <div data-pending={isPending ? '' : undefined}>
      <Tabs
        tabs={tabs}
        active={active}
        action={value => {
          startTransition(() => {
            router.push(`/u/${handle}${value === 'drops' ? '' : `?tab=${value}`}` as Route);
          });
        }}
        label="Profile sections"
      />
    </div>
  );
}
