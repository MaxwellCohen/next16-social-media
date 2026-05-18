/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

type SeedUser = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  followers: number;
  following: number;
};

type SeedDrop = {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: Date;
  likes: number;
  replies: number;
  reposts: number;
  tags: string[];
  embeddedCode?: { lang: string; code: string };
  parentId?: string;
};

const now = Date.now();
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

const USERS: SeedUser[] = [
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

const DROPS: SeedDrop[] = [
  {
    authorHandle: 'aurorascharff',
    body: 'One directive turns any function into a cached server function. Opt in per-component instead of per-route.',
    createdAt: new Date(now - 8 * minute),
    embeddedCode: {
      code: "async function getDrop(id) {\n  'use cache'\n  return db.drops.findById(id)\n}",
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
      code: 'const [count, addOptimistic] = useOptimistic(likes, n => n + 1)\nstartTransition(() => {\n  addOptimistic()\n  toggleLike(id)\n})',
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
      code: "async function getBookmarks(handle) {\n  'use cache: private'\n  cacheTag(`bookmarks-${handle}`)\n  return db.bookmarks.byHandle(handle)\n}",
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
    embeddedCode: { code: '<Suspense fallback={<FeedSkeleton />}>\n  <Feed />\n</Suspense>', lang: 'tsx' },
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
      code: 'const [state, action, pending] = useActionState(postDrop, null)\nreturn <form action={action}>...</form>',
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
    embeddedCode: { code: '// next.config.ts\nexport default {\n  cacheComponents: true,\n}', lang: 'ts' },
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
      code: "'use server'\nexport async function toggleLike(id) {\n  await db.likes.toggle(id)\n  updateTag(`drop-${id}`)\n}",
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
  {
    authorHandle: 'wren',
    body: "Spent the weekend vibe-coding a little tool that compares my Spotify history against my partner's. Just shipped it for the two of us. Tiny audience, big smile.",
    createdAt: new Date(now - 36 * minute),
    id: 'd18',
    likes: 612,
    replies: 0,
    reposts: 14,
    tags: ['shipping'],
  },
  {
    authorHandle: 'cinder',
    body: 'Released a 90-line app that turns my voice memos into to-do items. It will never get a landing page. I use it every morning.',
    createdAt: new Date(now - 90 * minute),
    id: 'd19',
    likes: 480,
    replies: 0,
    reposts: 18,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "The thing nobody tells you about shipping small: the smaller it is, the more honest it feels. The app I'm proudest of this year is 240 lines and three people use it.",
    createdAt: new Date(now - 2 * hour - 20 * minute),
    id: 'd20',
    likes: 2_140,
    replies: 0,
    reposts: 410,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: "Drafting in public for the first time. The conference badge generator I have been threatening to build for two summers is finally a real URL. v0.1, but it's a URL.",
    createdAt: new Date(now - 3 * hour - 30 * minute),
    id: 'd21',
    likes: 360,
    replies: 0,
    reposts: 22,
    tags: ['shipping'],
  },
  {
    authorHandle: 'vex',
    body: "Built a thing this afternoon that emails me a single sentence every Sunday: what did you make this week? It's the only newsletter I subscribe to where I'm both writer and reader.",
    createdAt: new Date(now - 5 * hour),
    id: 'd22',
    likes: 720,
    replies: 0,
    reposts: 28,
    tags: ['shipping'],
  },
  {
    authorHandle: 'echo',
    body: "Vibe-coded a tiny CRM for the dog walker my building hired. Took an evening, costs $0/mo, replaces a spreadsheet that was making her stop walking. Shipping doesn't need a roadmap.",
    createdAt: new Date(now - 7 * hour),
    id: 'd23',
    likes: 880,
    replies: 0,
    reposts: 42,
    tags: ['shipping'],
  },
  {
    authorHandle: 'quill',
    body: "Made a one-pager that explains my partner's job to my mom. It's the most read thing I'll ship this year. Sometimes the audience is small on purpose.",
    createdAt: new Date(now - 10 * hour),
    id: 'd24',
    likes: 540,
    replies: 0,
    reposts: 16,
    tags: ['shipping'],
  },
  {
    authorHandle: 'onyx',
    body: "Released the Sunday-night reading list I've been keeping in Notes for a year. The whole point is it doesn't grow on a schedule. I drop a link when I find one I trust.",
    createdAt: new Date(now - 14 * hour),
    id: 'd25',
    likes: 410,
    replies: 0,
    reposts: 12,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Encouragement nobody asked for: ship the thing that has one user. It teaches you more than the thing with the polished pitch deck.',
    createdAt: new Date(now - 28 * hour),
    id: 'd26',
    likes: 1_640,
    replies: 0,
    reposts: 240,
    tags: ['shipping'],
  },
];

const REPLIES: SeedDrop[] = [
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
  {
    authorHandle: 'aurorascharff',
    body: 'Backstage tickets are flying — say hi if you spot the pink hoodie.',
    createdAt: new Date(now - 22 * hour),
    id: 'r9',
    likes: 140,
    parentId: 'd16',
    replies: 0,
    reposts: 12,
    tags: ['reactsummit'],
  },
  {
    authorHandle: 'wren',
    body: 'Just refactored a whole admin panel onto server actions in an afternoon. Two years ago that was two sprints.',
    createdAt: new Date(now - 6 * hour),
    id: 'r10',
    likes: 64,
    parentId: 'd1',
    replies: 0,
    reposts: 2,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'This is why we keep the data layer boring. The interesting stuff goes in the UI.',
    createdAt: new Date(now - 5 * hour),
    id: 'r11',
    likes: 188,
    parentId: 'd1',
    replies: 0,
    reposts: 14,
    tags: [],
  },
  {
    authorHandle: 'cinder',
    body: 'Optimistic UI with a transition still feels like cheating. In a good way.',
    createdAt: new Date(now - 2 * hour),
    id: 'r12',
    likes: 96,
    parentId: 'd4',
    replies: 0,
    reposts: 3,
    tags: ['react19'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'The trick is letting the transition own the pending state — the rest is just a list of operations.',
    createdAt: new Date(now - 100 * minute),
    id: 'r13',
    likes: 220,
    parentId: 'd4',
    replies: 0,
    reposts: 18,
    tags: ['react19'],
  },
  {
    authorHandle: 'halo',
    body: 'Cache tags + revalidate is the part I never want to give up again.',
    createdAt: new Date(now - 9 * hour),
    id: 'r14',
    likes: 132,
    parentId: 'd5',
    replies: 0,
    reposts: 7,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Once you start thinking in tags, the cache stops being a cache and starts being part of your data model.',
    createdAt: new Date(now - 8 * hour),
    id: 'r15',
    likes: 264,
    parentId: 'd5',
    replies: 0,
    reposts: 21,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: 'We finally deleted the useEffect that re-fetched on focus. It was haunting us for years.',
    createdAt: new Date(now - 14 * hour),
    id: 'r16',
    likes: 312,
    parentId: 'd6',
    replies: 0,
    reposts: 22,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Every useEffect you delete is a small celebration in our team channel.',
    createdAt: new Date(now - 13 * hour),
    id: 'r17',
    likes: 410,
    parentId: 'd6',
    replies: 0,
    reposts: 36,
    tags: [],
  },
  {
    authorHandle: 'onyx',
    body: 'Streaming with Suspense + cache components made a 4s LCP page feel instant. Real measurement, not vibes.',
    createdAt: new Date(now - 18 * hour),
    id: 'r18',
    likes: 280,
    parentId: 'd7',
    replies: 0,
    reposts: 24,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "And the static shell is doing real work — it's not just the visual frame.",
    createdAt: new Date(now - 17 * hour),
    id: 'r19',
    likes: 188,
    parentId: 'd7',
    replies: 0,
    reposts: 14,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'quill',
    body: 'Server components changed how I review PRs more than any tooling change in the last decade.',
    createdAt: new Date(now - 26 * hour),
    id: 'r20',
    likes: 220,
    parentId: 'd9',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "Reviews got shorter because the surface area got smaller. That's been the real win.",
    createdAt: new Date(now - 25 * hour),
    id: 'r21',
    likes: 196,
    parentId: 'd9',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'Action props on design components is the pattern I keep stealing.',
    createdAt: new Date(now - 30 * hour),
    id: 'r22',
    likes: 88,
    parentId: 'd10',
    replies: 0,
    reposts: 5,
    tags: ['patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: "It's the smallest API that still gives you the whole async story for free.",
    createdAt: new Date(now - 29 * hour),
    id: 'r23',
    likes: 142,
    parentId: 'd10',
    replies: 0,
    reposts: 9,
    tags: ['patterns'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Replies are a great place to test cacheLife. Short, fresh, low risk if stale.',
    createdAt: new Date(now - 40 * minute),
    id: 'r24',
    likes: 96,
    parentId: 'd11',
    replies: 0,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'And the optimistic count never lies, because the action invalidates the right tag anyway.',
    createdAt: new Date(now - 30 * minute),
    id: 'r25',
    likes: 132,
    parentId: 'd11',
    replies: 0,
    reposts: 5,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'The two-user app is undefeated. Mine this year was a chore-rotation thing for my partner and me.',
    createdAt: new Date(now - 28 * minute),
    id: 'r26',
    likes: 220,
    parentId: 'd18',
    replies: 0,
    reposts: 18,
    tags: ['shipping'],
  },
  {
    authorHandle: 'cinder',
    body: "Selfishly shipping is so underrated. The bar moves from 'will users love it' to 'do I love it'.",
    createdAt: new Date(now - 1 * hour),
    id: 'r27',
    likes: 142,
    parentId: 'd20',
    replies: 0,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: "240 lines, three users, one of which is your mom. That's the dream rollout.",
    createdAt: new Date(now - 90 * minute),
    id: 'r28',
    likes: 96,
    parentId: 'd20',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: "Honestly the friction of shipping a real URL is the whole exercise. Once it's at a URL it counts.",
    createdAt: new Date(now - 2 * hour),
    id: 'r29',
    likes: 188,
    parentId: 'd21',
    replies: 0,
    reposts: 12,
    tags: ['shipping'],
  },
  {
    authorHandle: 'wren',
    body: "I'd subscribe to a newsletter where the only rule is 'one sentence about what you made'.",
    createdAt: new Date(now - 4 * hour),
    id: 'r30',
    likes: 88,
    parentId: 'd22',
    replies: 0,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Replacing a spreadsheet is one of the most useful things software can do for a real person.',
    createdAt: new Date(now - 6 * hour),
    id: 'r31',
    likes: 240,
    parentId: 'd23',
    replies: 0,
    reposts: 16,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: 'Audience-of-one apps are a vibe. Mine is a tiny pantry tracker that nags me about my chickpeas.',
    createdAt: new Date(now - 9 * hour),
    id: 'r32',
    likes: 132,
    parentId: 'd24',
    replies: 0,
    reposts: 6,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurorascharff',
    body: 'Slow-grow lists are the best lists. The pressure to publish weekly is what kills good reading.',
    createdAt: new Date(now - 13 * hour),
    id: 'r33',
    likes: 156,
    parentId: 'd25',
    replies: 0,
    reposts: 8,
    tags: [],
  },
];

const FOLLOWS: Record<string, string[]> = {
  aurorascharff: ['vex', 'quill', 'onyx', 'wren', 'cinder'],
  cinder: ['aurorascharff', 'vex', 'quill'],
  echo: ['aurorascharff'],
  halo: ['aurorascharff', 'vex', 'echo'],
  onyx: ['aurorascharff', 'vex'],
  quill: ['aurorascharff', 'wren'],
  vex: ['aurorascharff', 'onyx', 'cinder'],
  wren: ['aurorascharff', 'quill'],
};

const LIKES: Record<string, string[]> = {
  aurorascharff: ['d2', 'd4', 'd8', 'd10'],
};

const REPOSTS: Record<string, string[]> = {
  aurorascharff: ['d6', 'd8'],
};

const BOOKMARKS: Record<string, string[]> = {
  aurorascharff: ['d2', 'd12'],
};

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  console.log('Clearing existing data...');
  await prisma.like.deleteMany();
  await prisma.repost.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.user.deleteMany();

  console.log('Inserting users...');
  for (const u of USERS) {
    await prisma.user.create({ data: u });
  }

  console.log('Inserting drops...');
  for (const d of [...DROPS, ...REPLIES]) {
    await prisma.drop.create({
      data: {
        authorHandle: d.authorHandle,
        body: d.body,
        createdAt: d.createdAt,
        embeddedCode: d.embeddedCode?.code,
        embeddedLang: d.embeddedCode?.lang,
        id: d.id,
        likeCount: d.likes,
        parentId: d.parentId,
        replyCount: d.replies,
        repostCount: d.reposts,
        tags: d.tags.join(','),
      },
    });
  }

  console.log('Reconciling reply counts...');
  const parents = await prisma.drop.groupBy({
    _count: { _all: true },
    by: ['parentId'],
    where: { parentId: { not: null } },
  });
  await prisma.drop.updateMany({ data: { replyCount: 0 }, where: { parentId: null } });
  for (const p of parents) {
    if (!p.parentId) continue;
    await prisma.drop.update({ data: { replyCount: p._count._all }, where: { id: p.parentId } });
  }

  console.log('Inserting follows...');
  for (const [follower, targets] of Object.entries(FOLLOWS)) {
    for (const target of targets) {
      await prisma.follow.create({ data: { followerHandle: follower, targetHandle: target } });
    }
  }

  console.log('Inserting likes...');
  for (const [user, drops] of Object.entries(LIKES)) {
    for (const dropId of drops) {
      await prisma.like.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log('Inserting reposts...');
  for (const [user, drops] of Object.entries(REPOSTS)) {
    for (const dropId of drops) {
      await prisma.repost.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log('Inserting bookmarks...');
  for (const [user, drops] of Object.entries(BOOKMARKS)) {
    for (const dropId of drops) {
      await prisma.bookmark.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log(`Seeded ${USERS.length} users, ${DROPS.length + REPLIES.length} drops`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
