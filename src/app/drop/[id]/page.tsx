import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Drop, DropSkeleton } from '@/components/Drop';
import { ReplyComposer, ReplyComposerSkeleton } from '@/app/drop/[id]/_components/ReplyComposer';
import { getDrop, getReplies } from '@/data/queries/drop';

export const unstable_prefetch = 'force-runtime';

type Params = Pick<PageProps<'/drop/[id]'>, 'params'>;

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-10 border-b bg-white px-4 py-4 backdrop-blur sm:px-5 dark:bg-black">
        <h1 className="text-lg font-bold tracking-tight">Drop</h1>
      </header>

      <Suspense fallback={<DropSkeleton />}>
        <DropDetail params={params} />
      </Suspense>

      <Suspense fallback={<ReplyComposerSkeleton />}>
        <ReplyComposerSection params={params} />
      </Suspense>

      <Suspense fallback={<RepliesLoading />}>
        <Replies params={params} />
      </Suspense>
    </div>
  );
}

async function ReplyComposerSection({ params }: Params) {
  const { id } = await params;
  return <ReplyComposer dropId={id} />;
}

async function DropDetail({ params }: Params) {
  const { id } = await params;
  const drop = await getDrop(id);
  if (!drop) notFound();
  return <Drop drop={drop} detail />;
}

async function Replies({ params }: Params) {
  const { id } = await params;
  const replies = await getReplies(id);

  return (
    <section>
      <h2 className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 font-mono text-[11px] tracking-wide uppercase sm:px-5">
        Replies
      </h2>
      {replies.length === 0 ? (
        <div className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-5 py-8 text-center text-sm">
          No replies yet.
        </div>
      ) : (
        <ul>
          {replies.map(reply => {
            return (
              <li key={reply.id}>
                <Drop drop={reply} compact />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function RepliesLoading() {
  return (
    <ul>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <li key={i}>
            <DropSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
