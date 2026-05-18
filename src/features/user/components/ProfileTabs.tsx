'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type Tab = 'drops' | 'replies';

type Props = {
  handle: string;
  active: Tab;
};

const TABS: { label: string; value: Tab }[] = [
  { label: 'Drops', value: 'drops' },
  { label: 'Replies', value: 'replies' },
];

export function ProfileTabs({ handle, active }: Props) {
  return (
    <nav
      className="border-divider/70 dark:border-divider-dark/70 flex gap-1 border-b p-2 text-sm font-medium"
      aria-label="Profile sections"
    >
      {TABS.map(t => {
        const isActive = active === t.value;
        return (
          <Link
            key={t.value}
            href={`/u/${handle}${t.value === 'drops' ? '' : `?tab=${t.value}`}` as never}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-center transition-colors',
              isActive ? 'bg-accent/10 text-accent dark:bg-accent/15' : 'text-gray hover:bg-card dark:hover:bg-card-dark',
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
