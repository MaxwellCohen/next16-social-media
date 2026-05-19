import { cn } from '@/lib/utils';

type Props = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function IconButton({ label, icon, active, activeColor, hoverColor, onClick, children }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={
        onClick
          ? e => {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors',
        active && activeColor,
        hoverColor ?? 'hover:bg-card dark:hover:bg-card-dark hover:text-black dark:hover:text-white',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
