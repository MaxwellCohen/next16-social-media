'use client';

import { Tabs } from '@/components/ui/tabs';
import type { Route } from 'next';

export type ProfileTab = 'drops' | 'replies';

export function ProfileTabs({ handle, active }: { handle: string; active: ProfileTab }) {
  const PROFILE_TABS: { label: string; value: ProfileTab; href: Route }[] = [
    { label: 'Drops', value: 'drops', href: `/u/${handle}` as Route },
    { label: 'Replies', value: 'replies', href: `/u/${handle}?tab=replies` as Route },
  ];

  return (
    <div>
      <Tabs tabs={PROFILE_TABS} active={active} label="Profile sections" />
    </div>
  );
}
