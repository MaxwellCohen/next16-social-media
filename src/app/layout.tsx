import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { MobileHeader, MobileTabBar } from '@/components/mobile-nav';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { TrendingTags, TrendingTagsSkeleton } from '@/components/trending-tags';
import { WhoToFollow, WhoToFollowSkeleton } from '@/components/who-to-follow';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  description: 'A dev-flavored social network.',
  title: 'Drop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="h-screen overflow-hidden overscroll-none bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <Suspense>
            <MobileHeader />
          </Suspense>
          <div className="mx-auto grid h-full grid-cols-1 sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,38rem)_20rem] xl:max-w-7xl">
            <Suspense>
              <Sidebar />
            </Suspense>
            <main className="sm:border-divider/70 dark:sm:border-divider-dark/70 h-full overflow-y-auto overscroll-contain pb-14 sm:border-x sm:pb-0">
              {children}
            </main>
            <aside className="hidden h-full flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5 lg:flex">
              <Suspense fallback={<TrendingTagsSkeleton />}>
                <TrendingTags />
              </Suspense>
              <Suspense fallback={<WhoToFollowSkeleton />}>
                <WhoToFollow />
              </Suspense>
            </aside>
          </div>
          <Suspense>
            <MobileTabBar />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
