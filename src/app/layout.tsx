import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
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
        <div className="3xl:max-w-5xl mx-auto grid min-h-screen grid-cols-1 sm:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,38rem)_18rem] xl:max-w-7xl">
          <Suspense>
            <Sidebar />
          </Suspense>
          <main className="border-divider dark:border-divider-dark border-r">
            {children}
          </main>
          <aside className="hidden flex-col gap-4 p-4 lg:flex">
            <RightRail />
          </aside>
        </div>
      </body>
    </html>
  );
}

import { TrendingTags, TrendingTagsSkeleton } from "@/components/trending-tags";
import { WhoToFollow, WhoToFollowSkeleton } from "@/components/who-to-follow";

function RightRail() {
  return (
    <>
      <Suspense fallback={<TrendingTagsSkeleton />}>
        <TrendingTags />
      </Suspense>
      <Suspense fallback={<WhoToFollowSkeleton />}>
        <WhoToFollow />
      </Suspense>
    </>
  );
}
