import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
};

const sizes: Record<'sm' | 'md', string> = {
  md: 'h-9 w-9',
  sm: 'h-7 w-7',
};

export function ToolbarButton({ label, onClick, children, size = 'md' }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'text-accent hover:bg-accent/10 flex items-center justify-center rounded-full transition-colors',
        sizes[size],
      )}
    >
      {children}
    </button>
  );
}
