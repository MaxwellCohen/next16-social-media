import { PrefetchLink } from '@/components/ui/prefetch-link';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Props = {
  label: string;
  icon: React.ReactNode;
  href?: Route;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  removing?: boolean;
  children?: React.ReactNode;
};

export function IconButton({
  label,
  icon,
  href,
  active,
  activeColor,
  hoverColor,
  type = 'button',
  onClick,
  removing,
  children,
}: Props) {
  const className = cn(
    'inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors',
    active && activeColor,
    hoverColor ?? 'hover:bg-card dark:hover:bg-card-dark hover:text-black dark:hover:text-white',
  );

  if (href) {
    return (
      <PrefetchLink
        href={href}
        aria-label={label}
        onClick={e => {
          e.stopPropagation();
        }}
        className={className}
      >
        {icon}
        {children}
      </PrefetchLink>
    );
  }

  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={active}
      data-removing={removing || undefined}
      onClick={
        onClick
          ? e => {
              e.stopPropagation();
              onClick(e);
            }
          : e => {
              e.stopPropagation();
            }
      }
      className={className}
    >
      {icon}
      {children}
    </button>
  );
}
