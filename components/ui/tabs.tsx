'use client';

import { useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';

type Tab<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  action: (value: T) => void | Promise<void>;
  label?: string;
};

export function Tabs<T extends string>({ tabs, active, action, label = 'Sections' }: Props<T>) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [isPending, startTransition] = useTransition();

  function handleSelect(value: T) {
    if (value === optimisticActive) return;
    startTransition(async () => {
      setOptimisticActive(value);
      await action(value);
    });
  }

  return (
    <nav className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm" aria-label={label}>
      {tabs.map(t => {
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
              isPending && isActive && 'animate-pulse',
            )}
          >
            {t.label}
            {isActive ? (
              <span className="absolute inset-x-6 -bottom-px h-1 rounded-t-full bg-black dark:bg-white" aria-hidden />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
