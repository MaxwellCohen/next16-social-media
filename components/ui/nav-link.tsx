'use client';

import Link, { useLinkStatus } from 'next/link';
import { Suspense } from 'react';
import { useClientPathname } from '@/hooks/use-client-pathname';
import type { Route } from 'next';

type ActiveProps = { isActive: boolean };
type RenderProps = ActiveProps & { isPending: boolean };

type Props<T extends string = string> = {
  href: Route<T> | URL;
  className: string | ((props: ActiveProps) => string);
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode);
  exact?: boolean;
  fallback?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;

function checkActive(pathname: string | null, href: string, exact: boolean): boolean {
  if (pathname === null) return false;
  if (exact || href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolve<T, P>(value: T | ((props: P) => T), props: P): T {
  return typeof value === 'function' ? (value as (props: P) => T)(props) : value;
}

// `<Link>` with active-state detection. `className` and `children` can be
// render props that receive `{ isActive, isPending }`. The outer Suspense
// satisfies cache-components's missing-Suspense-with-CSR-bailout for
// `usePathname` on dynamic-param routes.
export function NavLink<T extends string>({ href, className, children, exact = false, fallback, ...rest }: Props<T>) {
  const inactive: ActiveProps = { isActive: false };
  return (
    <Suspense
      fallback={
        fallback ?? (
          <Link href={href as Route} className={resolve(className, inactive)} {...rest}>
            {resolve(children, { ...inactive, isPending: false })}
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
  // `useClientPathname` returns null on the server / first client render so
  // the prerendered HTML matches across rewrites (e.g. `/` → `/noprefetch/`).
  const pathname = useClientPathname();
  const isActive = checkActive(pathname, href.toString(), exact);

  return (
    <Link
      href={href as Route}
      aria-current={isActive ? 'page' : undefined}
      className={resolve(className, { isActive })}
      {...rest}
    >
      <NavLinkContent isActive={isActive}>{children}</NavLinkContent>
    </Link>
  );
}

function NavLinkContent({ isActive, children }: { isActive: boolean; children: Props['children'] }) {
  const { pending } = useLinkStatus();
  return <>{resolve(children, { isActive, isPending: pending })}</>;
}

export function NavLinkSkeleton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden className={`text-gray opacity-50 ${className ?? ''}`}>
      {children}
    </span>
  );
}
