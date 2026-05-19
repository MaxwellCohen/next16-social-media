import Link from 'next/link';
import { Suspense } from 'react';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDrop, getDropUserState } from '@/data/queries/drop';
import { getUserByHandle } from '@/data/queries/user';
import { CodeBlock } from '@/features/drop/components/CodeBlock';
import { DropActions, DropActionsSkeleton } from '@/features/drop/components/DropActions';
import { DropBody } from '@/features/drop/components/DropBody';
import { TagPill } from '@/features/tag/components/TagPill';
import { UserAvatar } from '@/features/user/components/UserAvatar';

export async function DropDetail({ id }: { id: string }) {
  const drop = await getDrop(id);
  return (
    <article className="border-divider/70 dark:border-divider-dark/70 border-b px-4 pt-4 pb-3 sm:px-5">
      <DropAuthor handle={drop.authorHandle} />
      <div className="mt-3 flex flex-col gap-3">
        <DropBody body={drop.body} detail />
        {drop.embeddedCode ? <CodeBlock lang={drop.embeddedCode.lang} code={drop.embeddedCode.code} /> : null}
        {drop.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {drop.tags.map(t => {
              return <TagPill key={t} tag={t} />;
            })}
          </div>
        ) : null}
      </div>
      <div className="text-gray border-divider/70 dark:border-divider-dark/70 mt-3 border-b pb-3 font-mono text-[12px]">
        <RelativeTime date={drop.createdAt} verbose />
      </div>
      <div className="pt-2">
        <Suspense fallback={<DropActionsSkeleton />}>
          <DropActions
            dropId={drop.id}
            parentId={drop.parentId}
            replies={drop.replies}
            reposts={drop.reposts}
            likes={drop.likes}
            userStatePromise={getDropUserState(drop.id)}
          />
        </Suspense>
      </div>
    </article>
  );
}

async function DropAuthor({ handle }: { handle: string }) {
  const author = await getUserByHandle(handle);
  return (
    <header className="flex items-center gap-3">
      <Link href={`/u/${author.handle}`} className="shrink-0">
        <UserAvatar handle={author.handle} size="lg" />
      </Link>
      <div className="flex min-w-0 flex-col">
        <Link
          href={`/u/${author.handle}`}
          className="font-semibold tracking-tight text-black hover:underline dark:text-white"
        >
          {author.displayName}
        </Link>
        <Link href={`/u/${author.handle}`} className="text-gray font-mono text-[12px]">
          @{author.handle}
        </Link>
      </div>
    </header>
  );
}

export function DropDetailSkeleton() {
  return (
    <article className="border-divider/70 dark:border-divider-dark/70 border-b px-4 pt-4 pb-3 sm:px-5">
      <header className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </header>
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
      <div className="border-divider/70 dark:border-divider-dark/70 mt-3 border-b pb-3">
        <Skeleton className="h-3 w-28 rounded" />
      </div>
      <div className="text-gray -ml-2 flex items-center gap-1 pt-3" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1.5">
              <Skeleton className="h-4 w-4 rounded" />
              {i < 3 ? <Skeleton className="h-3 w-6 rounded" /> : null}
            </span>
          );
        })}
      </div>
    </article>
  );
}
