# Next 16 Social Media "Drop"

A dev-flavored social network demo exploring Async React, Cache Components, and streaming with Next.js 16, React 19, Tailwind CSS v4, Prisma 7 on Neon Postgres, and Shiki for server-side syntax highlighting.

The architecture follows the [Next.js App Architecture](.agents/skills/nextjs-app-architecture/SKILL.md) skill.

## Key Patterns

- **Cache Components** — `cacheComponents: true` builds a static shell at build time; dynamic content streams in behind `<Suspense>` boundaries
- **Feature-sliced structure** — each domain (`drop/`, `user/`, `tag/`) owns its queries (`'use cache'`), actions (`'use server'`), and components
- **Pages are composition only** — they wrap feature components in Suspense, never fetch data directly
- **Optimistic UI** — `useOptimistic` + `startTransition` for instant feedback, `toast` for action results
- **Runtime prefetch** — all pages export `unstable_prefetch = 'force-runtime'` for instant navigations backed by fresh data

## Getting Started

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                    Pages and layouts
components/ui/          Visual primitives
features/
  drop/                 Queries, actions, and components for drops
  user/                 Queries, actions, and components for users
  tag/                  Queries and components for tags
  search/               Components for search
types/                  Shared types
lib/                    Prisma client, utilities
tests/                  Playwright E2E tests
```

## E2E Tests

Uses `@next/playwright` with the `instant()` API to assert loading states:

```bash
pnpm test:e2e
```

## Database

Uses Prisma with PostgreSQL (Neon).

```bash
pnpm run prisma.push     # Push schema to DB
pnpm run prisma.seed     # Seed with sample data
pnpm run prisma.studio   # Open Prisma Studio
pnpm run prisma.reset    # Reset and re-seed
```
