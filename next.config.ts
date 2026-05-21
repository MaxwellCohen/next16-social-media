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
    viewTransition: true,
  },
  async rewrites() {
    return {
      afterFiles: [
        // When the cookie is set, serve the no-prefetch variant
        {
          destination: '/noprefetch/:path*',
          has: [{ key: 'no-prefetch', type: 'cookie' }],
          source: '/:path*',
        },
      ],
      beforeFiles: [
        // Hide the internal noprefetch routes from direct access
        {
          destination: '/not-found',
          source: '/noprefetch/:path*',
        },
      ],
      fallback: [],
    };
  },
  typedRoutes: true,
};

export default nextConfig;
