'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import type { Route } from 'next';

export function SearchInput() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the input from the URL on mount and on back/forward navigation, but
  // never clobber a value the user typed during/before hydration.
  useEffect(() => {
    const sync = () => {
      const el = inputRef.current;
      if (!el) return;
      const q = new URLSearchParams(window.location.search).get('q') ?? '';
      if (el.value === '' && q !== '') el.value = q;
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

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
        aria-label="Search drops"
        placeholder="Search drops…"
        defaultValue=""
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
