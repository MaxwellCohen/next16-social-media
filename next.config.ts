import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    default: {
      expire: 60 * 60,
      revalidate: 10,
      stale: 60,
    },
  },
  experimental: {
    appShells: true,
    cachedNavigations: true,
    useOffline: true,
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
