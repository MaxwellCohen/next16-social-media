'use client';

import Link from 'next/link';
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
  href?: string;
};

export function ActionButton({ label, icon, count, active = false, activeColor, hoverColor, action, href }: Props) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [, startTransition] = useTransition();

  const visibleCount =
    typeof count === 'number' ? (optimisticActive === active ? count : count + (optimisticActive ? 1 : -1)) : undefined;

  const className = cn(
    'inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors',
    optimisticActive && activeColor,
    hoverColor,
  );

  const content = (
    <>
      {icon(optimisticActive)}
      {typeof visibleCount === 'number' ? <span>{formatCount(visibleCount)}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href as never}
        aria-label={label}
        className={className}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {content}
      </Link>
    );
  }

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
      className={className}
    >
      {content}
    </button>
  );
}
