# Drop

A dev-flavored social network built for the React Summit Amsterdam keynote demo.

Stack: Next.js 16.3 (canary) with Cache Components, React 19, Tailwind v4, Base UI + shadcn.

See [docs/spec.md](./docs/spec.md) for the application specification.

## Run it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's enabled

```ts
// next.config.ts
cacheComponents: true
typedRoutes: true
experimental.instantInsights.validationLevel: "warning"
experimental.useOffline: true
experimental.varyParams: true
experimental.prefetchInlining: true
experimental.optimisticRouting: true
experimental.cachedNavigations: true
```

## Layout

```
src/
  app/                  routes
  components/
    ui/                 shadcn primitives (Base UI underneath)
    drop.tsx, etc.      feature components
  data/
    queries/            server reads (cached, tagged)
    actions/            server mutations (invalidate by tag)
  lib/
    data.ts             in-memory seed store
    utils.ts            cn, delay, timeAgo
```

## Conventions

- `'use cache'` on every server query, with `cacheTag()` so actions can invalidate.
- `cache()` from React wraps the query so dedupe works inside one render.
- `delay()` is on every server read and write. It's there so streaming is visible on a projector. Don't remove it.
- All client interactivity lives in leaf `'use client'` components. Pages stay server-rendered.
