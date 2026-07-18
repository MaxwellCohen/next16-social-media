'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Boundary } from '@/components/internal/boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Option = { value: string; label: string };

type Props = {
  basePath: string;
  param: string;
  options: Option[];
  defaultValue?: string;
  label?: string;
};

const chipClass = (active: boolean) =>
  cn(
    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
    active
      ? 'bg-accent hover:bg-accent-hover text-white'
      : 'bg-card text-gray dark:bg-card-dark hover:text-black dark:hover:text-white',
  );

export function Chips({ basePath, param, options, defaultValue, label = 'Filters' }: Props) {
  const searchParams = useSearchParams();
  const active = searchParams.get(param) ?? defaultValue ?? options[0]?.value ?? '';

  const hrefFor = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) params.delete(param);
    else params.set(param, value);
    const qs = params.toString();
    return (qs ? `${basePath}?${qs}` : basePath) as Route;
  };

  return (
    <Boundary label="Chips">
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map(option => (
          <Link
            key={option.value}
            href={hrefFor(option.value)}
            scroll={false}
            aria-current={active === option.value ? 'true' : undefined}
            className={chipClass(active === option.value)}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </Boundary>
  );
}

export function ChipsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-16 rounded-full" />
      ))}
    </div>
  );
}
