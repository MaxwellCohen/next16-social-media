import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
    exposeTestingApiInProductionBuild: true,
    instantInsights: {
      validationLevel: 'warning',
    },
    instantNavigationDevToolsToggle: true,
    optimisticRouting: true,
    prefetchInlining: true,
    useOffline: true,
    varyParams: true,
    viewTransition: true,
  },
  typedRoutes: true,
};

export default nextConfig;
