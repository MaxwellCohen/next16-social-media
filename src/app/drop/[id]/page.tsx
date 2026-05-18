import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getDrop, getReplies } from '@/data/queries/drop';
import { getUserByHandle } from '@/data/queries/user';
import { Drop, DropListSkeleton } from '@/features/drop/components/Drop';
import { DropDetail, DropDetailSkeleton } from '@/features/drop/components/DropDetail';
import { ReplyComposerForm } from '@/features/drop/components/ReplyComposerForm';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/UserAvatar';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/drop/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const drop = await getDrop(id);
  const author = await getUserByHandle(drop.authorHandle);
  const snippet = drop.body.length > 60 ? `${drop.body.slice(0, 57).trimEnd()}…` : drop.body;
  const title = `${author.displayName}: ${snippet}`;
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
      <PageHeader>
        <h1 className="text-lg font-bold tracking-tight">Drop</h1>
      </PageHeader>
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
      <DropDetail drop={drop} />
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
      <Suspense fallback={<DropListSkeleton count={2} />}>
        <Replies id={id} />
      </Suspense>
    </>
  );
}

async function Replies({ id }: { id: string }) {
  const replies = await getReplies(id);
  return (
    <section>
      <h2 className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 text-sm font-semibold tracking-tight sm:px-5">
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
