import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    appShells: true,
    cachedNavigations: true,
    inlineCss: true,
    useOffline: true,
    viewTransition: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
