'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Props = {
  href: Route;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  exact?: boolean;
} & Omit<React.ComponentProps<typeof Link>, 'className'>;

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact || href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * A Link that adds active styling without blocking prerendering.
 *
 * Renders the <Link> immediately (clickable from the static shell).
 * The active class applies after hydration — no Suspense fallback visible
 * because the link itself IS the fallback.
 */
export function NavLink({ href, className, activeClassName, children, exact = false, ...rest }: Props) {
  return (
    <Suspense
      fallback={
        <Link href={href} className={className} {...rest}>
          {children}
        </Link>
      }
    >
      <NavLinkInner href={href} className={className} activeClassName={activeClassName} exact={exact} {...rest}>
        {children}
      </NavLinkInner>
    </Suspense>
  );
}

function NavLinkInner({ href, className, activeClassName, children, exact = false, ...rest }: Props) {
  const pathname = usePathname();
  const active = isActive(pathname, href, exact);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(className, active && activeClassName)}
      {...rest}
    >
      {children}
    </Link>
  );
}
