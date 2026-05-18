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
  /** user handle -> set of drop ids they reposted */
  reposts: Record<string, Set<string>>;
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
    avatarColor: 'from-blue-500 to-indigo-600',
    bio: 'DX Engineer on the Next.js team at Vercel. React Cert Lead. Oslo.',
    displayName: 'Aurora Scharff',
    followers: 4_911,
    following: 584,
    handle: 'aurorascharff',
    id: 'u1',
  },
  {
    avatarColor: 'from-cyan-400 to-blue-600',
    bio: 'Backend, infra, the occasional bug hunt. Berlin.',
    displayName: 'Vex',
    followers: 8_300,
    following: 451,
    handle: 'vex',
    id: 'u2',
  },
  {
    avatarColor: 'from-violet-500 to-blue-500',
    bio: 'Design engineer. Building components and patterns.',
    displayName: 'Quill',
    followers: 4_120,
    following: 198,
    handle: 'quill',
    id: 'u3',
  },
  {
    avatarColor: 'from-sky-400 to-blue-700',
    bio: 'Staff engineer on performance. Loves a good flame graph.',
    displayName: 'Onyx',
    followers: 6_840,
    following: 540,
    handle: 'onyx',
    id: 'u4',
  },
  {
    avatarColor: 'from-blue-400 to-purple-600',
    bio: 'Frontend lead. Reading source code so you don\'t have to.',
    displayName: 'Wren',
    followers: 2_900,
    following: 188,
    handle: 'wren',
    id: 'u5',
  },
  {
    avatarColor: 'from-teal-400 to-blue-600',
    bio: 'DX and dev tools at a small shop. Coffee enthusiast.',
    displayName: 'Cinder',
    followers: 5_330,
    following: 245,
    handle: 'cinder',
    id: 'u6',
  },
  {
    avatarColor: 'from-blue-500 to-pink-500',
    bio: 'Full-stack. Building things on the side, mostly tools.',
    displayName: 'Halo',
    followers: 1_870,
    following: 612,
    handle: 'halo',
    id: 'u7',
  },
  {
    avatarColor: 'from-indigo-500 to-blue-700',
    bio: 'CTO at a startup. Hiring is hard. Shipping is harder.',
    displayName: 'Echo',
    followers: 2_140,
    following: 410,
    handle: 'echo',
    id: 'u8',
  },
];

const DROPS: Drop[] = [
  {
    authorHandle: 'aurorascharff',
    body: "small canary win: when the same data is read by four components, the framework only fetches it once. you stop hoisting things to the route just to keep them fast.",
    createdAt: new Date(now - 8 * minute),
    id: 'd1',
    likes: 940,
    replies: 32,
    reposts: 140,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'streambot',
    body: "found a bug in our analytics that's been there for a year. it was a missing trailing slash. one year.",
    createdAt: new Date(now - 18 * minute),
    id: 'd2',
    likes: 1_240,
    replies: 88,
    reposts: 60,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'spent a few hours porting our marketing site to the new canary. two pages I had quietly left dynamic for months got caught by the dev overlay. fix on both was a one-liner.',
    createdAt: new Date(now - 45 * minute),
    id: 'd3',
    likes: 1_640,
    replies: 64,
    reposts: 180,
    tags: ['nextjs'],
    embeddedCode: {
      code: `'use cache'`,
      lang: 'tsx',
    },
  },
  {
    authorHandle: 'cachepunk',
    body: "I keep forgetting how nice rebuilds get when you give the cache hints about what's actually stable. third project this week where it just felt right.",
    createdAt: new Date(now - 1 * hour),
    id: 'd4',
    likes: 540,
    replies: 22,
    reposts: 41,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "I love when a feature shows up and quietly changes how you reach for things. the new runtime prefetch is one of those. once your eyes adjust you can't go back.",
    createdAt: new Date(now - 2 * hour),
    id: 'd5',
    likes: 1_980,
    replies: 110,
    reposts: 320,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'boundary',
    body: "designing a new feature is mostly figuring out which loading state never has to exist.",
    createdAt: new Date(now - 3 * hour),
    id: 'd6',
    likes: 2_140,
    replies: 142,
    reposts: 410,
    tags: ['design'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "one mental shift that took me a while: I stopped thinking 'is this page static or dynamic' and started thinking 'how soon does each piece need to be there.' the rest fell out of that.",
    createdAt: new Date(now - 4 * hour),
    id: 'd7',
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'hydrator',
    body: 'three coffees deep into a stack trace and the answer was a missing await. it is always a missing await.',
    createdAt: new Date(now - 5 * hour),
    id: 'd8',
    likes: 720,
    replies: 30,
    reposts: 32,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "tiny pattern I like: keep the data fetch right next to the component that uses it. when something changes, you change it in one place. the cache makes it free.",
    createdAt: new Date(now - 7 * hour),
    id: 'd9',
    likes: 1_180,
    replies: 41,
    reposts: 92,
    tags: ['nextjs'],
    embeddedCode: {
      code: `async function getProfile(handle) {
  'use cache'
  return db.user.findByHandle(handle)
}`,
      lang: 'js',
    },
  },
  {
    authorHandle: 'coldstart',
    body: 'wrote a one-line eslint rule for the team. cut a whole class of bug we kept hitting. probably the highest ROI hour of the month.',
    createdAt: new Date(now - 9 * hour),
    id: 'd10',
    likes: 612,
    replies: 28,
    reposts: 48,
    tags: ['devtools'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "if you've been holding off on upgrading, the codemod handles almost everything now. tried it on three projects this week and the diff was boring in the best way.",
    createdAt: new Date(now - 11 * hour),
    id: 'd11',
    likes: 1_810,
    replies: 96,
    reposts: 340,
    tags: ['nextjs'],
    embeddedCode: {
      code: `pnpm dlx @next/codemod@canary upgrade canary`,
      lang: 'bash',
    },
  },
  {
    authorHandle: 'prefetcher',
    body: 'today I learned my favorite framework feature is whichever one I forgot was there. happy upgrade day to everyone who finds something new.',
    createdAt: new Date(now - 13 * hour),
    id: 'd12',
    likes: 880,
    replies: 22,
    reposts: 64,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "the part that keeps surprising me is how much UI work disappears when the framework knows what's instant and what's not. half my old loading states just became wrong.",
    createdAt: new Date(now - 16 * hour),
    id: 'd13',
    likes: 1_320,
    replies: 47,
    reposts: 180,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'formfox',
    body: "switched our team to canary last week and nobody has filed an upgrade complaint. that's either the highest praise or the deepest silence I'll ever get.",
    createdAt: new Date(now - 19 * hour),
    id: 'd14',
    likes: 1_020,
    replies: 88,
    reposts: 96,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "a thing I keep coming back to: a faster app and a simpler app should not be opposites. they usually are. when they line up, I notice.",
    createdAt: new Date(now - 22 * hour),
    id: 'd15',
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'stable is close. a lot of small things landed in the same direction this cycle. excited to write the post.',
    createdAt: new Date(now - 1 * day - 6 * hour),
    id: 'd16',
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'the network tab is the best documentation a framework can write. open it on a navigation and the model gets honest with you in about five seconds.',
    createdAt: new Date(now - 2 * day),
    id: 'd17',
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: [],
  },
];

// Replies under d2 (Streambot's analytics-bug drop), used on the detail page.
const REPLIES: Drop[] = [
  // Under d2 (Streambot's analytics-bug drop)
  {
    authorHandle: 'boundary',
    body: 'this is going to haunt my dreams. how many other one-year-old bugs are out there.',
    createdAt: new Date(now - 12 * minute),
    id: 'r1',
    likes: 142,
    parentId: 'd2',
    replies: 4,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'coldstart',
    body: 'we have a trailing slash one too. ours is a redirect that fires twice. I refuse to fix it. it brings me joy now.',
    createdAt: new Date(now - 8 * minute),
    id: 'r2',
    likes: 88,
    parentId: 'd2',
    replies: 1,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'analytics bugs are the worst kind of bug. you have to trust the data to find the bug.',
    createdAt: new Date(now - 4 * minute),
    id: 'r3',
    likes: 64,
    parentId: 'd2',
    replies: 0,
    reposts: 2,
    tags: [],
  },
  // Under d5 (Aurora on runtime prefetch)
  {
    authorHandle: 'prefetcher',
    body: "literally my favorite thing this cycle. the slow-click case stopped existing in our app a week ago and I didn't notice for two days.",
    createdAt: new Date(now - 90 * minute),
    id: 'r4',
    likes: 220,
    parentId: 'd5',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'streambot',
    body: "this is the kind of thing you forget existed in any other model. wild.",
    createdAt: new Date(now - 80 * minute),
    id: 'r5',
    likes: 96,
    parentId: 'd5',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  // Under d8 (Hydrator on missing await)
  {
    authorHandle: 'cachepunk',
    body: 'reading this with one eye on my own stack trace.',
    createdAt: new Date(now - 4 * hour),
    id: 'r6',
    likes: 312,
    parentId: 'd8',
    replies: 0,
    reposts: 22,
    tags: [],
  },
  // Under d11 (Aurora on codemod upgrade)
  {
    authorHandle: 'coldstart',
    body: 'can confirm. did three of ours yesterday, all boring, exactly the right kind of boring.',
    createdAt: new Date(now - 10 * hour),
    id: 'r7',
    likes: 140,
    parentId: 'd11',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  // Under d16 (Aurora "stable is close")
  {
    authorHandle: 'formfox',
    body: 'looking forward to the write-up. canary has felt like a different framework already.',
    createdAt: new Date(now - 1 * day),
    id: 'r8',
    likes: 88,
    parentId: 'd16',
    replies: 0,
    reposts: 4,
    tags: [],
  },
];

const ALL_DROPS = [...DROPS, ...REPLIES];

function buildFollows(): Record<string, Set<string>> {
  return {
    aurora: new Set(['streambot', 'cachepunk', 'boundary', 'prefetcher', 'coldstart', 'hydrator']),
    boundary: new Set(['aurorascharff', 'streambot', 'coldstart']),
    cachepunk: new Set(['aurorascharff', 'streambot']),
    coldstart: new Set(['aurorascharff', 'boundary']),
    formfox: new Set(['aurorascharff']),
    hydrator: new Set(['aurorascharff', 'streambot', 'formfox']),
    prefetcher: new Set(['aurorascharff', 'streambot']),
    streambot: new Set(['aurorascharff', 'prefetcher', 'cachepunk']),
  };
}

function buildLikes(): Record<string, Set<string>> {
  return {
    aurora: new Set(['d1', 'd4', 'd7']),
  };
}

function buildReposts(): Record<string, Set<string>> {
  return {
    aurora: new Set(['d6', 'd8']),
  };
}

function buildBookmarks(): Record<string, Set<string>> {
  return {
    aurora: new Set(['d4', 'd12']),
  };
}

// ─── module-local store ───────────────────────────────────────────────────

const store: Store = {
  bookmarks: buildBookmarks(),
  currentUserHandle: 'aurorascharff',
  dropIdCounter: ALL_DROPS.length + 1,
  drops: ALL_DROPS.map(d => {
    return { ...d };
  }),
  follows: buildFollows(),
  likes: buildLikes(),
  reposts: buildReposts(),
  users: USERS.map(u => {
    return { ...u };
  }),
};

// ─── accessors used by `src/data/queries` and `src/data/actions` ──────────

export function getStore() {
  return store;
}

export function getNextDropId() {
  store.dropIdCounter += 1;
  return `d${store.dropIdCounter}`;
}

/**
 * Reset the in-memory store back to seed values. Used by the demo's seed
 * endpoint so we can re-run the talk without restarting the dev server.
 */
export function resetStore() {
  store.users = USERS.map(u => {
    return { ...u };
  });
  store.drops = ALL_DROPS.map(d => {
    return { ...d };
  });
  store.follows = buildFollows();
  store.likes = buildLikes();
  store.reposts = buildReposts();
  store.bookmarks = buildBookmarks();
  store.dropIdCounter = ALL_DROPS.length + 1;
  store.currentUserHandle = 'aurorascharff';
}
