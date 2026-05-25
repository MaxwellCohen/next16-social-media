# Next 16 Social Media "Drop"

A dev-flavored social network demo exploring Async React, Cache Components, and streaming with Next.js 16, React 19, Tailwind CSS, Prisma, and Shiki.

Built with Next.js 16, React 19, Tailwind CSS v4, Prisma 7 on Neon Postgres, and Shiki for server-side syntax highlighting.

The architecture follows the [Next.js App Architecture](.agents/skills/nextjs-app-architecture/SKILL.md) skill — a step-by-step guide for building dynamic App Router applications with Cache Components, Suspense streaming, and feature-sliced design.

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
components/
  ui/                   Visual primitives (Section, Crossfade, PageHeader, etc.)
features/
  drop/                 Queries, actions, and components for drops
  user/                 Queries, actions, and components for users
  tag/                  Queries and components for tags
types/                  Shared types
lib/                    Prisma client, utilities
tests/                  Playwright E2E tests
```

- **components/ui** — Visual primitives with no domain logic
- **features/** — Feature-sliced modules; each has queries, actions, and components

### Page Composition

Pages and layouts define loading states. Feature components own their data fetching and presentation. Skeletons are co-located with their feature components and exported alongside them.

```tsx
// app/bookmarks/page.tsx
<PageHeader title="Bookmarks" />
<Suspense fallback={<DropListSkeleton />}>
  <Crossfade>
    <BookmarksFeed />
  </Crossfade>
</Suspense>
```

## Key Patterns

**Cache Components:** Uses `cacheComponents: true` to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render.

## Development Flow

- **Fetching data** — Queries in feature `*-queries.ts` files, wrapped with `'use cache'` + `cacheTag`. Await in Server Components directly.
- **Mutating data** — Server Actions in feature `*-actions.ts` files with `"use server"`. Invalidate with `updateTag()`. Use `useOptimistic` for instant feedback.
- **Caching** — Add `"use cache"` with `cacheTag()` and `cacheLife()` to pages, components, or functions to include them in the static shell. Use `'use cache: private'` for per-user queries that read cookies.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s.

## E2E Tests

Uses `@next/playwright` with the `instant()` API to lock in loading states:

```bash
pnpm build
pnpm test:e2e
```

Inside `instant()`, only the prefetched shell renders — Suspense fallbacks are visible, dynamic content is deferred. After `instant()` exits, dynamic content streams in. Tests are per-page in `tests/`.

## Database

Uses Prisma with PostgreSQL (Vercel Neon).

```bash
pnpm run prisma.push     # Push schema to DB
pnpm run prisma.seed     # Seed with sample data
pnpm run prisma.studio   # Open Prisma Studio
```

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`.

## Deployment

```bash
pnpm run build
```

See the [Next.js deployment docs](https://nextjs.org/docs/deployment) for more details.
