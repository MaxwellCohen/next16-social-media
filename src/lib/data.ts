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
};

const now = Date.now();
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

const USERS: User[] = [
  {
    avatarColor: 'from-pink-500 to-rose-600',
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
    avatarColor: 'from-blue-400 to-blue-700',
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
    avatarColor: 'from-sky-500 to-blue-600',
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
    body: 'One directive turns any function into a cached server function. Opt in per-component instead of per-route.',
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
    body: 'Building the same dashboard twice this week reminded me how much state goes away when the server owns the data.',
    createdAt: new Date(now - 18 * minute),
    id: 'd2',
    likes: 1_240,
    replies: 88,
    reposts: 60,
    tags: ['react'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Optimistic UI is now a few lines. Snap the state, fire the action, React reconciles when the server agrees.',
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
    body: 'Designed three loading states this morning, deleted two before lunch. The right answer was just letting the page paint when it was ready.',
    createdAt: new Date(now - 1 * hour),
    id: 'd4',
    likes: 540,
    replies: 22,
    reposts: 41,
    tags: ['design'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Private cache for per-user data. Same primitive, scoped to the request. Bookmarks, drafts, feeds you own.',
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
    body: 'Co-locating data with the component that needs it sounds obvious. Then you do it and the codebase gets noticeably smaller.',
    createdAt: new Date(now - 3 * hour),
    id: 'd6',
    likes: 2_140,
    replies: 142,
    reposts: 410,
    tags: ['nextjs', 'patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Suspense boundaries are where the streaming story lives. Wrap the slow bit, let the rest paint.',
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
    body: 'Replaced a 200-line state machine with a single async function and a couple of awaits. The diff was almost embarrassing.',
    createdAt: new Date(now - 5 * hour),
    id: 'd8',
    likes: 720,
    replies: 30,
    reposts: 32,
    tags: ['react'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'useActionState handles the form lifecycle: pending, errors, success. One hook, no extra state.',
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
    body: 'The RSC payload is just data. Once that clicks, the rest of the model gets quieter.',
    createdAt: new Date(now - 9 * hour),
    id: 'd10',
    likes: 612,
    replies: 28,
    reposts: 48,
    tags: ['rsc'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'The cacheComponents flag is opt-in for now. Flip it and everything reads from a tagged, per-component cache.',
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
    body: 'Finally building things server-first again. Less coordination, less state, less to debug.',
    createdAt: new Date(now - 13 * hour),
    id: 'd12',
    likes: 880,
    replies: 22,
    reposts: 64,
    tags: ['rsc'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "Server actions are just functions. You import them into a client component and call them. That's the whole API.",
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
    body: "We deleted a lot of useEffect this quarter. It wasn't a plan, it just kept happening. The code that replaced it is shorter and less weird.",
    createdAt: new Date(now - 19 * hour),
    id: 'd14',
    likes: 1_020,
    replies: 88,
    reposts: 96,
    tags: ['react'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Streaming + Suspense + tags is the trio. Learn those three and most of the App Router feels obvious.',
    createdAt: new Date(now - 22 * hour),
    id: 'd15',
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: ['nextjs', 'patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: '16.3 lands soon. Cache Components, runtime prefetch, the whole streaming model gets a real home. Excited for next week.',
    createdAt: new Date(now - 1 * day - 6 * hour),
    id: 'd16',
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ['nextjs', 'reactsummit'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Every pattern in this app comes back to one rule: do the work close to the thing that uses it. Caching, streaming, mutations.',
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
    body: 'Owning the dashboard server-side has been a quiet win for us too. Less state, fewer race conditions, easier reviews.',
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
    body: 'This is the part I wish I had two years ago.',
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
    body: 'Same. The shape of the code follows the shape of the data now, not the other way around.',
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
    body: 'First time useOptimistic + a transition felt obvious. The Suspense pieces lined up around it.',
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
    body: "We kept reaching for client state for this. Won't anymore.",
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
    body: 'Same energy here. The state machine I deleted last week was the proudest piece of code I had a year ago. Felt great.',
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
    body: 'Ours too. The smallest pieces are starting to feel obvious.',
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
    body: 'Counting the days. The async React talk track is the one I keep clearing my calendar for.',
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
