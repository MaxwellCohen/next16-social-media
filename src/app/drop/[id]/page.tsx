import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/drop';
import { ReplyComposer } from '@/components/reply-composer';
import { getDrop, getReplies } from '@/data/queries/drop';

export const unstable_prefetch = 'force-runtime';

type Params = Pick<PageProps<'/drop/[id]'>, 'params'>;

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-10 border-b bg-white/80 px-4 py-4 backdrop-blur sm:px-5 dark:bg-black/80">
        <h1 className="text-lg font-bold tracking-tight">Drop</h1>
      </header>

      <Suspense fallback={<DropSkeleton />}>
        <DropDetail params={params} />
      </Suspense>

      <Suspense>
        <ReplyComposer />
      </Suspense>

      <Suspense fallback={<RepliesLoading />}>
        <Replies params={params} />
      </Suspense>
    </div>
  );
}

async function DropDetail({ params }: Params) {
  const { id } = await params;
  const drop = await getDrop(id);
  if (!drop) notFound();
  return <Drop drop={drop} />;
}

async function Replies({ params }: Params) {
  const { id } = await params;
  const replies = await getReplies(id);

  if (replies.length === 0) {
    return (
      <div className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-5 py-8 text-center text-sm">
        No replies yet.
      </div>
    );
  }

  return (
    <ul>
      {replies.map(reply => {return (
        <li key={reply.id}>
          <Drop drop={reply} compact />
        </li>
      )})}
    </ul>
  );
}

function RepliesLoading() {
  return (
    <ul>
      {Array.from({ length: 2 }).map((_, i) => {return (
        <li key={i}>
          <DropSkeleton />
        </li>
      )})}
    </ul>
  );
}
