# Drop — Application Specification

A dev-flavored social network used as the demo app for the React Summit Amsterdam keynote.

The audience reads it as a real social product (feed, post detail, profile, follow, like, repost, compose modal) the moment it loads. The brand and content type signal "this is the social app devs would actually use," not a Twitter clone.

---

## Concept

**Drop** is where developers share what they're doing, learning, breaking, and shipping. Every post is a **drop**: a moment in time, fixed once published.

- Compose button copy: **"Drop it"**
- Feed empty state: **"No drops yet."**
- Profile header: **"Drops by @aurora"**
- Trending section: **"Dropping now"**

The verb is already in the audience's vocabulary (album drops, product drops, release drops), so no one has to learn what a "drop" is. The brand carries itself.

---

## Brand and visual identity

- **Palette:** deep blue and near-black. Single bright blue accent for primary actions, links, and the wordmark. White-on-near-black body text.
- **Shape language:** squared corners, sharp edges, no soft rounding. Avatars are squares with slight corner rounding. Cards are flat rectangles with a thin border.
- **Typography:** sans-serif for UI and body. Monospace for code embedded inside drops, for handles (`@aurora`), and for the wordmark accent character.
- **Wordmark:** **drop** in lowercase sans-serif. Optional angular glyph (a small downward arrow or square) sitting to the left of the wordmark.
- **Density:** generous. Each drop has breathing room. Reads cleanly on a conference projector from the back of the room.
- **Dark mode default.** No light mode in the demo.

---

## Content type

A drop is a short post, dev-flavored. It can contain:

- Plain text (up to ~280 chars)
- Inline code (monospace)
- Optional embedded code block (small, syntax-highlighted)
- Optional embedded link card (repo, release, blog post)
- Optional embedded image

Tags are hashtags written as `#nextjs`, `#react`, `#rust`. Trending tags are the global top tags right now.

### Example drops (for seed data and slide screenshots)

- _"shipped a tiny `useEffect` cleanup helper today. surprised it doesn't already exist in core. #react"_
- _"`unstable_instant` actually catches the mistake I always make. wild that this works at build time. #nextjs"_
- _"first time using server actions for a real form. zero client JS for the submit path. #react"_
- _"hot take: a router is mostly a prefetcher. #webdev"_
- _"my deploy log just told me what to optimize next. shouldn't this be the default? #infra"_

---

## Core mechanics

Standard social-network primitives. No invention here; the audience needs to recognize what they're looking at instantly.

| Mechanic      | Behavior                                                                         |
| ------------- | -------------------------------------------------------------------------------- |
| Drop          | Create a short post. Goes to your followers' feeds and your profile.             |
| Reply         | A drop in response to another drop. Threads visible on the parent's detail page. |
| Like          | Toggle. Optimistic. Shown as a count on each drop.                               |
| Repost        | Re-share a drop into your followers' feeds. Optimistic.                          |
| Bookmark      | Personal save for later. Not visible to others.                                  |
| Follow        | Subscribe to another user. Drives the personalized feed.                         |
| Trending tags | Global top hashtags right now.                                                   |
| Who to follow | Suggested accounts.                                                              |

---

## Routes

| Path          | Description                                       |
| ------------- | ------------------------------------------------- |
| `/`           | Home feed. Personalized to the signed-in user.    |
| `/drop/[id]`  | Drop detail page. Original drop + replies thread. |
| `/tag/[tag]`  | All drops with a given hashtag.                   |
| `/u/[handle]` | User profile. Drops, replies, likes tabs.         |
| `/bookmarks`  | Signed-in user's saved drops.                     |
| `/compose`    | (Modal route) Compose a new drop.                 |

---

## Page layouts

### Home (`/`)

Three-column layout, blue-black squared:

- **Left:** logo, primary navigation, user card. Sticky.
- **Center (main column):** compose box at top, then the feed. Each drop is a card showing avatar, handle, time, body, action row (reply, repost, like, bookmark).
- **Right:** `<TrendingTags />`, `<WhoToFollow />`, footer links. Sticky.

### Drop detail (`/drop/[id]`)

Same three-column shell. Center column:

- The original drop, larger, with full timestamp.
- A divider.
- Replies, threaded.
- A compose-reply box at the bottom.

### Profile (`/u/[handle]`)

- Profile header: avatar, display name, handle, bio, follower / following counts, "Follow" button.
- Tabs: **Drops**, **Replies**, **Likes**.
- The selected tab renders a feed.

### Tag (`/tag/[tag]`)

- Header: `#tag` + count of drops.
- Feed of drops with that tag.

---

## Data model

Plain async data-access helpers, treated as given in the talk. Names map directly to what they return.

```ts
// /lib/db.ts
db.user.findByHandle(handle: string): Promise<User>
db.user.current(): Promise<User>
db.user.whoToFollow(): Promise<User[]>

db.drop.findAll(): Promise<Drop[]>
db.drop.findById(id: string): Promise<Drop>
db.drop.byAuthor(handle: string): Promise<Drop[]>
db.drop.byTag(tag: string): Promise<Drop[]>
db.drop.create(input: DropInput): Promise<Drop>

db.replies.forDrop(id: string): Promise<Drop[]>

db.tags.trending(): Promise<Tag[]>

db.feed.personalized(userId: string): Promise<Drop[]>

db.bookmarks.list(userId: string): Promise<Drop[]>

db.likes.toggle(userId: string, dropId: string): Promise<void>
db.follow.toggle(userId: string, targetId: string): Promise<void>
```

### Entities

```ts
type User = {
  id: string;
  handle: string; // 'aurora'
  displayName: string; // 'Aurora Scharff'
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
};

type Drop = {
  id: string;
  author: User;
  body: string;
  createdAt: string; // ISO
  likes: number;
  replies: number;
  reposts: number;
  tags: string[];
  embeddedCode?: { lang: string; code: string };
  embeddedLink?: { url: string; title: string; description: string };
};

type Tag = {
  name: string; // 'nextjs'
  count: number; // drops in the trending window
};
```

---

## Component inventory

The starter app is pre-built with these. The talk _types_ the page-level composition; the components themselves are given.

### Server components (data-aware)

- `<Feed />` — global home feed
- `<DropDetail params />` — original drop on the detail page
- `<Replies params />` — replies thread on the detail page
- `<TrendingTags />` — right rail trending list
- `<WhoToFollow />` — right rail suggestions
- `<Sidebar />` — left rail navigation and current user card
- `<Profile handle />` — profile header
- `<TweetComposer />` — top-of-feed compose entry point (opens the modal)
- `<Footer />` — mostly static

### Leaf server components (presentation)

- `<Drop drop />` — one drop card
- `<Avatar user size />`
- `<TagPill tag />`
- `<LinkCard link />`
- `<CodeBlock code lang />`

### Client components (`'use client'`)

- `<LikeButton dropId initialLikes />` — `useOptimistic` toggle
- `<RepostButton dropId initialReposts />` — `useOptimistic` toggle
- `<ReplyButton dropId />` — opens the reply modal
- `<BookmarkButton dropId initialState />` — `useOptimistic` toggle
- `<FollowButton userId initialState />` — `useOptimistic` toggle
- `<NewDropModal />` — full compose modal
- `<DropActions />` — the row of buttons under each drop (likely contains the above buttons)
- `<ProfileTabs />` — tab state on profile pages

### Skeletons

- `<DropSkeleton />`
- `<RepliesSkeleton />`
- `<ProfileSkeleton />`
- `<TrendingTagsSkeleton />`

---

## Server actions

```ts
'use server';

async function postDrop(formData: FormData): Promise<void>;
async function toggleLike(dropId: string): Promise<void>;
async function toggleRepost(dropId: string): Promise<void>;
async function toggleBookmark(dropId: string): Promise<void>;
async function toggleFollow(userId: string): Promise<void>;
async function postReply(dropId: string, formData: FormData): Promise<void>;
```

All actions update the relevant cache tags so cached feeds, profiles, and detail pages reflect the change.

### Cache tags

| Tag                    | What it covers                |
| ---------------------- | ----------------------------- |
| `feed`                 | Global and personalized feeds |
| `drop:${id}`           | A single drop                 |
| `replies:${dropId}`    | Replies under a specific drop |
| `tag:${name}`          | Drops under a hashtag         |
| `user:${handle}`       | Profile data                  |
| `user-drops:${handle}` | Drops authored by a user      |
| `trending`             | Trending tags list            |
| `who-to-follow`        | Suggestion list               |

---

## Caching strategy

Plain async functions are wrapped with `'use cache'` where the data tolerates staleness. The talk introduces this incrementally; this section is the target end state.

```ts
async function getDrop(id: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`drop:${id}`);
  return db.drop.findById(id);
}

async function getTrending() {
  'use cache';
  cacheLife('minutes');
  cacheTag('trending');
  return db.tags.trending();
}

async function getDropsByTag(tag: string) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`tag:${tag}`);
  return db.drop.byTag(tag);
}

async function getProfile(handle: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`user:${handle}`);
  return db.user.findByHandle(handle);
}

async function getPersonalizedFeed(userId: string) {
  'use cache: private';
  cacheLife('minutes');
  return db.feed.personalized(userId);
}
```

Replies on `/drop/[id]` stream in (no `'use cache'`) because they're the freshest part of the page.

---

## Mutation flows

### Posting a drop

1. User opens `<NewDropModal />` from `<TweetComposer />` or the floating action button.
2. Submit calls `postDrop(formData)` server action.
3. Action writes the drop, then `updateTag('feed')` and `updateTag('user-drops:${currentUser.handle}')`.
4. Home feed reflects the new drop on next render. Optimistic state in the modal handles the in-between.

### Liking

1. `<LikeButton />` is a client component using `useOptimistic`.
2. Click flips the count locally.
3. Action `toggleLike(dropId)` runs, then `updateTag('drop:${dropId}')`.
4. Cached drop refreshes.

### Following

1. `<FollowButton />` flips state optimistically.
2. Action `toggleFollow(userId)` runs, then `updateTag('user:${targetHandle}')` and `updateTag('feed')`.
3. Personalized feed reflects the new subscription on next render.

---

## Prefetching

- `<Link>` prefetches the static shell of every linked route by default.
- The drop detail page opts into deeper prefetching so the cached drop body warms ahead of the click:

```tsx
// app/drop/[id]/page.tsx
export const unstable_prefetch = 'force-runtime';
```

(Exact API TBD — see the talk sketch to-do.)

---

## Config

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

Instant-navigation validation runs by default.

---

## Talk usage map

Which parts of the app appear in which layer of the demo.

| Layer | Routes / components touched                                           | New move                                                |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| 1     | `/` (Feed, Sidebar, TrendingTags, WhoToFollow, TweetComposer, Footer) | `await` on the server                                   |
| 2     | `<Drop>` gets `<LikeButton>` etc. dropped in                          | `'use client'` islands                                  |
| 3     | `/drop/[id]` page, naive then fixed                                   | Cache Components warning, Suspense, first `'use cache'` |
| 4     | `getDrop`, `getTrending`, `getProfile` get caching                    | `cacheLife` + `cacheTag` everywhere                     |
| 5     | `postDrop` server action wired to the compose modal                   | `updateTag`                                             |
| 6     | Drop detail page opts into deeper prefetch                            | `unstable_prefetch = "force-runtime"`                   |

---

## Pre-build checklist for the starter

What the audience sees in `git status` clean:

- All routes scaffolded with placeholder text where Layer 1 will fill in the data.
- All client components written (`<LikeButton>` etc.), wired to server actions, with `useOptimistic`.
- All data-access helpers (`db.*`) implemented against seed data.
- All skeleton components.
- Full styling (blue-black-squared) so the app looks like Drop from the start.
- `next.config.ts` with `cacheComponents: true`.
- No `'use cache'`, no `cacheTag`, no `updateTag` anywhere. Those land live on stage.
- Seed data: ~20 users, ~80 drops, ~30 replies, ~12 trending tags, plausible follow graph.
