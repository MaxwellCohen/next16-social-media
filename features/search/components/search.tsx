'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useRef, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { SeedFromSearchParam } from '@/components/scripts/seed-from-search-param';
import { Section } from '@/components/ui/section';
import { Spinner } from '@/components/ui/spinner';
import { useSyncInputToSearchParam } from '@/hooks/use-sync-input-to-search-param';
import type { Route } from 'next';

const inputClass = 'bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none';

export function Search({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [isPending, startTransition] = useTransition();

  useSyncInputToSearchParam(inputRef, 'q');

  return (
    <Boundary label="Search">
      <Section className="px-4 py-3 sm:px-5">
        <div className="relative">
          {isPending ? (
            <Spinner className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-40" />
          ) : (
            <SearchIcon className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          )}
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            name="q"
            aria-label="Search drops"
            placeholder="Search drops…"
            suppressHydrationWarning
            onChange={event => {
              const value = event.target.value;
              startTransition(() => {
                router.replace((value ? `/search?q=${encodeURIComponent(value)}` : '/search') as Route, { scroll: false });
              });
            }}
            className={inputClass}
          />
          <SeedFromSearchParam targetId={inputId} param="q" />
        </div>
      </Section>
      <div
        className="transition-opacity duration-200 ease-out data-pending:opacity-60"
        data-pending={isPending ? '' : undefined}
      >
        {children}
      </div>
    </Boundary>
  );
}
