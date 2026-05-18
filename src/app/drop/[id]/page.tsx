import { Suspense } from 'react';
import { ReplyComposerForm, ReplyComposerFormSkeleton } from '@/app/drop/[id]/_components/ReplyComposerForm';
import { Drop, DropSkeleton } from '@/components/Drop';
import { UserAvatar, UserAvatarSkeleton } from '@/components/UserAvatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDrop, getReplies } from '@/data/queries/drop';

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  const idPromise = params.then(({ id }) => {
    return id;
  });
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
        <h1 className="text-lg font-bold tracking-tight">Drop</h1>
      </header>
      <Suspense fallback={<DropSkeleton />}>
        <DropDetail idPromise={idPromise} />
      </Suspense>
      <section className="border-divider/70 dark:border-divider-dark/70 border-b p-4 sm:p-5">
        <Suspense fallback={<ReplyComposerFormSkeleton />}>
          <ReplyComposerForm
            idPromise={idPromise}
            avatar={
              <Suspense fallback={<UserAvatarSkeleton size="md" />}>
                <UserAvatar />
              </Suspense>
            }
          />
        </Suspense>
      </section>
      <Suspense fallback={<RepliesLoading />}>
        <Replies idPromise={idPromise} />
      </Suspense>
    </div>
  );
}

async function DropDetail({ idPromise }: { idPromise: Promise<string> }) {
  const drop = await getDrop(await idPromise);
  return <Drop drop={drop} detail />;
}

async function Replies({ idPromise }: { idPromise: Promise<string> }) {
  const replies = await getReplies(await idPromise);
  return (
    <section>
      <h2 className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 font-mono text-[11px] tracking-wide uppercase sm:px-5">
        Replies
      </h2>
      {replies.length === 0 ? (
        <EmptyState title="No replies yet" body="Be the first to reply." />
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
