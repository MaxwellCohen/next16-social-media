'use client';

import { usePathname } from 'next/navigation';
import { Tabs } from '@/components/ui/tabs';
import type { Route } from 'next';

const TABS: { label: string; value: string; href: Route }[] = [
  { href: '/admin' as Route, label: 'Overview', value: '/admin' },
  { href: '/admin/log' as Route, label: 'Activity log', value: '/admin/log' },
  { href: '/admin/trends' as Route, label: 'Trends', value: '/admin/trends' },
];

export function SubNav() {
  const pathname = usePathname();
  const active = TABS.some(tab => tab.value === pathname) ? pathname : '/admin';
  return <Tabs tabs={TABS} active={active} label="Admin dashboard views" indicatorName="admin-subnav-indicator" />;
}
