# Next 16 Social Media "Drop"

Drop is a dev-flavored social network that demonstrates [instant navigations](https://preview.nextjs.org/docs/app/guides/instant-navigation) in the [Next.js 16 preview](https://nextjs.org/blog/next-16-3-instant-navigations). It is built on the App Router with React 19, Tailwind CSS v4, and Prisma 7 on Neon Postgres, and it highlights code snippets on the server with Shiki.

Every architectural decision follows the [Next.js App Architecture](.agents/skills/nextjs-app-architecture/SKILL.md) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'`, name the data with `cacheTag`, and tune its lifetime with `cacheLife`. Server Functions invalidate both the server and browser caches with `updateTag`, and per-user reads use `'use cache: private'`.
- **[Partial Prefetching](https://preview.nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches the shared App Shell of every link that enters the viewport. Pages opt into prefetching their per-request data by exporting `prefetch = 'allow-runtime'`.
- **Hover-intent prefetching** defers the runtime prefetch of low-intent links, such as the trending tags, until the pointer or focus reaches them, so that a page full of links does not wake a server for each one on render.
- **Active navigation links** read the current path inside a Suspense boundary so that the top of the tree stays prerenderable on dynamic routes, and an inline script sets `aria-current` before paint to avoid a hydration flash. This pattern is explained in [Building an Active NavLink Component in Next.js](https://aurorascharff.no/posts/building-an-active-navlink-component-in-nextjs/).
- **View Transitions** animate the tab underline as a shared element, transition individual rows as the lists change, and cross-fade content as it is revealed from Suspense.

## Getting started

Drop runs on Postgres, so set `DATABASE_URL` in `.env.local` and then run the following commands.

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) and its `instant()` API to assert that loading states appear and that navigations stay instant. Run them with `pnpm test:e2e`.
