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
    handle: "lee",
    displayName: "Lee",
    bio: "Server Components, dev tools, and warm coffee.",
    avatarColor: "from-cyan-400 to-blue-600",
    followers: 80_300,
    following: 451,
  },
  {
    id: "u3",
    handle: "marta",
    displayName: "Marta",
    bio: "Building UI primitives. Strong opinions, loosely held.",
    avatarColor: "from-violet-500 to-blue-500",
    followers: 4_120,
    following: 198,
  },
  {
    id: "u4",
    handle: "noah",
    displayName: "Noah",
    bio: "Tinkering with caches that don't lie.",
    avatarColor: "from-sky-400 to-blue-700",
    followers: 2_840,
    following: 540,
  },
  {
    id: "u5",
    handle: "ines",
    displayName: "Inés",
    bio: "Compiler hugger.",
    avatarColor: "from-blue-400 to-purple-600",
    followers: 9_900,
    following: 88,
  },
  {
    id: "u6",
    handle: "kai",
    displayName: "Kai",
    bio: "Less JavaScript, please.",
    avatarColor: "from-teal-400 to-blue-600",
    followers: 5_330,
    following: 245,
  },
  {
    id: "u7",
    handle: "yara",
    displayName: "Yara",
    bio: "I read your stack traces.",
    avatarColor: "from-blue-500 to-pink-500",
    followers: 1_870,
    following: 612,
  },
  {
    id: "u8",
    handle: "felix",
    displayName: "Felix",
    bio: "If it streams, I want it.",
    avatarColor: "from-indigo-500 to-blue-700",
    followers: 720,
    following: 410,
  },
];

const DROPS: Drop[] = [
  {
    id: "d1",
    authorHandle: "lee",
    body: "shipped a tiny useEffect cleanup helper today. surprised it doesn't already exist in core.",
    createdAt: new Date(now - 8 * minute),
    likes: 412,
    replies: 24,
    reposts: 38,
    tags: ["react"],
  },
  {
    id: "d2",
    authorHandle: "aurora",
    body: "unstable_instant actually catches the mistake I always make. wild that this works at build time.",
    createdAt: new Date(now - 22 * minute),
    likes: 980,
    replies: 51,
    reposts: 120,
    tags: ["nextjs"],
    embeddedCode: {
      lang: "tsx",
      code: `export const unstable_instant = true`,
    },
  },
  {
    id: "d3",
    authorHandle: "marta",
    body: "first time using server actions for a real form. zero client JS for the submit path.",
    createdAt: new Date(now - 45 * minute),
    likes: 304,
    replies: 18,
    reposts: 22,
    tags: ["react"],
  },
  {
    id: "d4",
    authorHandle: "noah",
    body: "hot take: a router is mostly a prefetcher.",
    createdAt: new Date(now - 1 * hour),
    likes: 2_140,
    replies: 207,
    reposts: 511,
    tags: ["webdev"],
  },
  {
    id: "d5",
    authorHandle: "ines",
    body: "my deploy log just told me what to optimize next. shouldn't this be the default?",
    createdAt: new Date(now - 2 * hour),
    likes: 612,
    replies: 33,
    reposts: 41,
    tags: ["infra"],
  },
  {
    id: "d6",
    authorHandle: "kai",
    body: "every time I see a 200 KB client bundle for a static landing page I lose a year of my life.",
    createdAt: new Date(now - 3 * hour),
    likes: 1_320,
    replies: 88,
    reposts: 210,
    tags: ["webdev", "performance"],
  },
  {
    id: "d7",
    authorHandle: "yara",
    body: "TIL: you can pass server children into a client boundary. composition just works.",
    createdAt: new Date(now - 4 * hour),
    likes: 540,
    replies: 22,
    reposts: 60,
    tags: ["react"],
  },
  {
    id: "d8",
    authorHandle: "felix",
    body: "streaming a page is mostly admitting that not every section is equally important.",
    createdAt: new Date(now - 5 * hour),
    likes: 412,
    replies: 12,
    reposts: 50,
    tags: ["webdev"],
  },
  {
    id: "d9",
    authorHandle: "lee",
    body: "'use cache' next to the function feels obvious in hindsight.",
    createdAt: new Date(now - 7 * hour),
    likes: 880,
    replies: 41,
    reposts: 92,
    tags: ["nextjs"],
    embeddedCode: {
      lang: "ts",
      code: `async function getDrop(id: string) {
  'use cache'
  return db.drop.findById(id)
}`,
    },
  },
  {
    id: "d10",
    authorHandle: "aurora",
    body: "the same code path adapts to timing. click fast: skeleton + stream. click slow: instant.",
    createdAt: new Date(now - 9 * hour),
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ["nextjs"],
  },
  {
    id: "d11",
    authorHandle: "ines",
    body: "updateTag should be every framework's mutation primitive. one line. server and browser cache, flushed.",
    createdAt: new Date(now - 12 * hour),
    likes: 700,
    replies: 28,
    reposts: 110,
    tags: ["nextjs"],
  },
  {
    id: "d12",
    authorHandle: "noah",
    body: "the fastest UI is the one you didn't fetch.",
    createdAt: new Date(now - 18 * hour),
    likes: 2_900,
    replies: 142,
    reposts: 612,
    tags: ["performance"],
  },
  {
    id: "d13",
    authorHandle: "kai",
    body: "okay yes the React + form story is finally good.",
    createdAt: new Date(now - 1 * day),
    likes: 612,
    replies: 30,
    reposts: 70,
    tags: ["react"],
  },
  {
    id: "d14",
    authorHandle: "marta",
    body: "loading.tsx vs <Suspense>: same thing, different file convention. pick one.",
    createdAt: new Date(now - 1 * day - 2 * hour),
    likes: 401,
    replies: 19,
    reposts: 33,
    tags: ["nextjs"],
  },
  {
    id: "d15",
    authorHandle: "yara",
    body: "the network tab is the best documentation a framework can write.",
    createdAt: new Date(now - 2 * day),
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: ["webdev"],
  },
];

// Replies under d2 (the unstable_instant drop), used on the detail page.
const REPLIES: Drop[] = [
  {
    id: "r1",
    authorHandle: "lee",
    parentId: "d2",
    body: "this is the part I keep telling people about. the build refuses to ship slow pages.",
    createdAt: new Date(now - 18 * minute),
    likes: 142,
    replies: 4,
    reposts: 9,
    tags: [],
  },
  {
    id: "r2",
    authorHandle: "noah",
    parentId: "d2",
    body: "wait so it's like TypeScript for UX. that's the framing.",
    createdAt: new Date(now - 15 * minute),
    likes: 88,
    replies: 1,
    reposts: 3,
    tags: [],
  },
  {
    id: "r3",
    authorHandle: "kai",
    parentId: "d2",
    body: "every time someone discovers this it ends with 'why isn't this default everywhere.'",
    createdAt: new Date(now - 10 * minute),
    likes: 64,
    replies: 0,
    reposts: 2,
    tags: [],
  },
];

const ALL_DROPS = [...DROPS, ...REPLIES];

const FOLLOWS: Record<string, Set<string>> = {
  aurora: new Set(["lee", "marta", "noah", "ines", "kai", "yara"]),
  lee: new Set(["aurora", "ines", "marta"]),
  marta: new Set(["aurora", "lee"]),
  noah: new Set(["aurora", "lee", "kai"]),
  ines: new Set(["aurora", "lee"]),
  kai: new Set(["aurora", "noah"]),
  yara: new Set(["aurora", "lee", "felix"]),
  felix: new Set(["aurora"]),
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
