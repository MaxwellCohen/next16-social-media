'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { usePrefetchDefault } from '@/components/demo/prefetch-provider';
import type { Route } from 'next';

type Props<T extends string = string> = Omit<React.ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: Route<T> | URL;
};

// A `<Link>` that defers its runtime prefetch until the user shows intent.
// Until hover/focus it sits at the App Shell (`prefetch={null}`); intent upgrades
// it to a full runtime prefetch so the click lands on warm content. Use for
// low-intent list links (tags) so N of them don't each wake a server on render.
export function HoverPrefetchLink<T extends string>(props: Props<T>) {
  return (
    <Suspense fallback={<HoverLink {...props} enabled={false} />}>
      <ResolvedHoverLink {...props} />
    </Suspense>
  );
}

function ResolvedHoverLink<T extends string>(props: Props<T>) {
  return <HoverLink {...props} enabled={usePrefetchDefault() === true} />;
}

function HoverLink<T extends string>({ href, enabled, onMouseEnter, onFocus, ...props }: Props<T> & { enabled: boolean }) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      href={href as Route}
      prefetch={enabled && intent ? true : null}
      onMouseEnter={e => {
        setIntent(true);
        onMouseEnter?.(e);
      }}
      onFocus={e => {
        setIntent(true);
        onFocus?.(e);
      }}
    />
  );
}
