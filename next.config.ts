import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheMaxMemorySize: 0, // Set this to 0 for debugging to disable the cache memory limit
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
