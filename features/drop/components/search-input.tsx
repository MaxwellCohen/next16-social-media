'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useRef, useTransition } from 'react';
import type { Route } from 'next';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const q = searchParams.get('q') ?? '';

  // Reset input when URL changes externally (Activity restore, back nav).
  useLayoutEffect(() => {
    if (inputRef.current && inputRef.current.value !== q) {
      inputRef.current.value = q;
    }
  }, [q]);

  return (
    <div className="relative">
      {isPending ? (
        <div className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
      ) : (
        <Search className="text-gray pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder="Search drops…"
        defaultValue={q}
        onChange={e => {
          const value = e.target.value;
          startTransition(() => {
            router.replace(value ? (`/search?q=${encodeURIComponent(value)}` as Route) : '/search');
          });
        }}
        className="bg-card dark:bg-card-dark placeholder-gray w-full rounded-lg py-2.5 pr-3 pl-9 text-sm outline-none"
      />
    </div>
  );
}
