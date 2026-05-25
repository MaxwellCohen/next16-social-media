---
name: nextjs-app-architecture
description: Architecture patterns for building Next.js 16 App Router applications with React Server Components, Cache Components, Suspense streaming, and feature-sliced design. Use this skill whenever building a new Next.js app, scaffolding pages, designing loading states, structuring feature folders, setting up data fetching with caching, creating client/server component boundaries, implementing view transitions, or organizing any content-driven application. Also use when the user asks about RSC composition, Suspense boundaries, skeleton placement, CLS prevention, cache invalidation, or how to structure a Next.js project. Even if the user doesn't mention architecture explicitly, use this skill whenever they're building or modifying a Next.js App Router app to ensure the right patterns are followed from the start.
---

# Next.js App Architecture

A step-by-step guide for building dynamic Next.js 16 App Router applications — the kind where every route is server-rendered with streaming, prefetched at runtime, and feels like a single-page app. This is NOT a guide for static sites or fully cached pages — people already know how to do that. This is for apps where most content is dynamic, data changes frequently, and loading states matter.

All pages export `unstable_prefetch = 'force-runtime'` so the server runs the page on prefetch and streams real data into the prefetch cache. This gives instant navigations backed by fresh content.

Follow these steps in order — each builds on the previous one.

## Overview

1. **Project Structure** — Set up feature-sliced folders separating queries, actions, and components per domain
2. **Data Layer** — Build server-only queries with `'use cache'` and server actions with `updateTag` invalidation
3. **Feature Components** — Create self-contained async components that own their data fetching and export their own skeletons
4. **Client Boundaries** — Push `'use client'` as deep as possible, group related interactive pieces, keep most components as server components
5. **Page Composition** — Compose pages from feature components with Suspense boundaries, design skeleton placement to prevent CLS
6. **Client-Side State** (if needed) — Add global providers with `useReducer` for shared state like audio players or carts
7. **Navigation** — Set up NavLink with inline scripts, search without `useSearchParams`
8. **View Transitions** — Add shared element morphing, list identity animations, and persistent element exclusions as a final enhancement

## Cache Components

With [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enabled, Next.js uses [Partial Prerendering (PPR)](https://nextjs.org/docs/app/getting-started/caching#how-rendering-works): it builds a static shell at build time and streams dynamic content at request time.

This changes how rendering works:

- **Static shell**: synchronous content, `'use cache'` components, and Suspense fallbacks are prerendered into HTML at build time
- **Dynamic holes**: async components that access uncached data (database queries, cookies, headers) stream in at request time behind `<Suspense>` boundaries
- **The key constraint**: any component that does async work without `'use cache'` **must** be wrapped in `<Suspense>`, or you get an ["Uncached data was accessed outside of \<Suspense\>"](https://nextjs.org/docs/messages/blocking-route) error during dev and build
- Pages should stay synchronous — use `params.then()` instead of `await params` to avoid pulling the entire page out of the static shell

The architecture in this skill is designed around this model: feature components fetch their own data, pages wrap them in Suspense, and the static shell renders instantly while dynamic content streams in. For the full mental model, see the [Streaming](https://nextjs.org/docs/app/guides/streaming) guide.

## Step 1: Set Up the Project Structure

```
app/                    Pages and layouts (composition only)
components/
  ui/                   Visual primitives (Skeleton, Button, Crossfade, Spinner)
  scripts/              Inline pre-paint scripts
features/
  <domain>/
    <domain>-queries.ts  Server-only queries with 'use cache'
    <domain>-actions.ts  Server actions with 'use server'
    components/          Domain UI — self-contained, data-fetching components
    hooks/               Domain-specific client hooks (optional)
providers/              Global client-side context (optional, for apps needing shared state)
hooks/                  Shared client hooks
types/                  Domain types with toX() mappers from Prisma models
lib/                    Database client, cn() utility, formatters
```

Not every app needs every folder. `providers/` is only needed if you have global client state (audio player, shopping cart). Some apps have none.

Feature folders are the core organizational unit. Each domain (track, playlist, genre) owns its queries, actions, and components. Pages never contain domain logic — they compose [React Server Components](https://react.dev/reference/rsc/server-components) from feature folders with [Suspense](https://react.dev/reference/react/Suspense) boundaries.

## Step 2: Build the Data Layer

### Queries (`*-queries.ts`)

Mark with `import 'server-only'`. Use [`'use cache'`](https://nextjs.org/docs/app/api-reference/directives/use-cache) + [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag) + [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife). Wrap in [`cache()`](https://react.dev/reference/react/cache) for request deduplication. Add `delay()` for demo visibility of loading states.

Use `'use cache: private'` for queries that read per-user data (cookies, sessions) — this scopes the cache to the individual user.

```tsx
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';

// Per-user query (reads cookies → 'use cache: private')
export const getCurrentUserHandle = cache(async (): Promise<string> => {
  'use cache: private';
  const store = await cookies();
  return store.get('session')?.value ?? 'default';
});

// Shared query (same for all users → 'use cache')
export const getItems = cache(async (): Promise<Item[]> => {
  'use cache';
  cacheTag('items');
  cacheLife('seconds');
  await delay(700);
  const rows = await prisma.item.findMany();
  return rows.map(toItem);
});
```

### Actions (`*-actions.ts`)

Mark with [`'use server'`](https://react.dev/reference/rsc/use-server). Validate input with Zod at the boundary. Invalidate with [`updateTag()`](https://nextjs.org/docs/app/api-reference/functions/unstable_updateTag).

React 19 [form actions](https://react.dev/reference/react-dom/components/form#props) reset the form automatically after a successful server action — don't manually reset with `useRef` + `formRef.current?.reset()`.

```tsx
'use server';
export async function toggleFavorite(trackId: string) {
  const id = z.string().min(1).parse(trackId);
  await prisma.track.update({ data: { isFavorite: !track.isFavorite }, where: { id } });
  updateTag('favorites');
  updateTag(`track-${id}`);
}
```

### Types (`types/*.ts`)

Define clean domain types and a mapper from Prisma. Keep Prisma types out of components.

```tsx
export type Item = { id: string; title: string /* ... */ };
export function toItem(row: PrismaItem): Item {
  /* map fields */
}
```

## Step 3: Build Feature Components

Each feature component is a self-contained [async server component](https://react.dev/reference/rsc/server-components) — it fetches its own data, owns its skeleton, and can be composed from any page. Export the skeleton alongside the component.

```tsx
// features/track/components/most-played.tsx
export async function MostPlayed() {
  const tracks = await getRecentlyPlayed(8);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tracks.map(track => (
        <AlbumCard key={track.id} track={track} />
      ))}
    </div>
  );
}

export function MostPlayedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Skeleton design rules

Skeletons represent the shape of the real content. Getting them wrong causes CLS.

1. Match the exact layout — same flex direction, gaps, padding, responsive breakpoints as the real component
2. Responsive skeletons: if the real component uses `flex-col sm:flex-row`, the skeleton must too
3. Include all structural elements — avatar circles, action button placeholders, image squares
4. Use matching size classes — if the real image is `h-40 w-40 sm:h-48 sm:w-48`, the skeleton must be too
5. Don't include skeletons for inner Suspense content — that's handled by the component's own inner boundary
6. Skeleton components should be co-located with their real component and exported alongside it

## Step 4: Decide Client Boundaries

Push [`'use client'`](https://react.dev/reference/rsc/use-client) as deep as possible. Most components stay as server components. Only add `'use client'` when you need hooks, event handlers, or browser APIs. Keep server components focused on data fetching and pass interactive pieces as children to client wrappers.

### When to use `'use client'`

- Event handlers (`onClick`, `onChange`)
- React hooks ([`useState`](https://react.dev/reference/react/useState), [`useTransition`](https://react.dev/reference/react/useTransition), [`useOptimistic`](https://react.dev/reference/react/useOptimistic))
- Browser APIs (`AudioContext`, `window.location`)
- Context consumers (`useContext`)

### When NOT to use `'use client'`

- Pure markup, SVG icons
- Components that only receive and render props
- Components that use [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) (works in server components)

### Grouping client components

Group related small client components into one file when they're always used together and individually trivial:

```tsx
// track-interactions.tsx — 'use client'
// TrackPlayRow (click-to-play wrapper)
// TrackLink (navigable title with stopPropagation)
// FavoriteButton (heart toggle with useOptimistic)
```

A server component like `TrackRow` renders these as children without needing `'use client'` itself.

### Optimistic updates

Use [`useOptimistic`](https://react.dev/reference/react/useOptimistic) for instant UI feedback on mutations (like toggling a favorite). The optimistic state reverts automatically if the action fails. Name action props with the `Action` suffix to signal they run inside a [transition](https://react.dev/reference/react/useTransition#exposing-action-props-from-components). For a full walkthrough of optimistic UI, action props, `useActionState`, and `data-pending` patterns, see the [Interactive Apps](https://nextjs.org/docs/app/guides/interactive-apps) guide.

```tsx
const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite);

function handleToggle(e: React.MouseEvent) {
  e.stopPropagation();
  startTransition(async () => {
    setOptimisticFavorite(!optimisticFavorite);
    await toggleFavorite(trackId);
  });
}
```

## Step 5: Compose Pages with Suspense

Pages define the loading experience. They compose feature components with [Suspense](https://react.dev/reference/react/Suspense) boundaries. Pages never fetch data directly. Section headings belong in pages, not feature components — the same component might need different titles on different pages.

Every page exports `unstable_prefetch = 'force-runtime'` so navigations are backed by fresh server-rendered data. See the [Prefetching](https://nextjs.org/docs/app/guides/prefetching) guide for how runtime prefetching works.

### Skeleton placement rules

1. Show a skeleton only for the first section — content with a known, predictable height
2. Below the first section, use `<Suspense>` with no fallback — content streams in without reserving space
3. If the first section has variable height, group everything below it in the same Suspense to prevent CLS
4. Wrap Suspense content in `<Crossfade>` (a [`<ViewTransition>`](https://react.dev/reference/react/ViewTransition) wrapper) for smooth reveal animations

```tsx
export const unstable_prefetch = 'force-runtime';

export default function HomePage() {
  return (
    <div className="px-6 py-6 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold">Good evening</h1>
      <Suspense fallback={<QuickPlayGridSkeleton />}>
        <Crossfade>
          <QuickPlayGrid />
        </Crossfade>
      </Suspense>
      <Suspense>
        <Crossfade>
          <section className="mt-10">
            <h2 className="mb-4">Most Played</h2>
            <MostPlayed />
          </section>
        </Crossfade>
      </Suspense>
    </div>
  );
}
```

### Detail pages with variable-height content

Group the detail component and sections below it in one Suspense:

```tsx
<Suspense fallback={<PlaylistDetailSkeleton />}>
  <Crossfade>
    <PlaylistDetail id={id} />
    <section className="mt-10">
      <h2>Other Playlists</h2>
      <OtherPlaylists excludeId={id} />
    </section>
  </Crossfade>
</Suspense>
```

### Inner vs outer skeletons

Detail components can have their own inner Suspense for secondary content (e.g., "More from genre"). The page-level skeleton should NOT include the inner skeleton — it only represents what shows before the outer Suspense resolves.

### Async params and searchParams

Use `.then()` instead of `await` to keep pages synchronous:

```tsx
// Single param
{
  params.then(({ id }) => <Detail id={id} />);
}

// Single searchParam
{
  searchParams.then(sp => {
    const q = typeof sp.q === 'string' ? sp.q : '';
    return q ? <SearchResults query={q} /> : <EmptyState />;
  });
}

// Both params and searchParams
{
  Promise.all([params, searchParams]).then(([{ handle }, sp]) => (
    <ProfileFeed handle={handle} tab={parseTab(sp.tab)} />
  ));
}
```

### generateMetadata

`generateMetadata` can use `await params` — it runs before the page renders and doesn't affect the static shell:

```tsx
export async function generateMetadata({ params }: PageProps<'/item/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);
  return { title: item.title, description: item.body };
}
```

### Crossfade caveat

Crossfade on small frequently-revalidating elements (sidebar lists, form-triggered list updates) may cause a visible flash between old and new content. If you observe flashing, try removing the Crossfade wrapper from that specific boundary.

### Layout-level Suspense

Layouts can also compose feature components with Suspense — for sidebars, navigation, or persistent widgets. Wrap each in an error boundary so a failing sidebar widget doesn't break the whole page:

```tsx
// In layout.tsx
<Sidebar>
  <ErrorBoundary title="Tags unavailable" compact>
    <Suspense fallback={<TrendingTagsSkeleton />}>
      <Crossfade>
        <TrendingTags />
      </Crossfade>
    </Suspense>
  </ErrorBoundary>
</Sidebar>
```

### URL-based pagination

For paginated feeds, use `searchParams` to control the page number and render each page as a separate Suspense boundary. Only the first page renders without Suspense (it's the initial content); subsequent pages stream in:

```tsx
export async function Feed({ page = 1 }: { page?: number }) {
  return (
    <ul>
      {Array.from({ length: page }).map((_, i) => {
        const p = i + 1;
        return p === 1 ? (
          <FeedPage key={p} page={p} isLast={p === page} />
        ) : (
          <Suspense key={p} fallback={<ListSkeleton />}>
            <Crossfade>
              <FeedPage page={p} isLast={p === page} />
            </Crossfade>
          </Suspense>
        );
      })}
    </ul>
  );
}
```

The `LoadMore` button uses `router.push(nextPageUrl, { scroll: false })` inside a transition.

### Error boundaries

Use [`catchError`](https://nextjs.org/docs/app/api-reference/functions/unstable_catchError) from `next/error` for error boundaries instead of `react-error-boundary`. It handles `notFound()`, `redirect()`, and server data re-fetching correctly via `retry()` which re-fetches server component data.

```tsx
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error';

function ErrorFallback(props: { title?: string }, { unstable_retry: retry }: ErrorInfo) {
  return (
    <div>
      <p>{props.title ?? 'Something went wrong'}</p>
      <Button onClick={() => retry()}>Try again</Button>
    </div>
  );
}

export default catchError(ErrorFallback);
```

## Step 6: Add Client-Side State (If Needed)

If your app has global client state (audio player, shopping cart), add a provider in `providers/`. Many apps don't need this — if there's no shared client state beyond what the server provides, skip this step.

- Use [`useReducer`](https://react.dev/reference/react/useReducer) — state transitions are atomic and explicit
- Don't use `useCallback`/`useMemo` — the [React Compiler](https://react.dev/learn/react-compiler) handles memoization
- Keep refs for imperative handles (AudioContext, animation frames)
- Sync state to refs via `useEffect`, never during render

The provider must be `'use client'`, but its `children` remain server components. Place it in the root layout wrapping `{children}` — pages and feature components below it stay as server components. Only leaf client components call `useContext`.

```tsx
type PlayerAction =
  | { type: 'PLAY'; track: Track; queue: Track[] }
  | { type: 'PAUSE' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'ENDED' };

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, track: action.track, queue: action.queue, isPlaying: true, progress: 0 };
    case 'ENDED':
      return { ...state, isPlaying: false, progress: 0 };
    // ...
  }
}
```

## Step 7: Set Up Navigation

### Active NavLink without Suspense

[`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) triggers a Suspense boundary because it reads dynamic request data. Use `useClientPathname()` (via [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) reading `window.location.pathname`) instead to avoid this. Add an inline pre-paint script (`SeedNavLinksFromPathname`) that sets the correct active class using `data-navlink-*` attributes before the page paints. See [Preventing flash before hydration](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) for the general pattern of using inline scripts to update server-rendered HTML with client-specific values before the browser paints.

### Search input without Suspense

[`useSearchParams()`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) also requires a Suspense boundary. Instead:

- `SeedFromSearchParam` inline script to populate the input value from the URL before paint
- `useSyncInputToSearchParam` hook for soft navigation re-syncing
- [`useTransition`](https://react.dev/reference/react/useTransition) + `router.replace` for instant feedback with a spinner

## Step 8: Add View Transitions (Enhancement)

[View transitions](https://react.dev/reference/react/ViewTransition) are an enhancement layer — build everything else first. See the [Next.js View Transitions](https://nextjs.org/docs/app/guides/view-transitions) guide for framework-specific details.

### Persistent elements

Exclude layout-persistent elements from animations with CSS:

```css
::view-transition-group(sidebar),
::view-transition-group(mobile-nav),
::view-transition-group(player-bar),
::view-transition-group(theme-toggle) {
  animation: none;
  z-index: 100;
}
```

### Shared element morphing

Use matching `<ViewTransition name={unique-id} default="none">` on the same element in two views. Use the browser's default morph — don't add custom animation CSS unless needed.

```tsx
// Card view
<ViewTransition name={`track-art-${track.id}`} default="none">
  <AlbumArt size="sm" />
</ViewTransition>

// Detail view (same name → morphs)
<ViewTransition name={`track-art-${track.id}`} default="none">
  <AlbumArt size="lg" />
</ViewTransition>
```

### List identity

Wrap list items in `<ViewTransition key={id}>` for smooth removal animations. Wrap content below the list in `<ViewTransition>` too so it slides up when items are removed.
