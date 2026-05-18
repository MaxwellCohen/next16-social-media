import { cn, formatCount } from '@/lib/utils';

type Props = {
  label: string;
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
  activeColor?: string;
  hoverColor?: string;
  onClick?: () => void;
};

export function ActionButton({ label, icon, count, active, activeColor, hoverColor, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1.5 font-mono text-xs transition-colors',
        active && activeColor,
        hoverColor,
      )}
    >
      {icon}
      {typeof count === 'number' ? <span>{formatCount(count)}</span> : null}
    </button>
  );
}
