import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
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
