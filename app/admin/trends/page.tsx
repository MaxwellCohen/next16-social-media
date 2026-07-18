import { TopDrops } from '@/features/admin/components/top-drops';
import { TrendingBars } from '@/features/admin/components/trending-bars';
import type { Metadata } from 'next';

export const prefetch = 'allow-runtime';

export const metadata: Metadata = {
  title: 'Trends · Admin dashboard',
};

export default function TrendsPage() {
  return (
    <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2">
      <TrendingBars />
      <TopDrops />
    </div>
  );
}
