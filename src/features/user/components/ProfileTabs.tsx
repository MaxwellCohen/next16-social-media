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
      className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm"
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
              'hover:bg-card dark:hover:bg-card-dark relative flex-1 px-4 py-4 transition-colors',
              isActive ? 'font-semibold text-black dark:text-white' : 'text-gray font-medium',
              pending && isActive && 'animate-pulse',
            )}
          >
            <span className="relative inline-block">
              {t.label}
              {isActive ? (
                <span className="absolute -bottom-4 left-0 h-1 w-full rounded-full bg-black dark:bg-white" aria-hidden />
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
