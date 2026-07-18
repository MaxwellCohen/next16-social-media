import { ViewTransition } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Tile({ title, action, children, className }: Props) {
  return (
    <section
      className={cn(
        'border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 rounded-xl border',
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
        {action}
      </header>
      <ViewTransition update={{ 'admin-reveal': 'auto', default: 'none' }} default="none">
        {children}
      </ViewTransition>
    </section>
  );
}
