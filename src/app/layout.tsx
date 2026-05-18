import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader, MobileTabBar } from "@/components/mobile-nav";
import { TrendingTags, TrendingTagsSkeleton } from "@/components/trending-tags";
import { WhoToFollow, WhoToFollowSkeleton } from "@/components/who-to-follow";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drop",
  description: "A dev-flavored social network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className="min-h-screen bg-white text-black antialiased dark:bg-black dark:text-white">
        <Suspense>
          <MobileHeader />
        </Suspense>
        <div className="mx-auto grid min-h-screen grid-cols-1 sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,38rem)_20rem] xl:max-w-7xl">
          <Suspense>
            <Sidebar />
          </Suspense>
          <main className="pb-14 sm:border-x sm:border-divider/70 sm:pb-0 dark:sm:border-divider-dark/70">
            {children}
          </main>
          <aside className="sticky top-0 hidden h-screen flex-col gap-4 overflow-y-auto px-4 py-5 lg:flex">
            <Suspense fallback={<TrendingTagsSkeleton />}>
              <TrendingTags />
            </Suspense>
            <Suspense fallback={<WhoToFollowSkeleton />}>
              <WhoToFollow />
            </Suspense>
          </aside>
        </div>
        <MobileTabBar />
      </body>
    </html>
  );
}
