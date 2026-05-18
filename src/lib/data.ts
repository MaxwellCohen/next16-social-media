/**
 * In-memory store for the demo. Reseeds on every server restart.
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
  parentId?: string;
};

export type Tag = {
  name: string;
  count: number;
};

type Store = {
  users: User[];
  drops: Drop[];
  follows: Record<string, Set<string>>;
  likes: Record<string, Set<string>>;
  reposts: Record<string, Set<string>>;
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
    bio: "Frontend lead. Reading source code so you don't have to.",
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
    body: 'shipped optimistic reactions on Drop today. the heart and repost counts update instantly while the server catches up — feels like the app got a free upgrade.',
    createdAt: new Date(now - 8 * minute),
    id: 'd1',
    likes: 940,
    replies: 32,
    reposts: 140,
    tags: ['drop'],
  },
  {
    authorHandle: 'vex',
    body: 'we replaced our entire image upload pipeline with a single edge function this weekend. p95 went from 1800ms to 220ms. four engineers, four years, deleted in a saturday.',
    createdAt: new Date(now - 18 * minute),
    id: 'd2',
    likes: 1_240,
    replies: 88,
    reposts: 60,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'new on Drop: code snippets. wrap anything in triple backticks and it ships through Shiki with the Vercel docs theme. look what we made:',
    createdAt: new Date(now - 45 * minute),
    embeddedCode: {
      code: `export async function CodeBlock({ lang, code }) {
  const html = await highlight(code, lang)
  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}`,
      lang: 'tsx',
    },
    id: 'd3',
    likes: 1_640,
    replies: 64,
    reposts: 180,
    tags: ['drop', 'shiki'],
  },
  {
    authorHandle: 'quill',
    body: 'the new design system is live. one variable for radius, one for shadow, one for motion. our buttons finally agree with each other.',
    createdAt: new Date(now - 1 * hour),
    id: 'd4',
    likes: 540,
    replies: 22,
    reposts: 41,
    tags: ['design'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'real-time replies on Drop are live. nothing fancy — server actions, useOptimistic, and a small Suspense boundary. typing → on screen in one frame.',
    createdAt: new Date(now - 2 * hour),
    id: 'd5',
    likes: 1_980,
    replies: 110,
    reposts: 320,
    tags: ['drop'],
  },
  {
    authorHandle: 'onyx',
    body: 'we replaced our 12-step onboarding with a single page that asks 3 questions. signups doubled in the first week. sometimes the best feature is the four you delete.',
    createdAt: new Date(now - 3 * hour),
    id: 'd6',
    likes: 2_140,
    replies: 142,
    reposts: 410,
    tags: ['product'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'added a follow button to profiles. it actually does something now. you can follow vex and watch their build logs come in at 3am.',
    createdAt: new Date(now - 4 * hour),
    id: 'd7',
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ['drop'],
  },
  {
    authorHandle: 'wren',
    body: 'spent the morning rewriting our search box. it now ranks results by recency, not alphabet. our PMs are weeping with joy.',
    createdAt: new Date(now - 5 * hour),
    id: 'd8',
    likes: 720,
    replies: 30,
    reposts: 32,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'look at this — the entire feed query for Drop is ten lines. cached by tag, invalidated by action, and every component fetches what it needs.',
    createdAt: new Date(now - 7 * hour),
    embeddedCode: {
      code: `export const getFeed = cache(async () => {
  'use cache'
  cacheTag('feed')
  return getStore().drops
    .filter(d => !d.parentId)
    .sort((a, b) => b.createdAt - a.createdAt)
})`,
      lang: 'ts',
    },
    id: 'd9',
    likes: 1_180,
    replies: 41,
    reposts: 92,
    tags: ['drop'],
  },
  {
    authorHandle: 'cinder',
    body: 'shipped a CLI today that bootstraps a new internal tool in under 60 seconds. boring problem, boring solution, saves us an hour every time someone joins.',
    createdAt: new Date(now - 9 * hour),
    id: 'd10',
    likes: 612,
    replies: 28,
    reposts: 48,
    tags: ['devtools'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'bookmarks are working on Drop. private to you, persist across reloads, render with the right icon state without any client round-trip. invalidation is one line:',
    createdAt: new Date(now - 11 * hour),
    embeddedCode: {
      code: 'updateTag(`bookmarks-${handle}`)',
      lang: 'ts',
    },
    id: 'd11',
    likes: 1_810,
    replies: 96,
    reposts: 340,
    tags: ['drop'],
  },
  {
    authorHandle: 'halo',
    body: 'side project of the weekend: a tiny menu bar app that nags me to drink water. it is annoying and effective, which is the highest praise software can get.',
    createdAt: new Date(now - 13 * hour),
    id: 'd12',
    likes: 880,
    replies: 22,
    reposts: 64,
    tags: ['sideproject'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Drop has a real theme toggle now. light, dark, and system. shiki swaps grammars to match. look what we made — three buttons that finally do what they say.',
    createdAt: new Date(now - 16 * hour),
    id: 'd13',
    likes: 1_320,
    replies: 47,
    reposts: 180,
    tags: ['drop', 'design'],
  },
  {
    authorHandle: 'echo',
    body: 'we shipped a new pricing page. for the first time it is honestly readable on a phone. our designer cried. our CFO cried. different reasons.',
    createdAt: new Date(now - 19 * hour),
    id: 'd14',
    likes: 1_020,
    replies: 88,
    reposts: 96,
    tags: ['product'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "trending tags on Drop. counts come from a cached query, updateTag('trending') keeps it honest. nothing about it lives on the client.",
    createdAt: new Date(now - 22 * hour),
    id: 'd15',
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: ['drop'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'the Drop talk demo is feature-complete. feed, replies, follows, bookmarks, reposts, theming, code snippets, optimistic everything. amsterdam, see you soon.',
    createdAt: new Date(now - 1 * day - 6 * hour),
    id: 'd16',
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ['reactsummit', 'drop'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'every feature in Drop is a server component plus a server action plus a tiny client island. nothing else. look what we made out of three primitives.',
    createdAt: new Date(now - 2 * day),
    id: 'd17',
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: ['drop'],
  },
];

const REPLIES: Drop[] = [
  {
    authorHandle: 'onyx',
    body: 'four engineers four years vs one weekend is the realest performance graph in our industry.',
    createdAt: new Date(now - 12 * minute),
    id: 'r1',
    likes: 142,
    parentId: 'd2',
    replies: 4,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'this is the kind of "look what we made" drop I built this app for. show it off, vex.',
    createdAt: new Date(now - 8 * minute),
    id: 'r2',
    likes: 88,
    parentId: 'd2',
    replies: 1,
    reposts: 3,
    tags: ['drop'],
  },
  {
    authorHandle: 'cinder',
    body: 'p95 220ms is wild. did you keep the old pipeline around for the dashboard screenshot?',
    createdAt: new Date(now - 4 * minute),
    id: 'r3',
    likes: 64,
    parentId: 'd2',
    replies: 0,
    reposts: 2,
    tags: [],
  },
  {
    authorHandle: 'quill',
    body: "the reply composer feel is so satisfying. it shouldn't be this hard to nail, but it is, and you nailed it.",
    createdAt: new Date(now - 90 * minute),
    id: 'r4',
    likes: 220,
    parentId: 'd5',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'fully stealing the optimistic count pattern for our app. clean as a whistle.',
    createdAt: new Date(now - 80 * minute),
    id: 'r5',
    likes: 96,
    parentId: 'd5',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'halo',
    body: 'ranking by recency is the cheat code nobody admits. you saved your team months of arguing.',
    createdAt: new Date(now - 4 * hour),
    id: 'r6',
    likes: 312,
    parentId: 'd8',
    replies: 0,
    reposts: 22,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: "one-line invalidation is the dream. we're refactoring our bookmarks app to look like this.",
    createdAt: new Date(now - 10 * hour),
    id: 'r7',
    likes: 140,
    parentId: 'd11',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'see you in amsterdam. bringing my laptop in case anything explodes live.',
    createdAt: new Date(now - 1 * day),
    id: 'r8',
    likes: 88,
    parentId: 'd16',
    replies: 0,
    reposts: 4,
    tags: ['reactsummit'],
  },
];

const ALL_DROPS = [...DROPS, ...REPLIES];

function buildFollows(): Record<string, Set<string>> {
  return {
    aurorascharff: new Set(['vex', 'quill', 'onyx', 'wren', 'cinder']),
    cinder: new Set(['aurorascharff', 'vex', 'quill']),
    echo: new Set(['aurorascharff']),
    halo: new Set(['aurorascharff', 'vex', 'echo']),
    onyx: new Set(['aurorascharff', 'vex']),
    quill: new Set(['aurorascharff', 'wren']),
    vex: new Set(['aurorascharff', 'onyx', 'cinder']),
    wren: new Set(['aurorascharff', 'quill']),
  };
}

function buildLikes(): Record<string, Set<string>> {
  return {
    aurorascharff: new Set(['d2', 'd4', 'd8', 'd10']),
  };
}

function buildReposts(): Record<string, Set<string>> {
  return {
    aurorascharff: new Set(['d6', 'd8']),
  };
}

function buildBookmarks(): Record<string, Set<string>> {
  return {
    aurorascharff: new Set(['d2', 'd12']),
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
 * Reset the in-memory store back to seed values.
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
