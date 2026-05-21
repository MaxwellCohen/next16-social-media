import { cn } from '@/lib/utils';

export function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('border-divider/70 dark:border-divider-dark/70 border-b', className)}>{children}</section>
  );
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 text-sm font-semibold tracking-tight sm:px-5">
      {children}
    </h2>
  );
}
