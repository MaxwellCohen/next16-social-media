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

export function SidebarNavLink({ href, icon, label, children }: CommonProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href as never}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        active ? 'bg-accent/10 text-accent dark:bg-accent/15' : 'hover:bg-card dark:hover:bg-card-dark',
      )}
    >
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
