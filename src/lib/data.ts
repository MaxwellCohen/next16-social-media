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
    body: 'one directive turns any function into a cached server function. opt in per-component instead of per-route.',
    createdAt: new Date(now - 8 * minute),
    embeddedCode: {
      code: `async function getDrop(id) {
  'use cache'
  return db.drops.findById(id)
}`,
      lang: 'ts',
    },
    id: 'd1',
    likes: 940,
    replies: 32,
    reposts: 140,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'vex',
    body: "tags + updateTag is the cleanest invalidation story i've used. no router refresh dance, no client round-trip.",
    createdAt: new Date(now - 18 * minute),
    embeddedCode: {
      code: `'use cache'
cacheTag('feed')
// later, in an action:
updateTag('feed')`,
      lang: 'ts',
    },
    id: 'd2',
    likes: 1_240,
    replies: 88,
    reposts: 60,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'optimistic UI is now a few lines. snap the state, fire the action, react reconciles when the server agrees.',
    createdAt: new Date(now - 45 * minute),
    embeddedCode: {
      code: `const [count, addOptimistic] = useOptimistic(likes, n => n + 1)
startTransition(() => {
  addOptimistic()
  toggleLike(id)
})`,
      lang: 'tsx',
    },
    id: 'd3',
    likes: 1_640,
    replies: 64,
    reposts: 180,
    tags: ['react19'],
  },
  {
    authorHandle: 'quill',
    body: 'params is a promise now. await it where you need it. the rest of the page streams while it resolves.',
    createdAt: new Date(now - 1 * hour),
    embeddedCode: {
      code: `export default async function Page({ params }) {
  const { id } = await params
  return <Drop id={id} />
}`,
      lang: 'tsx',
    },
    id: 'd4',
    likes: 540,
    replies: 22,
    reposts: 41,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'private cache for per-user data. same primitive, scoped to the request. bookmarks, drafts, feeds you own.',
    createdAt: new Date(now - 2 * hour),
    embeddedCode: {
      code: `async function getBookmarks(handle) {
  'use cache: private'
  cacheTag(\`bookmarks-\${handle}\`)
  return db.bookmarks.byHandle(handle)
}`,
      lang: 'ts',
    },
    id: 'd5',
    likes: 1_980,
    replies: 110,
    reposts: 320,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'onyx',
    body: 'co-locating data with the component that needs it sounds obvious. then you do it and the codebase gets noticeably smaller.',
    createdAt: new Date(now - 3 * hour),
    id: 'd6',
    likes: 2_140,
    replies: 142,
    reposts: 410,
    tags: ['nextjs', 'patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'suspense boundaries are where the streaming story lives. wrap the slow bit, let the rest paint.',
    createdAt: new Date(now - 4 * hour),
    embeddedCode: {
      code: `<Suspense fallback={<FeedSkeleton />}>
  <Feed />
</Suspense>`,
      lang: 'tsx',
    },
    id: 'd7',
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ['react19'],
  },
  {
    authorHandle: 'wren',
    body: 'cachelife lets you say how fresh a value needs to be without writing your own ttl logic. small thing, ships every time.',
    createdAt: new Date(now - 5 * hour),
    embeddedCode: {
      code: `'use cache'
cacheLife('hours')
return getTrendingTags()`,
      lang: 'ts',
    },
    id: 'd8',
    likes: 720,
    replies: 30,
    reposts: 32,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'useactionstate handles the form lifecycle: pending, errors, success. one hook, no extra state.',
    createdAt: new Date(now - 7 * hour),
    embeddedCode: {
      code: `const [state, action, pending] = useActionState(postDrop, null)
return <form action={action}>...</form>`,
      lang: 'tsx',
    },
    id: 'd9',
    likes: 1_180,
    replies: 41,
    reposts: 92,
    tags: ['react19'],
  },
  {
    authorHandle: 'cinder',
    body: 'the rsc payload is just data. once that clicks, the rest of the model gets quieter.',
    createdAt: new Date(now - 9 * hour),
    id: 'd10',
    likes: 612,
    replies: 28,
    reposts: 48,
    tags: ['rsc'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'the cache components flag is opt-in for now. flip it and everything reads from a tagged, per-component cache.',
    createdAt: new Date(now - 11 * hour),
    embeddedCode: {
      code: `// next.config.ts
export default {
  cacheComponents: true,
}`,
      lang: 'ts',
    },
    id: 'd11',
    likes: 1_810,
    replies: 96,
    reposts: 340,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'halo',
    body: 'finally building things server-first again. less coordination, less state, less to debug.',
    createdAt: new Date(now - 13 * hour),
    id: 'd12',
    likes: 880,
    replies: 22,
    reposts: 64,
    tags: ['rsc'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "server actions are just functions. you import them into a client component and call them. that's the whole api.",
    createdAt: new Date(now - 16 * hour),
    embeddedCode: {
      code: `'use server'
export async function toggleLike(id) {
  await db.likes.toggle(id)
  updateTag(\`drop-\${id}\`)
}`,
      lang: 'ts',
    },
    id: 'd13',
    likes: 1_320,
    replies: 47,
    reposts: 180,
    tags: ['react19'],
  },
  {
    authorHandle: 'echo',
    body: "we tried cache components on a real codebase this week. removed a lot of effects. didn't replace them with anything.",
    createdAt: new Date(now - 19 * hour),
    id: 'd14',
    likes: 1_020,
    replies: 88,
    reposts: 96,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'streaming + suspense + tags is the trio. learn those three and most of the app router feels obvious.',
    createdAt: new Date(now - 22 * hour),
    id: 'd15',
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: ['nextjs', 'patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: '16.3 lands soon. async react patterns get a real home. excited for next week.',
    createdAt: new Date(now - 1 * day - 6 * hour),
    id: 'd16',
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ['nextjs', 'reactsummit'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'every async react pattern in this app comes back to one rule: do the work close to the thing that uses it.',
    createdAt: new Date(now - 2 * day),
    id: 'd17',
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: ['patterns'],
  },
];

const REPLIES: Drop[] = [
  {
    authorHandle: 'onyx',
    body: 'we just rewrote our invalidation layer around this. so much less code.',
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
    body: 'this is the part i wish i had two years ago.',
    createdAt: new Date(now - 8 * minute),
    id: 'r2',
    likes: 88,
    parentId: 'd2',
    replies: 1,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'cinder',
    body: "does cacheTag accept multiple tags? we'd invalidate by user + by feed.",
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
    body: 'first time useOptimistic + a transition felt obvious. the suspense pieces lined up around it.',
    createdAt: new Date(now - 90 * minute),
    id: 'r4',
    likes: 220,
    parentId: 'd3',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: "we kept reaching for client state for this. won't anymore.",
    createdAt: new Date(now - 80 * minute),
    id: 'r5',
    likes: 96,
    parentId: 'd3',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'halo',
    body: 'cachelife is doing a lot more for me than i expected. one line, and the dashboard just feels right.',
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
    body: 'switching to cacheComponents in our app. the flag is the easy part.',
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

export function getStore() {
  return store;
}

export function getNextDropId() {
  store.dropIdCounter += 1;
  return `d${store.dropIdCounter}`;
}

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
