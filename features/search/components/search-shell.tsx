'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Section } from '@/components/ui/section';
import { Spinner } from '@/components/ui/spinner';
import type { Route } from 'next';

const inputClass = 'bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none';

export function SearchShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onSearch(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('q', value);
    else params.delete('q');
    const qs = params.toString();
    startTransition(() => {
      router.replace((qs ? `${pathname}?${qs}` : pathname) as Route, { scroll: false });
    });
  }

  return (
    <Boundary label="SearchShell">
      <Section className="px-4 py-3 sm:px-5">
        <div className="relative">
          {isPending ? (
            <Spinner className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-40" />
          ) : (
            <Search className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          )}
          <input
            type="search"
            name="q"
            defaultValue={searchParams.get('q') ?? ''}
            aria-label="Search drops"
            placeholder="Search drops…"
            onChange={event => onSearch(event.target.value)}
            className={inputClass}
          />
        </div>
      </Section>
      <div
        className="transition-opacity duration-200 ease-out data-[pending]:opacity-60"
        data-pending={isPending ? '' : undefined}
      >
        {children}
      </div>
    </Boundary>
  );
}
