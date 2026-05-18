<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo conventions

- Server-only data access lives in `src/data/queries/*.ts` (read) and `src/data/actions/*.ts` (mutations). Never import from `src/data/*` in a Client Component.
- Server queries use `'use cache'` with `cacheTag()` so actions can invalidate them via `updateTag()`.
- Wrap every server query in `cache()` from `react` so dedupe works across the same render.
- Plain in-memory store lives in `src/lib/data.ts`. It's intentionally small and serves as the "database" for the demo.
- UI primitives live in `src/components/ui/*` (shadcn-style, Base UI underneath). Leaf and feature components live in `src/components/*`. No CSS files outside `globals.css`.
- Cache Components are on. Pages must wrap dynamic reads in `<Suspense>` or wrap the data fn in `'use cache'`.
- The demo uses `delay()` from `src/lib/utils.ts` on every server read/write to make streaming visible on a projector. Don't remove it.
