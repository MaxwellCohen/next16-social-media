'use client';

import { useOptimistic, useTransition } from 'react';
import { cn, formatCount } from '@/lib/utils';

type Props = {
  label: string;
  icon: (active: boolean) => React.ReactNode;
  count?: number;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  action?: () => void | Promise<void>;
};

export function ActionButton({ label, icon, count, active = false, activeColor, hoverColor, action }: Props) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [, startTransition] = useTransition();

  const visibleCount =
    typeof count === 'number' ? (optimisticActive === active ? count : count + (optimisticActive ? 1 : -1)) : undefined;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={optimisticActive}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (!action) return;
        startTransition(async () => {
          setOptimisticActive(!optimisticActive);
          await action();
        });
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors',
        optimisticActive && activeColor,
        hoverColor,
      )}
    >
      {icon(optimisticActive)}
      {typeof visibleCount === 'number' ? <span>{formatCount(visibleCount)}</span> : null}
    </button>
  );
}
