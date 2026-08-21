'use client';

import { useLayoutEffect, useRef, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import type { Route } from 'next';

export function PageAnchor({ page }: { page: number }) {
  const id = `page-${page}`;
  const ref = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    ref.current?.scrollIntoView();
  }, [id]);

  return <li ref={ref} id={id} className="h-px scroll-mt-32 p-0" aria-hidden />;
}

export function LoadMore({ href }: { href: Route }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Boundary label="LoadMore">
      <PrefetchLink
        href={href}
        onNavigate={() => {
          startTransition(() => {});
        }}
        aria-busy={isPending || undefined}
        className="border-divider dark:border-divider-dark rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 data-pending:opacity-50 dark:hover:bg-white/5"
        data-pending={isPending ? '' : undefined}
      >
        {isPending ? 'Loading…' : 'Load more'}
      </PrefetchLink>
    </Boundary>
  );
}
