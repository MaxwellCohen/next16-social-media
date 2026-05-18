import { cn } from '@/lib/utils';

type Props = {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  lg: 'h-14 w-14 text-lg',
  md: 'h-10 w-10 text-sm',
  sm: 'h-8 w-8 text-xs',
} as const;

export function Avatar({ name, color, size = 'md', className }: Props) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white uppercase shadow-sm',
        color,
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
