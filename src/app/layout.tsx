import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { MobileHeader, MobileTabBar } from '@/components/MobileNav';
import { Sidebar } from '@/components/Sidebar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { TrendingTags, TrendingTagsSkeleton } from '@/features/tag/components/TrendingTags';
import { WhoToFollow, WhoToFollowSkeleton } from '@/features/user/components/WhoToFollow';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  description: 'A dev-flavored social network.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  openGraph: {
    description: 'A dev-flavored social network.',
    siteName: 'Drop',
    title: 'Drop',
    type: 'website',
  },
  title: {
    default: 'Drop',
    template: '%s · Drop',
  },
  twitter: {
    card: 'summary_large_image',
    description: 'A dev-flavored social network.',
    title: 'Drop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="h-screen overflow-hidden overscroll-y-none bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <MobileHeader />
          <div className="mx-auto grid h-full max-w-7xl grid-cols-1 sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,38rem)_20rem]">
            <Sidebar />
            <main className="sm:border-divider/70 dark:sm:border-divider-dark/70 h-full min-w-0 overflow-y-auto overscroll-y-contain pb-14 sm:border-x sm:pb-0">
              {children}
            </main>
            <aside className="hidden h-full flex-col gap-4 overflow-hidden overscroll-y-none px-4 py-5 lg:flex">
              <Suspense fallback={<TrendingTagsSkeleton />}>
                <TrendingTags />
              </Suspense>
              <Suspense fallback={<WhoToFollowSkeleton />}>
                <WhoToFollow />
              </Suspense>
            </aside>
          </div>
          <MobileTabBar />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
