# Next 16 Social Media

A dev-flavored social network exploring Cache Components, streaming, runtime prefetch, and async coordination with Next.js 16, React 19, Tailwind CSS v4, and Shiki.

Built as the demo app for the React Summit Amsterdam keynote: _What you can do with React Server Components in Next.js today_.

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/                  # Routes
  components/
    brand/              # Drop wordmark + droplet icon
    ui/                 # Small primitives (Button, Avatar, Skeleton, …)
    drop.tsx            # Feature components (Drop, Sidebar, Feed, …)
  data/
    actions/            # Server Actions
    queries/            # Server reads with `use cache` + `cacheTag`
  lib/
    data.ts             # In-memory seed store
    syntax.ts           # Shiki singleton + helpers
    utils.ts            # cn, delay, timeAgo, formatCount
```

- **components/ui** — small primitives used across the app. No design-system dependency.
- **components/brand** — the Drop droplet logo (`DropMark`) and wordmark.
- **components/drop\*.tsx** — feature components composed from the primitives.

Every route folder owns its layouts, skeletons, and metadata. Shared components live at the nearest level in the hierarchy.

**Naming:** kebab-case files, PascalCase exports, camelCase hooks and helpers.

## Key Patterns

**Cache Components:** `cacheComponents: true` in `next.config.ts`. Pages stay non-async; dynamic reads either wrap in `<Suspense>` or live behind a `'use cache'` function.

**Async React:** instead of manual `isLoading`/`isError`, the demo uses React 19 primitives: `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries.

**One model for caching:** `'use cache'` for shared data, `'use cache: private'` for per-user data. Server actions invalidate with `updateTag()` and the browser cache flushes automatically.

**Streaming on a projector:** every server read and write goes through `delay()` from `src/lib/utils.ts` so the network tab makes the streaming model visible. Don't remove the delays.

**Syntax highlighting:** Shiki runs on the server with the JavaScript engine and emits HTML once per code block. No client-side highlighter, no client JS for code.

## Development Flow

- **Fetching data** — Queries in `src/data/queries/`, wrapped with `'use cache'` + `cacheTag`. Await directly in Server Components.
- **Mutating data** — Server Actions in `src/data/actions/` with `'use server'`. Invalidate with `updateTag()`. Use `useOptimistic` in the leaf client component for instant feedback.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s.

## What's Enabled

```ts
// next.config.ts
cacheComponents: true;
typedRoutes: true;
experimental.instantInsights.validationLevel: 'warning';
experimental.useOffline: true;
experimental.varyParams: true;
experimental.prefetchInlining: true;
experimental.optimisticRouting: true;
experimental.cachedNavigations: true;
```

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`.

## Deployment

```bash
pnpm run build
```

See the [Next.js deployment docs](https://nextjs.org/docs/deployment) for more details.
