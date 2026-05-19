import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { MobileTabBar } from '@/components/mobile-nav';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { TrendingTags, TrendingTagsSkeleton } from '@/features/tag/components/trending-tags';
import { WhoToFollow, WhoToFollowSkeleton } from '@/features/user/components/who-to-follow';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  description: 'A dev-flavored social network.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
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
      <body className="flex h-screen flex-col overflow-hidden overscroll-y-none bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 sm:grid-cols-[17.5rem_minmax(0,1fr)] lg:grid-cols-[17.5rem_minmax(0,38rem)_20rem]">
            <Sidebar />
            <main className="sm:border-divider/70 dark:sm:border-divider-dark/70 min-h-0 min-w-0 overflow-y-auto overscroll-y-contain pb-[calc(4rem+env(safe-area-inset-bottom))] sm:border-x sm:pb-0">
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
          <Toaster theme="system" position="bottom-center" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
