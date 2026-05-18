import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDrop, getReplies } from '@/data/queries/drop';
import { getUserByHandle } from '@/data/queries/user';
import { Drop, DropDetailSkeleton, DropSkeleton } from '@/features/drop/components/Drop';
import { ReplyComposerForm } from '@/features/drop/components/ReplyComposerForm';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/drop/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const drop = await getDrop(id);
  const author = await getUserByHandle(drop.authorHandle);
  const title = `${author.displayName} on Drop`;
  const description = drop.body.length > 160 ? `${drop.body.slice(0, 157)}…` : drop.body;
  const url = `/drop/${id}`;
  return {
    alternates: { canonical: url },
    description,
    openGraph: { authors: [author.displayName], description, title, type: 'article', url },
    title,
    twitter: { card: 'summary_large_image', creator: `@${author.handle}`, description, title },
  };
}

export const unstable_prefetch = 'force-runtime';

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
        <h1 className="text-lg font-bold tracking-tight">Drop</h1>
      </header>
      <Suspense fallback={<DropDetailSkeleton />}>
        <DropPageBody params={params} />
      </Suspense>
    </div>
  );
}

async function DropPageBody({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drop = await getDrop(id);
  return (
    <>
      <Drop drop={drop} detail />
      <section className="border-divider/70 dark:border-divider-dark/70 border-b p-4 sm:p-5">
        <ReplyComposerForm
          dropId={id}
          avatar={
            <Suspense fallback={<UserAvatarSkeleton size="md" />}>
              <UserAvatar />
            </Suspense>
          }
        />
      </section>
      <Suspense fallback={<RepliesLoading />}>
        <Replies id={id} />
      </Suspense>
    </>
  );
}

async function Replies({ id }: { id: string }) {
  const replies = await getReplies(id);
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
