'use client';

import { NavLink, NavLinkSkeleton } from './ui/nav-link';
import type { Route } from 'next';

type CommonProps = {
  href: Route;
  icon: React.ReactNode;
  label: string;
};

const sidebarLinkBase =
  'flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight transition-colors lg:justify-start lg:px-3';

const mobileTabBase = 'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors';

export function SidebarNavLink({ href, icon, label }: CommonProps) {
  return (
    <NavLink
      href={href}
      aria-label={label}
      className={({ isActive, isPending }) =>
        `${sidebarLinkBase} ${
          isPending
            ? 'animate-pending'
            : isActive
              ? 'bg-accent/10 text-accent dark:bg-accent/15 font-bold dark:text-blue-400 [&_svg]:stroke-[2.5]'
              : 'hover:bg-card dark:hover:bg-card-dark'
        }`
      }
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </NavLink>
  );
}

export function MobileTabLink({ href, icon, label }: CommonProps) {
  return (
    <NavLink
      href={href}
      aria-label={label}
      className={({ isActive }) =>
        `${mobileTabBase} ${
          isActive
            ? 'text-accent font-bold [&_svg]:stroke-[2.5]'
            : 'text-gray font-medium hover:text-black dark:hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export function SidebarNavLinkSkeleton({ icon, label }: Omit<CommonProps, 'href' | 'fallback'>) {
  return (
    <NavLinkSkeleton className={sidebarLinkBase}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </NavLinkSkeleton>
  );
}

export function MobileTabLinkSkeleton({ icon, label }: Omit<CommonProps, 'href' | 'fallback'>) {
  return (
    <NavLinkSkeleton className={`${mobileTabBase} font-medium`}>
      {icon}
      <span>{label}</span>
    </NavLinkSkeleton>
  );
}
