'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useRef, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { SeedFromSearchParam } from '@/components/scripts/seed-from-search-param';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { search } from '@/features/search/search-actions';
import { useSyncSearchParamToInput } from '@/hooks/use-sync-search-param-to-input';
import type { Route } from 'next';

const inputClass =
  'bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none';

export function Search({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [isPending, startTransition] = useTransition();

  useSyncSearchParamToInput(inputRef, 'q');

  function navigate(value: string) {
    startTransition(() => {
      router.replace((value ? `/search?q=${encodeURIComponent(value)}` : '/search') as Route, {
        scroll: false,
      });
    });
  }

  return (
    <Boundary label="Search">
      <Section className="px-4 py-3 sm:px-5">
        <form className="flex items-center gap-2" action={search}>
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              name="q"
              aria-label="Search drops"
              placeholder="Search drops…"
              suppressHydrationWarning
              onChange={event => {
                navigate(event.target.value);
              }}
              className={inputClass}
            />
            <SeedFromSearchParam targetId={inputId} param="q" />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
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
