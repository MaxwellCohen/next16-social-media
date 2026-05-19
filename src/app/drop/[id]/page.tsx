import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getDrop } from '@/data/queries/drop';
import { getUserByHandle } from '@/data/queries/user';
import { DropListSkeleton } from '@/features/drop/components/Drop';
import { DropDetail, DropDetailSkeleton } from '@/features/drop/components/DropDetail';
import { Replies } from '@/features/drop/components/Replies';
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
        {params.then(({ id }) => {
          return (
            <>
              <DropDetail id={id} />
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
        })}
      </Suspense>
    </div>
  );
}
