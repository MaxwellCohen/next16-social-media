'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
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
  const router = useRouter();
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [pending, startTransition] = useTransition();

  function handleSelect(value: Tab) {
    if (value === optimisticActive) return;
    startTransition(() => {
      setOptimisticActive(value);
      router.push(`/u/${handle}${value === 'drops' ? '' : `?tab=${value}`}` as never);
    });
  }

  return (
    <nav
      className="border-divider/70 dark:border-divider-dark/70 flex gap-1 border-b p-2 text-sm font-medium"
      aria-label="Profile sections"
    >
      {TABS.map(t => {
        const isActive = optimisticActive === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => {
              handleSelect(t.value);
            }}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-center transition-colors',
              isActive ? 'bg-accent/10 text-accent dark:bg-accent/15' : 'text-gray hover:bg-card dark:hover:bg-card-dark',
              pending && isActive && 'animate-pulse',
            )}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
