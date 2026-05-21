import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
    instantInsights: {
      validationLevel: 'warning',
    },
    instantNavigationDevToolsToggle: true,
    optimisticRouting: true,
    prefetchInlining: true,
    useOffline: true,
    varyParams: true,
  },
  typedRoutes: true,
};

export default nextConfig;
