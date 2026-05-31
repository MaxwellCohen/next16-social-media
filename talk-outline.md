# What RSCs Can Do in Next.js Today

**Audience:** React devs who may have parked Next.js, tried App Router once and bounced, or default to "I'll build an SPA."

**Format:** Slides + live demo.

**Tone:** Calm, confident, demo-led. No framework comparisons.

---

## Presentation setup

- **Drop** (social media), [github.com/aurorascharff/next16-social-media](https://github.com/aurorascharff/next16-social-media)
- Slides for WHY, WHAT, 16.3, and Close
- Starter app for the live coding demo
- Finished Drop app for the prefetch/boundary/navigation demo at the end

---

## 1. WHY: the problem we keep solving by hand [SLIDES]

### Slide: Intro

- Aurora Scharff, Vercel, Next.js team
- React Summit Amsterdam keynote
- A lot of you have tried App Router, maybe reached for an SPA instead, maybe parked Next.js entirely. That's fair, the model has changed a lot. I'm here to show you what it can do today

### Slide: "Why do we love React?"

Let this breathe. Don't rush through it. The audience should nod along before you move on.

- Composable components. Lego blocks. You build a button, a card, a form, snap them together and they just work
- Each piece is self-contained. You can move it, reuse it, delete it. Nothing else breaks
- This is also why AI agents are so effective with React. Components have clear boundaries, clear inputs, clear outputs. An agent can reason about one component without understanding the whole app
- That composability is the thing we want to keep. Everything else should follow from it

*Visual: JSX blocks styled like a social media app: `<Header>`, `<Feed>`, `<Post>`, `<LikeButton>`, `<Avatar>`, `<Sidebar>`. Animate them snapping together in different arrangements using Keynote animations. The audience subconsciously recognizes the shape of a Twitter-like app without being told. The blocks rearrange, swap positions, compose into different layouts. The point is they're independent and interchangeable.*

### Slide: "People are already noticing"

- Show @codewithantonio tweet: *"a fun fact i've observed with projects i've built using agentic coding: they all naturally drift toward feature architecture and monorepos... agents seem to perform best when changes have a small blast radius (feature architecture) and clear boundaries"*
- People are restructuring their codebases to land on exactly this: self-contained components, feature folders, clear boundaries
- Composable components aren't just good for developers. They're good for agents, good for teams, good for scaling. And we have a foundation for extending this across the entire stack

### Slide: "The cascade"

But somewhere along the way, we lost that composability. Each step in the evolution solved a real problem but added a concept:

1. **useEffect + useState**: component-level fetching. Works for one component. Two components need the same data? Hoist state up. Three? Hoist higher. Mutations hoist highest. Suddenly your "self-contained" component depends on props drilled from three levels up. The loading sequence? Outsourced to the network. Things pop in randomly. Popcorn UI. The user sees a jigsaw puzzle assembling itself
2. **React Query / client cache**: genuinely better. Centralized cache, components fetch without prop drilling, mutations invalidate from anywhere. But still client-first. The user downloads your JavaScript, executes it, THEN starts fetching data. Every component still decides independently when it's ready. And now you have a second mental model, the cache, living alongside your component tree
3. **Route-level loaders**: data moves to the server. Fast first paint. But your components are welded to whatever the page chose to fetch. Need `<Feed>` on another page? Duplicate the fetch in that loader. The component lost its independence. And agents can't reason about a component without tracing back to its loader

Each solved a problem. Each added a concept. We kept the Lego blocks but lost the composability that made them powerful.

*Visual: three panels, or build up progressively. Each step adds a new layer/arrow/box around the original clean component tree. By step 3 the diagram is cluttered with arrows going in every direction: loaders, caches, state managers wrapping the components. The Lego blocks are still there but buried.*

### Slide: "What we actually want"

Pause here. Let the audience read the list and feel each point.

1. Instant feel: clicks update the UI now, not after a roundtrip
2. Fresh data, but not at the cost of (1)
3. Coordinated loading, not popcorn UI. The page decides what the user sees and when
4. Good SEO and Lighthouse, but still feels like an app, not a document
5. One codebase for the data layer, not a client cache, a server cache, and a coordination layer between them
6. Components that are truly self-contained. Move them between pages, hand them to an AI agent, refactor freely. No hidden coupling

*Visual: clean numbered list on a dark background. No diagrams. Let the text do the work. Maybe reveal one at a time.*

### Slide: "What it usually takes"

A client cache with its own mental model. A separate server rendering strategy. Manual cache keys and invalidation logic. A mutation API that coordinates between client and server. Skeletons in one place, loading flags in another. Wrapper components for data fetching, wrapper components for error handling, wrapper components for Suspense. And then an AI agent has to understand all of these layers to change one feature.

Dense on purpose. The audience should feel the weight of the pile.

*Visual: a wall of text or a stack of boxes piling up. Deliberately overwhelming. Every item is a separate box/label. The slide should feel heavy.*

### Slide: "The real pain"

The pain isn't that caching is hard. The pain is that every piece of data lives in a different system with different rules. Client state, server state, URL state, cache state. You spend more time coordinating where data lives than building features. The blast radius of any change is unpredictable: touch one thing, three systems need updating.

*Visual: a single sentence centered on screen. "The pain is coordinating where every piece of data lives." Let it sit.*

---

## 2. WHAT: what RSCs can do today [SLIDES]

### Slide: "The data is clear"

- Nadia Makarevich benchmarked the same app across CSR, SSR with loaders, and RSCs. The real performance gains land once you move data fetching to the server and add deliberate Suspense boundaries
- Client-side fetching means the user waits for JS to download and execute before any data request fires. Loaders move the fetch to the server but couple your components to the route. RSCs keep the fetch on the server AND keep components independent
- This isn't theoretical. The numbers show it

*Visual: screenshot of Nadia's benchmark results. Link: [developerway.com/posts/react-server-components-performance](https://www.developerway.com/posts/react-server-components-performance)*

### Slide: "The answer"

- Server Components solve this with one mental model: components, composition, Suspense
- Next.js is a Suspense-first framework. Every page streams. Async React means the framework coordinates loading for you, no weird loading states, no manual orchestration
- We extended React's composability to the server, to caching, to infrastructure. The same Lego blocks, but they work across the entire stack
- We follow React, and that means less work for you. No hydration strategy to manage, no custom streaming setup, no client-side data coordination. We just use React: async components, Suspense, composition. React handles the rendering and streaming out of the box. The framework handles the caching, the prefetching, the invalidation. We write components
- You don't have to abandon interactivity. This isn't "server-rendered pages" vs "client apps." You compose server and client pieces together. Client interactivity lives exactly where you need it, as leaf nodes in the same tree. The rest stays on the server
- The patterns are consistent: same tree, same boundaries, same composition. AI agents can work with your codebase the same way you do. No loader chains to trace, no cache coordination to understand

### Slide: "What this gives you"

Show simplified code alongside the points. Not the real app, just the shape.

**A component owns its data:**

```tsx
async function Feed() {
  const posts = await getFeed();
  return <ul>{posts.map(p => <Post post={p} />)}</ul>;
}
```

**A page just composes:**

```tsx
export default function HomePage() {
  return (
    <div>
      <FeedTabs />
      <DropComposer />
      <Feed />
    </div>
  );
}
```

**Server and client compose in the same tree:**

```tsx
async function Post({ post }) {
  const userState = await getPostUserState(post.id);
  return (
    <article>
      <PostBody body={post.body} />
      <PostActions userState={userState} />  {/* 'use client' */}
    </article>
  );
}
```

### Slide: "Cache Components (Next.js 16)"

- Caching in Next.js used to be confusing. Pages were either static or dynamic, decided at build time. Read a cookie? Dynamic. Check the user? Dynamic. The whole page flipped. Two mental models, easy to get wrong
- Next.js 16 changed the default: everything is dynamic. No implicit caching. You opt in explicitly with `'use cache'`
- The cache key is based on what happens inside the function, the arguments, the data it reads. You don't configure cache keys manually
- Remember those components from the last slide? Each one fetches its own data. Now each one can cache independently. You can put `'use cache'` on the query function, or on the component itself:

```tsx
// Cache the data: the query decides
async function getFeed(userId) {
  'use cache';
  cacheTag('feed', `feed-${userId}`);
  cacheLife('seconds');
}

// Cache the component: the whole rendered output is cached
async function TrendingTags() {
  'use cache';
  cacheTag('trending');
  cacheLife('minutes');

  const tags = await db.tag.findMany();
  return <ul>{tags.map(t => <li>#{t.name}</li>)}</ul>;
}
```

- Same page, different components, different cache lifetimes. The feed caches the data for seconds. The trending tags cache the entire component for minutes
- `cacheTag` names the data. `updateTag` invalidates it
- Dynamic by default, cache where you choose. The demo will show this in practice

### Slide: "It's not just for websites anymore"

- Next.js has always been the obvious pick for websites, commerce, content
- But app-like experiences, dashboards, social apps, tools, people reached for SPAs because it wasn't all the way there. Navigation felt slow. Caching was confusing
- Cache Components solved the caching part. But navigation speed is still missing. That's what 16.3 adds

### Slide: "But..."

- The architecture is good. Streaming works. SEO works out of the box. Components are self-contained, reusable, and now cacheable
- But every navigation still hits the server. You see skeletons every time you click. It works, but it doesn't feel like an SPA. This is where people bounced

---

## 3. 16.3: Instant Navigations [SLIDES]

16 shipped the foundation: `'use cache'`, `updateTag`, streaming. 16.3 completes the story. The theme is **Instant Navigations**, combining the best of MPAs and SPAs.

### Slide: "Instant Navigations"

1. **Partial Prefetching**: reimagined prefetching based on Partial Prerendering. The framework prefetches the static shell AND cached dynamic data separately. Dynamic pages become prefetchable
2. **Cached Navigations**: client-side navigation cache on by default. Pages you've visited are cached in the browser. Back/forward is instant
3. **Optimistic Routing**: navigations start immediately before the server responds
4. **Instant Insights**: the framework catches navigation performance problems as you code. Async component outside a Suspense boundary? The dev overlay shows you immediately with a fix card. Think of these like TypeScript errors for your app's speed. Your code runs in dev, but the build won't ship it. Most frameworks have best practices you learn to follow. Next.js surfaces this entire class of issues programmatically
5. **Navigation Inspector**: visualize the loading sequence and prefetch state as you navigate between routes
6. **`instant()` e2e test helper**: catch navigation performance issues in tests before production
7. **Static Prefetch Bundling**: more efficient prefetching of static pages

These complete the story from the WHY section. Every problem we named has an answer now.

*"Let me show you what this looks like in practice. I've built a social media app with these patterns. Let's walk through how it's composed and what kind of experience we get."*

Switch to editor + browser with the app.

---

## 4. HOW: building the app [DEMO]

Walk through the app in the editor and browser. The app is already built, but the two main pages start as empty stubs with comment slots. We'll fill them in piece by piece to show how the patterns work in practice and what experience they produce.

### Starter app

Everything pre-built except the pages. Show the feature folders:

- `features/drop/`: queries (`getDrop`, `getFeed`, `getReplies`), actions (`postDrop`, `toggleLike`), and components (`<DropDetail>`, `<Drop>`, `<Feed>`, `<Replies>`)
- `features/user/`: queries (`getCurrentUser`, `getUserByHandle`), actions (`toggleFollow`), and components (`<UserAvatar>`, `<ProfileHeader>`, `<WhoToFollowList>`)
- `features/tag/`: queries (`getTrendingTags`) and components (`<TrendingTagsList>`, `<TagsList>`)

These are React components. Each one fetches its own data. Each one exports a skeleton. They're kept generic: just give them an id or a handle and they work anywhere. This is the Lego box. We're going to pick from it.

The layout, sidebar, all client components (`<DropActions>`, `<ReplyComposerForm>`, `<QuickDropForm>`), styling, and config are also pre-built. Queries don't have `'use cache'` yet.

### Page 1: Detail page (`app/drop/[id]/page.tsx`)

Build step by step. This page has nested Suspense, error isolation, and composition across client boundaries. The loading design choices are most visible here.

**Step 1: placeholders.** Empty page, just comment slots:

```tsx
export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      {/* Page header */}
      {/* Drop detail: full post with author info */}
      {/* Reply composer: input with avatar */}
      {/* Replies: list of replies */}
    </div>
  );
}
```

- Just an empty div with comments. The page is a blueprint, each comment is a slot for a component
- Even `<PageHeader>` is a comment. We'll add everything piece by piece
- Show it in the browser: just a blank page with the layout around it. The sidebar, trending tags, who to follow are all already working. This page hasn't done anything yet

**Step 2: add the first component.** Replace the page header comment:

```tsx
<PageHeader back title="Drop" />
{/* Drop detail: full post with author info */}
{/* Reply composer: input with avatar */}
{/* Replies: list of replies */}
```

- Just a regular component. The page renders it synchronously. Nothing special yet

**Step 3: async components.** Replace the drop detail comment. Open `<DropDetail>` and show that it's an `async function` that fetches its own data:

```tsx
async function DropDetail({ id }: { id: string }) {
  const drop = await getDrop(id);
  const userState = await getDropUserState(id);
  return ( ... );
}
```

- This is the key idea. The component owns its data. It's async, it fetches on the server, next to the database. No loader, no useEffect, no prop drilling. Self-contained
- Before, you'd put this fetch in a loader or a useEffect. Now it's just in the component. Like React was supposed to work, but on the server
- Add it to the page, along with `<Replies>` (also async, also owns its data):

```tsx
<PageHeader back title="Drop" />
<DropDetail id={id} />
<Replies id={id} />
```

- But we need the `id` from params. First try: `await params`

**Step 4: params.** Try the obvious way, `await params` at the top:

```tsx
const { id } = await params;
return (
  <div>
    <PageHeader back title="Drop" />
    <DropDetail id={id} />
    <Replies id={id} />
  </div>
);
```

- **Instant Insights fires.** The page awaits params at the top, which blocks everything. The dev overlay flags it: the page can't stream because everything depends on that await. The content above the params, `<PageHeader>`, the layout, the shell, could have been pre-rendered and cached. It's the same for every user, every visit. By awaiting at the top, we're blocking that reusable content from being served instantly. Instant Insights is telling us there's cacheable, shareable content here that we're unnecessarily blocking
- Fix: use `params.then()` instead. The page stays synchronous. Everything above the `.then()` can be pre-rendered and shared across users. The dynamic content streams in after

```tsx
{params.then(({ id }) => (
  <>
    <DropDetail id={id} />
    <Replies id={id} />
  </>
))}
```

- Each component owns its data on the server. No loader coupling
- Now point out the layout: `<TrendingTagsList>` and `<WhoToFollowList>` in the sidebar are the same kind of async components. They fetch their own data. No page wired them. They work on every page: home, profile, detail, search. With loaders, you'd duplicate those fetches on every route
- In a loader model the page knows what every child needs. Here it doesn't even know what data exists
- *Callback: this is the answer to the cascade. No useEffect, no client cache, no loader coupling. Components own their data again*

**Step 5: Suspense.** Design the loading experience:

- Without Suspense, the page blocks until every async component finishes. The user sees nothing. With the old approach you'd add `isLoading` flags inside each component and manage the sequence yourself
- Suspense flips this: the page decides what to show while things load. You wrap async content in boundaries and provide fallbacks

- **Option A**: one big boundary. Everything waits for the slowest query. Simple but the user stares at a skeleton until replies (the slowest) finish
- **Option B**: individual boundaries on everything. Better, but things pop in randomly, layout shifts as each piece arrives. This is popcorn UI again, just on the server
- **Option C**: designed boundaries (what we pick). Group things that should appear together. Detail in one boundary (fast). Replies in a nested boundary (slower, streams in after)

```tsx
<Suspense fallback={<DropDetailSkeleton />}>
  {params.then(({ id }) => (
    <>
      <DropDetail id={id} />
      <Suspense fallback={<RepliesSkeleton />}>
        <Replies id={id} />
      </Suspense>
    </>
  ))}
</Suspense>
```

- The outer `<Suspense>` wraps everything that depends on the id. Its fallback is `<DropDetailSkeleton>`, the skeleton for the whole section. This is what the user sees first
- `<Replies>` has its own nested `<Suspense>`. It's the slowest query so it streams in independently. The user can already read the post while replies load
- `<DropDetailSkeleton>` and `<RepliesSkeleton>` are exported from the same file as their async component. They can't drift apart. The loading state IS part of the component
- Show the browser: the page streams. Detail appears, then replies fill in. Designed order, not random
- *Callback: this is coordinated loading from the WHY. No popcorn UI, no `isLoading` flags. The page composes the loading experience the same way it composes the UI*

**Step 6: ErrorBoundary.** Wrap replies:

```tsx
<ErrorBoundary title="Replies didn't load">
  <Suspense fallback={<RepliesSkeleton />}>
    <Replies id={id} />
  </Suspense>
</ErrorBoundary>
```

- What happens if replies fail? Without this, the whole page crashes. With an ErrorBoundary, replies show an error message but the detail and composer still work. The user can still read the post
- In a loader model, one failure takes down the whole page. Here each piece is isolated
- ErrorBoundary composes the same way as Suspense. Just another wrapper you snap on

**Step 7: Crossfade:**

```tsx
<Suspense fallback={<DropDetailSkeleton />}>
  <Crossfade>
    {params.then(({ id }) => ( ... ))}
  </Crossfade>
</Suspense>
```

- Without this, content hard-swaps in when the Suspense boundary resolves. Skeleton one frame, content the next
- `<Crossfade>` is a `<ViewTransition>` wrapper. Content fades in smoothly instead. One line, same streaming behavior, just polished
- This composes too. Wrap any Suspense content in it

**Step 8: client components.** Now add the interactive pieces. Add `<ReplyComposerForm>` between the detail and replies:

```tsx
<DropDetail id={id} />
<ReplyComposerForm dropId={id} avatar={
  <Suspense fallback={<UserAvatarSkeleton />}>
    <CurrentUserAvatar />
  </Suspense>
} />
<ErrorBoundary title="Replies didn't load">
  <Suspense fallback={<RepliesSkeleton />}>
    <Replies id={id} />
  </Suspense>
</ErrorBoundary>
```

- `<ReplyComposerForm>` is `'use client'` because it needs interactivity for the form. But the avatar prop is a server-rendered `<CurrentUserAvatar>` wrapped in Suspense. Server content flows into the client component as children
- The avatar has its own tiny Suspense boundary. It doesn't block the form from showing
- The client component doesn't know or care where the avatar came from. It just renders it. Composition crosses the boundary naturally

Then open `<DropDetail>` and show that it passes server-fetched `userState` to `<DropActions>`:

```tsx
// Inside DropDetail (server component)
const userState = await getDropUserState(drop.id);
return (
  <article>
    ...
    <DropActions userState={userState} />
  </article>
);
```

- `<DropActions>` is `'use client'`. It uses `useOptimistic` for instant like/repost/bookmark feedback. But the initial state came from the server, fetched next to the database, not on the client
- `'use client'` is a boundary marker, not a mode switch. Everything above it stays on the server. Only this leaf ships to the browser
- Toggle boundary visualizer. Handful of fuchsia outlines, everything else is server. This is the ratio you get when you push `'use client'` to the leaves
- *Callback: this is what "one codebase" looks like. Server and client in the same tree, composing naturally*

### Page 2: Home feed (`app/page.tsx`)

Live code this one too, faster, since the audience already knows the pattern.

**Step 1: empty page.** Same starter stub with comments:

```tsx
export default function HomePage({ searchParams }: PageProps) {
  return (
    <div>
      {/* Page header */}
      {/* Tabs: following / discover */}
      {/* Composer: new drop form */}
      {/* Feed: list of drops */}
    </div>
  );
}
```

- Same empty blueprint as before. Show it in the browser, just a blank page with the layout around it

**Step 2: drop in components + Suspense.** Do it in one go this time, the audience has seen the pattern:

```tsx
<PageHeader title="Home" />
<Suspense fallback={<TabsSkeleton />}>
  <FeedTabs />
</Suspense>
<DropComposer />
<Suspense fallback={<DropListSkeleton />}>
  <Crossfade>
    {searchParams.then(sp => {
      const tab = parseTab(sp.tab);
      return tab === 'discover' ? <DiscoverFeed /> : <Feed />;
    })}
  </Crossfade>
</Suspense>
```

- `<FeedTabs>` reads searchParams to know which tab is active. It's async, gets its own Suspense boundary with `<TabsSkeleton>`. Tabs appear fast at the top
- `<DropComposer>` is synchronous, it doesn't need a boundary. It passes a server-rendered `<CurrentUserAvatar>` into client forms, same composition pattern we just saw
- The feed is the main content. `searchParams.then()` is just JavaScript, same idea as `params.then()`. The page stays synchronous. The feed gets `<Crossfade>` for a smooth reveal
- `<Feed>` and `<DiscoverFeed>` are async components that own their data. Swap between them based on the tab. Either one works on any page
- Point out: this went faster. Same pattern, second time. That's the point

### Other pages

Click around: profile, search, bookmarks, tags. Already built. Same components, different pages. `<Drop>` on home AND profile, no duplication.

### Adding caching + Instant Navigations

**Show the problem first.** Navigate between pages in the starter. Every click hits the server. Skeletons every time. The architecture is good but it doesn't feel like an SPA yet.
- *Callback: this was the "But..." from section 2*

**Briefly show `'use cache'`.** Open the drop queries file. We're going to add caching to the features we just built with. Show two queries side by side:

```ts
// drop-queries.ts

export const getDrop = cache(async (id: string) => {
  'use cache';
  cacheTag('drops', `drop-${id}`);
  cacheLife('seconds');
  // ...
});

export const getReplies = cache(async (dropId: string) => {
  'use cache';
  cacheTag(`replies-${dropId}`);
  cacheLife('seconds');
  // ...
});
```

- The cache lives in the data layer, right next to the data. Not in the component, not in the page. This matters because the invalidation lives here too: when someone posts a reply, the action calls `updateTag('replies-${dropId}')`. The tag and the invalidation are in the same layer, easy to find, easy to reason about
- `<DropDetail>` calls `getDrop`. `<Replies>` calls `getReplies`. Each component owns its data, and each query decides its own caching. The component doesn't know or care whether its data is cached
- `cacheLife('seconds')` for the feed because it changes often. Open tag-queries.ts briefly: `cacheLife('minutes')` for trending tags because they don't change as fast. Same page, different lifetimes. That's component-level caching

**Add `force-runtime` to the home page and detail page:**

```ts
export const unstable_prefetch = 'force-runtime';
```

- This tells the framework to prefetch cached dynamic data ahead of time. But prefetching doesn't work in dev, we need the deployed app to see it

**Switch to the deployed finished app.** Explain what changed since what they saw: I took the same pattern we just showed for `getFeed` and applied it to every query in the app. Each one got `'use cache'` with a `cacheTag` and `cacheLife` that makes sense for that piece of UI. The feed caches for seconds because it changes often, trending tags cache for minutes, user profiles cache for minutes. Every mutation calls `updateTag` to invalidate the right data. And `force-runtime` is on every page. Same app, same architecture, just with caching turned on.

**Prefetch toggle demo:**
- Off: click a drop, skeleton, streams in
- On: scroll the feed, watch prefetch requests in the network tab. Click a drop, instant, no skeleton
- Navigate around, cached. Content stays cached until invalidated
- Post a drop, server action calls `updateTag('feed')`. Navigate back to feed, **new prefetch fires.** Only the invalidated data refetches, everything else stays cached
- This is the full cycle: `cacheTag` → `'use cache'` → `updateTag`

**Boundary visualizer:**
- Fuchsia outlines on client components. Everything else is server

**Speed Insights:**
- Open Vercel Speed Insights for the deployed app. "I've had this deployed on Vercel, let's look at how it's been performing."
- Show real production data, Core Web Vitals, experience scores
- Look at the real experience score across different regions. Users in slower networks, different countries, they're getting the same experience because the architecture streams content immediately and prefetches what it can. We're not waiting for a JS bundle to download before anything happens
- Not everyone is on a fast connection in Amsterdam. With server components and streaming, the app works well everywhere. The server does the heavy lifting, the client gets the minimum it needs

---

## 5. Close [SLIDES]

### Slide: "What RSCs can do in Next.js today"

- Instant-feeling UX. Prefetched, cached, navigations feel native. No client data layer
- Streamed UI. Suspense-first. The page designs the loading sequence, not the network
- Fresh data. One cache primitive, one invalidation call, both caches update
- Caching across the stack. Per-component, not per-page. Dynamic and static mixed freely

### Slide: It scales

Same components, different pages. No duplication. Add a page, snap in blocks. The complexity doesn't grow with the product.

Remember the tweet at the beginning, agents drifting toward feature architecture and clear boundaries? This is that architecture. Self-contained components, feature folders, co-located data. We extended React's composability across the entire stack, and that's exactly why it works for agents, for teams, and for scaling.

The repo also has a skill file that documents this architecture step by step. Drop it into any AI coding agent and it builds features the same way you would.

And Next.js 16 ships a built-in MCP server (via `next-devtools-mcp`). Your agent can read live errors, logs, routes, and Server Actions from the running dev server. It can run Playwright in the browser to verify what it built. The agent doesn't just write code, it can observe and debug the running app.

### Slide: Closing

You don't need a separate client cache, a separate server cache, and a coordination layer between them. You don't need a different mental model for static pages and dynamic pages. You don't need to switch frameworks when your requirements change.

You need components. The same composability we've always loved about React, extended to data fetching, to caching, to streaming, to infrastructure. We follow React, and that means less work for you. Follow the patterns and it just works.

I said at the beginning the model has changed a lot. Now you've seen it.

*Visual: QR code linking to github.com/aurorascharff/next16-social-media. Repo URL visible below it. @aurorascharff on socials.*
