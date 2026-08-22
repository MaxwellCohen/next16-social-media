import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    useOffline: true,
    viewTransition: true,
  },
  headers: async () => [
    {
      headers: [
        {
          key: 'Content-Type',
          value: 'application/speculationrules+json',
        },
      ],
      source: '/speculationrules.json',
    },
  ],
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
