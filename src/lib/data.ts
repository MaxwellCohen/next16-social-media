/**
 * In-memory store for the Drop demo.
 *
 * Real apps would talk to Postgres or whatever. This is a small array-backed
 * store so the demo stays small enough to read on a projector and re-seeds on
 * every server restart.
 *
 * All reads/writes go through `src/data/queries` and `src/data/actions`.
 */

export type User = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  followers: number;
  following: number;
};

export type EmbeddedCode = { lang: string; code: string };

export type Drop = {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: Date;
  likes: number;
  replies: number;
  reposts: number;
  tags: string[];
  embeddedCode?: EmbeddedCode;
  /** id of the drop this is a reply to. Top-level drops have no parent. */
  parentId?: string;
};

export type Tag = {
  name: string;
  count: number;
};

type Store = {
  users: User[];
  drops: Drop[];
  /** follower handle -> set of handles they follow */
  follows: Record<string, Set<string>>;
  /** user handle -> set of drop ids they liked */
  likes: Record<string, Set<string>>;
  /** user handle -> set of drop ids they bookmarked */
  bookmarks: Record<string, Set<string>>;
  dropIdCounter: number;
  currentUserHandle: string;
};

// ─── seed data ─────────────────────────────────────────────────────────────

const now = Date.now();
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

const USERS: User[] = [
  {
    id: "u1",
    handle: "aurora",
    displayName: "Aurora",
    bio: "DX at Vercel. Building things on the web.",
    avatarColor: "from-blue-500 to-indigo-600",
    followers: 12_400,
    following: 312,
  },
  {
    id: "u2",
    handle: "streambot",
    displayName: "Streambot",
    bio: "I send the page in pieces. You're welcome.",
    avatarColor: "from-cyan-400 to-blue-600",
    followers: 80_300,
    following: 451,
  },
  {
    id: "u3",
    handle: "cachepunk",
    displayName: "Cachepunk",
    bio: "Building UI primitives. Strong opinions, loosely held.",
    avatarColor: "from-violet-500 to-blue-500",
    followers: 4_120,
    following: 198,
  },
  {
    id: "u4",
    handle: "boundary",
    displayName: "Boundary",
    bio: "Suspense apologist. Reformed effect user.",
    avatarColor: "from-sky-400 to-blue-700",
    followers: 2_840,
    following: 540,
  },
  {
    id: "u5",
    handle: "prefetcher",
    displayName: "Prefetcher",
    bio: "Already loaded that. You're welcome.",
    avatarColor: "from-blue-400 to-purple-600",
    followers: 9_900,
    following: 88,
  },
  {
    id: "u6",
    handle: "coldstart",
    displayName: "Coldstart",
    bio: "Less JavaScript, please.",
    avatarColor: "from-teal-400 to-blue-600",
    followers: 5_330,
    following: 245,
  },
  {
    id: "u7",
    handle: "hydrator",
    displayName: "Hydrator",
    bio: "I read your stack traces.",
    avatarColor: "from-blue-500 to-pink-500",
    followers: 1_870,
    following: 612,
  },
  {
    id: "u8",
    handle: "formfox",
    displayName: "Formfox",
    bio: "If it streams, I want it.",
    avatarColor: "from-indigo-500 to-blue-700",
    followers: 720,
    following: 410,
  },
];

const DROPS: Drop[] = [
  {
    id: "d1",
    authorHandle: "aurora",
    body: "the team's been on a roll this canary cycle. instant pages by default, one cache that handles browser and server, the build refusing to ship anything slow. so much of what landed quietly over the last month is going to feel obvious in five minutes.",
    createdAt: new Date(now - 8 * minute),
    likes: 2_140,
    replies: 110,
    reposts: 480,
    tags: ["nextjs"],
  },
  {
    id: "d2",
    authorHandle: "aurora",
    body: "new canary drop today: the framework now warns you the moment your app stops being instant. not at runtime, not in a lighthouse score weeks later. as you type. it's the closest thing to a TypeScript error for UX I've ever used.",
    createdAt: new Date(now - 22 * minute),
    likes: 1_640,
    replies: 88,
    reposts: 320,
    tags: ["nextjs"],
  },
  {
    id: "d3",
    authorHandle: "streambot",
    body: "wrote a thread about why we picked one cache model that decides for you instead of two you have to coordinate. tldr: nobody likes running two caches by hand.",
    createdAt: new Date(now - 45 * minute),
    likes: 920,
    replies: 51,
    reposts: 140,
    tags: ["nextjs"],
  },
  {
    id: "d4",
    authorHandle: "aurora",
    body: "every link on your page is already prefetched by the time the user looks at it. as of this canary, the cached parts behind the link are too. clicks land instantly even on slow networks, no app code changed.",
    createdAt: new Date(now - 1 * hour),
    likes: 3_120,
    replies: 207,
    reposts: 880,
    tags: ["nextjs"],
  },
  {
    id: "d5",
    authorHandle: "aurora",
    body: "spent the morning porting our marketing site over. the new dev overlay caught two pages I'd quietly left dynamic for months. minutes of work, both back to instant.",
    createdAt: new Date(now - 2 * hour),
    likes: 1_240,
    replies: 64,
    reposts: 180,
    tags: ["nextjs"],
  },
  {
    id: "d6",
    authorHandle: "cachepunk",
    body: "the per-user cache flavor we shipped last week is wild in practice. server cache shared across everyone, browser cache personal, you describe the behavior, framework picks. no more cookie plumbing.",
    createdAt: new Date(now - 3 * hour),
    likes: 1_840,
    replies: 142,
    reposts: 410,
    tags: ["nextjs"],
  },
  {
    id: "d7",
    authorHandle: "aurora",
    body: "favorite thing about this release: it's the same code path that lets a click feel instant on a fast connection and stream gracefully on a slow one. you don't write the difference, the framework adapts.",
    createdAt: new Date(now - 4 * hour),
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ["nextjs"],
  },
  {
    id: "d8",
    authorHandle: "boundary",
    body: "if your framework only streams as a workaround it's not really streaming. been a long road but every page in next is a streaming response by construction now.",
    createdAt: new Date(now - 5 * hour),
    likes: 4_320,
    replies: 511,
    reposts: 1_200,
    tags: ["react"],
  },
  {
    id: "d9",
    authorHandle: "aurora",
    body: "you can post a tweet, like a tweet, change anything on a cached page, and the right things refresh on the server and in the browser at once. one line in your mutation, both caches handled. no coordination layer.",
    createdAt: new Date(now - 7 * hour),
    likes: 1_900,
    replies: 88,
    reposts: 310,
    tags: ["nextjs"],
  },
  {
    id: "d10",
    authorHandle: "aurora",
    body: "I keep telling people the prestige of this release isn't any single feature. it's that you can build something that feels like a snappy app, with one mental model, without a client cache library to maintain.",
    createdAt: new Date(now - 9 * hour),
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: ["nextjs"],
  },
  {
    id: "d11",
    authorHandle: "coldstart",
    body: "upgraded our monorepo to canary this morning. one command, everything codemodded, builds passed on first run. the upgrade story keeps getting boringly good.",
    createdAt: new Date(now - 11 * hour),
    likes: 1_810,
    replies: 96,
    reposts: 340,
    tags: ["nextjs"],
  },
  {
    id: "d12",
    authorHandle: "aurora",
    body: "fun side effect of how the new cache works: when four pieces of your page ask for the same user, the framework only fetches once. you stop hoisting data to the page just to keep it fast. components own their data again.",
    createdAt: new Date(now - 14 * hour),
    likes: 1_180,
    replies: 47,
    reposts: 220,
    tags: ["nextjs"],
  },
  {
    id: "d13",
    authorHandle: "aurora",
    body: "the adapter work this cycle is the quiet headliner. the same model, the same caching, the same streaming, on whatever platform you host. you don't trade off the architecture to pick where to deploy.",
    createdAt: new Date(now - 18 * hour),
    likes: 1_640,
    replies: 110,
    reposts: 340,
    tags: ["nextjs"],
  },
  {
    id: "d14",
    authorHandle: "hydrator",
    body: "tried remix v3 this weekend. data model is clean. still missing a per-component cache primitive though, which is where I keep reaching for next.",
    createdAt: new Date(now - 22 * hour),
    likes: 1_020,
    replies: 142,
    reposts: 88,
    tags: ["webdev"],
  },
  {
    id: "d15",
    authorHandle: "aurora",
    body: "next 16 stable lands next week. canary has been rock solid for two months now. genuinely one of the most fun releases I've worked on. lot of small things, all in the same direction.",
    createdAt: new Date(now - 1 * day - 2 * hour),
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ["nextjs"],
  },
  {
    id: "d16",
    authorHandle: "boundary",
    body: "got astro and sveltekit benchmarks back. they're great at the things they're great at. but if I need streaming, per-user caching, and coordinated mutations in one model, I'm still on next.",
    createdAt: new Date(now - 1 * day - 8 * hour),
    likes: 1_410,
    replies: 196,
    reposts: 240,
    tags: ["webdev"],
  },
  {
    id: "d17",
    authorHandle: "aurora",
    body: "the network tab is the best documentation a framework can write. open it on any next 16 page and you'll watch the framework do most of the work you used to write by hand.",
    createdAt: new Date(now - 2 * day),
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: ["nextjs"],
  },
];

// Replies under d2 (the instant-warning drop), used on the detail page.
const REPLIES: Drop[] = [
  {
    id: "r1",
    authorHandle: "streambot",
    parentId: "d2",
    body: "this is the part I keep telling people about. the build refuses to ship slow pages. instant is the baseline, not a checklist.",
    createdAt: new Date(now - 18 * minute),
    likes: 142,
    replies: 4,
    reposts: 9,
    tags: [],
  },
  {
    id: "r2",
    authorHandle: "boundary",
    parentId: "d2",
    body: "every time someone discovers this it ends with 'why isn't this default everywhere.'",
    createdAt: new Date(now - 15 * minute),
    likes: 88,
    replies: 1,
    reposts: 3,
    tags: [],
  },
  {
    id: "r3",
    authorHandle: "coldstart",
    parentId: "d2",
    body: "switched our team on as soon as it landed in canary. half the perf review meetings we used to have just stopped happening.",
    createdAt: new Date(now - 10 * minute),
    likes: 64,
    replies: 0,
    reposts: 2,
    tags: [],
  },
];

const ALL_DROPS = [...DROPS, ...REPLIES];

const FOLLOWS: Record<string, Set<string>> = {
  aurora: new Set(["streambot", "cachepunk", "boundary", "prefetcher", "coldstart", "hydrator"]),
  streambot: new Set(["aurora", "prefetcher", "cachepunk"]),
  cachepunk: new Set(["aurora", "streambot"]),
  boundary: new Set(["aurora", "streambot", "coldstart"]),
  prefetcher: new Set(["aurora", "streambot"]),
  coldstart: new Set(["aurora", "boundary"]),
  hydrator: new Set(["aurora", "streambot", "formfox"]),
  formfox: new Set(["aurora"]),
};

const LIKES: Record<string, Set<string>> = {
  aurora: new Set(["d1", "d4", "d7"]),
};

const BOOKMARKS: Record<string, Set<string>> = {
  aurora: new Set(["d4", "d12"]),
};

// ─── module-local store ───────────────────────────────────────────────────

const store: Store = {
  users: [...USERS],
  drops: [...ALL_DROPS],
  follows: FOLLOWS,
  likes: LIKES,
  bookmarks: BOOKMARKS,
  dropIdCounter: ALL_DROPS.length + 1,
  currentUserHandle: "aurora",
};

// ─── accessors used by `src/data/queries` and `src/data/actions` ──────────

export function getStore() {
  return store;
}

export function getNextDropId() {
  store.dropIdCounter += 1;
  return `d${store.dropIdCounter}`;
}
