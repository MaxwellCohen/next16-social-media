# Next 16 Drop

A dev-flavored social network exploring Cache Components, streaming, and runtime prefetch with Next.js 16, React 19, Tailwind CSS v4, and Shiki.

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                      # Pages and layouts
components/
  navigation/             # Mobile nav + NavLink
  theme/                  # Theme provider and toggle
  ui/                     # Small primitives (Button, Avatar, CodeBlock, …)
data/
  actions/                # Server Actions
  queries/                # Data fetching with `'use cache'` + `cacheTag`
lib/                      # In-memory store, syntax, helpers
```

Every route folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for folders, camelCase for functions/hooks.

## Key Patterns

**Cache Components:** Uses `cacheComponents: true` to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell.

**One model for caching:** `'use cache'` for shared data, `'use cache: private'` for per-user data (bookmarks, likes, follow state). Server actions invalidate with `updateTag()`.

**Interactivity that flows with the server:** React 19 primitives (`useTransition`, `useOptimistic`, `useActionState`, `<Suspense>`, `use()`) are how the client stays in sync with cached server state — not a separate concern, just the coordination layer that makes optimistic UI, pending states, and streaming look like one cohesive thing.

**Syntax highlighting:** Shiki runs on the server with the JavaScript regex engine and emits highlighted HTML once per code block. No client highlighter, no client JS for code.

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `'use cache'` + `cacheTag`. Await in Server Components directly.
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `updateTag()`. Use `useOptimistic` for instant feedback.
- **Caching** — Add `"use cache"` with `cacheTag()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s.

## Data

In-memory store that reseeds on every server restart.

```bash
pnpm run seed       # POST /api/seed — reset between rehearsals
```

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`.

## Deployment

```bash
pnpm run build
```

See the [Next.js deployment docs](https://nextjs.org/docs/deployment) for more details.
