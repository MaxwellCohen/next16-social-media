<div align="center">

<img src="public/logo.svg" alt="Drop" width="72" height="72" />

# Next 16 Social Media "Drop"

A dev-flavored social network that demonstrates [Instant Navigations](https://preview.nextjs.org/docs/app/guides/instant-navigation) in the [Next.js 16 preview](https://nextjs.org/blog/next-16-3-instant-navigations).

</div>

---

Drop is built on the App Router with React 19, Tailwind CSS v4, and Prisma 7 on Neon Postgres, and it highlights code snippets on the server with Shiki. The architecture follows the [Next.js App Architecture](.agents/skills/nextjs-app-architecture/SKILL.md) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'`, name the data with `cacheTag`, and set its lifetime with `cacheLife`. Server Functions call `updateTag` to invalidate the server and browser caches, and per-user reads use [`'use cache: private'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache-private).
- **[Partial Prefetching](https://preview.nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches the shared App Shell of links as they enter the viewport, so the shell is ready before the click.
- **[Runtime prefetching](https://preview.nextjs.org/docs/app/guides/runtime-prefetching)** lets a page prefetch its per-request data by exporting [`prefetch = 'allow-runtime'`](https://preview.nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch), which resolves `params` and `searchParams` ahead of the navigation.
- **[Hover-triggered prefetch](https://preview.nextjs.org/docs/app/guides/prefetching#hover-triggered-prefetch)** holds back the runtime prefetch of low-intent links, such as the trending tags, until the pointer or focus reaches them, so that a long list does not wake a server for each link on render.
- **Active navigation links** read the current path inside a Suspense boundary so that the top of the tree stays prerenderable on dynamic routes, and an inline script sets `aria-current` before paint to avoid a hydration flash. The pattern is described in [Building an Active NavLink Component in Next.js](https://aurorascharff.no/posts/building-an-active-navlink-component-in-nextjs/).
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** animate the tab underline as a shared element, transition rows as the lists change, and cross-fade content as it streams in from Suspense.

## Getting started

Drop runs on Postgres, so set `DATABASE_URL` in `.env.local` and then run the following commands.

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Drop to run locally on SQLite instead of Postgres. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/prisma-client.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped. Remove the `mode: 'insensitive'` Prisma filter options since SQLite does not support them. Install `@prisma/adapter-better-sqlite3` and `better-sqlite3`, uninstall `@prisma/adapter-pg`, `pg`, and `@types/pg`. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with the [`instant()`](https://preview.nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) API to assert that loading states appear and that navigations stay instant. Run them with `pnpm test:e2e`.

## License

[MIT](LICENSE)
