import { Suspense } from 'react';
import { MobileTabBar } from '@/components/mobile-nav';
import { Sidebar } from '@/components/sidebar';
import { Crossfade } from '@/components/ui/crossfade';
import ErrorBoundary from '@/components/ui/error-boundary';
import { NotificationsBadgeProvider } from '@/features/notifications/components/notifications-badge-provider';
import { TrendingTagsList, TrendingTagsListSkeleton, TrendingTagsShell } from '@/features/tag/components/trending-tags';
import { WhoToFollowList, WhoToFollowListSkeleton, WhoToFollowShell } from '@/features/user/components/who-to-follow';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsBadgeProvider>
      <AppGrid>
        <Sidebar />
        <MainColumn>{children}</MainColumn>
        <RightSidebar>
          <TrendingTagsShell>
            <ErrorBoundary title="Tags unavailable" compact>
              <Suspense fallback={<TrendingTagsListSkeleton />}>
                <Crossfade>
                  <TrendingTagsList />
                </Crossfade>
              </Suspense>
            </ErrorBoundary>
          </TrendingTagsShell>
          <WhoToFollowShell>
            <ErrorBoundary title="No suggestions" compact>
              <Suspense fallback={<WhoToFollowListSkeleton />}>
                <Crossfade>
                  <WhoToFollowList />
                </Crossfade>
              </Suspense>
            </ErrorBoundary>
          </WhoToFollowShell>
        </RightSidebar>
      </AppGrid>
      <MobileTabBar />
    </NotificationsBadgeProvider>
  );
}

function AppGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 sm:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,38rem)_20rem]">
      {children}
    </div>
  );
}

function MainColumn({ children }: { children: React.ReactNode }) {
  return (
    <main className="sm:border-divider/70 dark:sm:border-divider-dark/70 min-w-0 transition-opacity peer-has-data-pending:opacity-50 sm:border-x">
      {children}
    </main>
  );
}

function RightSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-4 overflow-y-auto overscroll-y-contain px-4 py-5 xl:flex">
      {children}
    </aside>
  );
}
