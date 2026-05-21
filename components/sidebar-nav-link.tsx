import { NavLink } from '@/components/ui/nav-link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Route } from 'next';

type CommonProps = {
  href: Route;
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
};

export function SidebarNavLink({ href, icon, label, children }: CommonProps) {
  return (
    <NavLink
      href={href}
      aria-label={label}
      className="hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight transition-colors lg:justify-start lg:px-3"
      activeClassName="bg-accent/10 text-accent dark:bg-accent/15 dark:text-blue-400"
    >
      {icon}
      <span className="hidden lg:inline">{children ?? label}</span>
    </NavLink>
  );
}

export function MobileTabLink({ href, icon, label }: CommonProps) {
  return (
    <NavLink
      href={href}
      aria-label={label}
      className="text-gray hover:text-black dark:hover:text-white flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors"
      activeClassName="text-accent"
    >
      {icon}
      <span>{label}</span>
    </NavLink>
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
