'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Route } from 'next';

type RenderProps = { isActive: boolean; isPending: boolean };

type Props<T extends string = string> = {
  href: Route<T> | URL;
  className: string | ((props: RenderProps) => string);
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode);
  exact?: boolean;
  fallback?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;

function checkActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact || href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolve<T>(value: T | ((props: RenderProps) => T), props: RenderProps): T {
  return typeof value === 'function' ? (value as (props: RenderProps) => T)(props) : value;
}

// `<Link>` with active-state detection. `className` and `children` can be
// render props that receive `{ isActive, isPending }`. The Suspense wrapper
// lets the link prerender as inactive without blocking the page; on hydration
// `usePathname()` resolves and the active state applies.
export function NavLink<T extends string>({ href, className, children, exact = false, fallback, ...rest }: Props<T>) {
  const inactive: RenderProps = { isActive: false, isPending: false };
  return (
    <Suspense
      fallback={
        fallback ?? (
          <Link href={href as Route} className={resolve(className, inactive)} {...rest}>
            {resolve(children, inactive)}
          </Link>
        )
      }
    >
      <NavLinkInner href={href} className={className} exact={exact} {...rest}>
        {children}
      </NavLinkInner>
    </Suspense>
  );
}

function NavLinkInner<T extends string>({ href, className, children, exact = false, ...rest }: Props<T>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const debouncedPending = useDebounce(isPending, 150);
  const isActive = checkActive(pathname, href.toString(), exact);
  const props: RenderProps = { isActive, isPending: debouncedPending };

  return (
    <Link
      href={href as Route}
      aria-current={isActive ? 'page' : undefined}
      className={resolve(className, props)}
      onClick={e => {
        e.preventDefault();
        startTransition(() => {
          router.push(href.toString() as Route);
        });
      }}
      {...rest}
    >
      {resolve(children, props)}
    </Link>
  );
}

export function NavLinkSkeleton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden className={`text-gray opacity-50 ${className ?? ''}`}>
      {children}
    </span>
  );
}
