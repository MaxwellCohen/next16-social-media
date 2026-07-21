import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { DemoToolbar } from '@/components/demo/demo-toolbar';
import { BoundaryProvider } from '@/components/internal/boundary';
import { OfflineIndicator } from '@/components/offline-indicator';
import { NavLinkScript } from '@/components/scripts/nav-link-script';
import { ThemeProvider } from '@/components/theme/theme-provider';
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
    siteName: 'Drop',
    type: 'website',
  },
  title: {
    default: 'Drop',
    template: '%s · Drop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-[100dvh] flex-col bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <BoundaryProvider>
            <OfflineIndicator />
            {children}
            <div className="demo-toggles fixed top-4 right-4 z-50 hidden items-start gap-2 sm:flex lg:top-6 lg:right-6">
              <Suspense fallback={null}>
                <DemoToolbar />
              </Suspense>
            </div>
            <Toaster theme="system" position="bottom-right" toastOptions={{ style: { viewTransitionName: 'none' } }} />
            <NavLinkScript />
          </BoundaryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
