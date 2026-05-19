'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type CommonProps = {
  href: Route;
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNavLink({ href, icon, label, children }: CommonProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={cn(
        'flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight transition-colors lg:justify-start lg:px-3',
        active ? 'bg-accent/10 text-accent dark:bg-accent/15 dark:text-blue-400' : 'hover:bg-card dark:hover:bg-card-dark',
      )}
    >
      {icon}
      <span className="hidden lg:inline">{children ?? label}</span>
    </Link>
  );
}

export function MobileTabLink({ href, icon, label }: CommonProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={cn(
        'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
        active ? 'text-accent' : 'text-gray hover:text-black dark:hover:text-white',
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function SidebarNavLinkSkeleton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="text-gray flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight opacity-50 lg:justify-start lg:px-3">
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </span>
  );
}
