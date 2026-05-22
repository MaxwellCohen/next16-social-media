'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import type { Route } from 'next';

type RenderProps = { isActive: boolean; isPending: boolean };

type Props = {
  href: Route;
  className: string | ((props: RenderProps) => string);
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode);
  exact?: boolean;
} & Omit<React.ComponentProps<typeof Link>, 'className' | 'children'>;

function checkActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact || href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolve<T>(value: T | ((props: RenderProps) => T), props: RenderProps): T {
  return typeof value === 'function' ? (value as (props: RenderProps) => T)(props) : value;
}

/**
 * A Link with active-state detection that doesn't block prerendering.
 *
 * Accepts className and children as either a value or a render prop:
 *   className={({ isActive }) => isActive ? 'active' : ''}
 *   children={({ isActive }) => <>{isActive && <Dot />} Home</>}
 *
 * During prerendering, renders as a plain <Link> with isActive=false.
 * After hydration, usePathname() resolves and the active state applies.
 */
export function NavLink({ href, className, children, exact = false, ...rest }: Props) {
  const inactive: RenderProps = { isActive: false, isPending: false };
  return (
    <Suspense
      fallback={
        <Link href={href} className={resolve(className, inactive)} {...rest}>
          {resolve(children, inactive)}
        </Link>
      }
    >
      <NavLinkInner href={href} className={className} exact={exact} {...rest}>
        {children}
      </NavLinkInner>
    </Suspense>
  );
}

function NavLinkInner({ href, className, children, exact = false, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isActive = checkActive(pathname, href, exact);
  const props: RenderProps = { isActive, isPending };

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={resolve(className, props)}
      onClick={e => {
        e.preventDefault();
        startTransition(() => {
          router.push(href);
        });
      }}
      {...rest}
    >
      {resolve(children, props)}
    </Link>
  );
}
