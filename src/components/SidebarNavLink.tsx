'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type CommonProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const sidebarBase = 'flex items-center gap-4 rounded-lg px-3 py-2.5 text-base tracking-tight transition-colors';
const sidebarInactive = 'hover:bg-card dark:hover:bg-card-dark';
const sidebarActive = 'bg-accent/10 text-accent dark:bg-accent/15';

const mobileBase = 'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors';
const mobileInactive = 'text-gray hover:text-black dark:hover:text-white';
const mobileActive = 'text-accent';

export function SidebarNavLink({ href, icon, label, children }: CommonProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href as never}
      aria-current={active ? 'page' : undefined}
      className={cn(sidebarBase, active ? sidebarActive : sidebarInactive)}
    >
      {icon}
      <span>{children ?? label}</span>
    </Link>
  );
}

export function SidebarNavLinkFallback({ href, icon, label, children }: CommonProps) {
  return (
    <Link href={href as never} className={cn(sidebarBase, sidebarInactive)}>
      {icon}
      <span>{children ?? label}</span>
    </Link>
  );
}

export function MobileTabLink({ href, icon, label }: CommonProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href as never}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={cn(mobileBase, active ? mobileActive : mobileInactive)}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function MobileTabLinkFallback({ href, icon, label }: CommonProps) {
  return (
    <Link href={href as never} aria-label={label} className={cn(mobileBase, mobileInactive)}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
