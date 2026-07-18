import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DropMark } from '@/components/ui/drop-mark';
import ErrorBoundary from '@/components/ui/error-boundary';
import { TabsSkeleton } from '@/components/ui/tabs';
import { Presence } from '@/features/admin/components/presence';
import { SubNav } from '@/features/admin/components/sub-nav';
import { AdminProvider } from '@/features/admin/providers/admin-provider';
import type { Route } from 'next';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AdminProvider>
        <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-white/70 px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:px-6 dark:bg-black/70">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              aria-label="Drop home"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
            >
              <DropMark size={24} className="text-black dark:text-white" />
              <span>drop</span>
            </Link>
            <span className="text-gray">/</span>
            <Link
              href={'/admin' as Route}
              className="text-sm font-semibold tracking-tight text-black dark:text-white"
            >
              Admin dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Presence />
            <ThemeToggle variant="inline" />
          </div>
        </header>
        <ErrorBoundary title="Admin dashboard is offline">
          <div className="group/tabs mx-auto flex w-full max-w-6xl flex-1 flex-col">
            <Suspense fallback={<TabsSkeleton count={3} />}>
              <SubNav />
            </Suspense>
            <main className="flex-1 transition-opacity group-has-data-pending/tabs:opacity-50">{children}</main>
          </div>
        </ErrorBoundary>
      </AdminProvider>
    </div>
  );
}
