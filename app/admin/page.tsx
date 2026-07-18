import { ActivityFeed } from '@/features/admin/components/activity-feed';
import { DropsChart } from '@/features/admin/components/drops-chart';
import { DropsPerMinute, StatTiles } from '@/features/admin/components/pulse-tiles';
import { TrendingBars } from '@/features/admin/components/trending-bars';
import type { Metadata } from 'next';

export const prefetch = 'allow-runtime';

export const metadata: Metadata = {
  title: 'Admin dashboard',
};

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <StatTiles />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DropsChart />
        </div>
        <DropsPerMinute />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TrendingBars />
        <ActivityFeed limit={6} />
      </div>
    </div>
  );
}
