import Link from 'next/link';
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/code-block';
import { RelativeTime } from '@/components/ui/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import { DropActions, DropActionsSkeleton } from '@/features/drop/components/drop-actions';
import { DropBody } from '@/features/drop/components/drop-body';
import { getDrop } from '@/features/drop/drop-queries';
import { TagPill } from '@/features/tag/components/tag-pill';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { getDropUserState, getUserByHandle } from '@/features/user/user-queries';

export async function DropDetail({ id }: { id: string }) {
  const drop = await getDrop(id);
  return (
    <article className="fade-in border-divider/70 dark:border-divider-dark/70 border-b px-4 pt-4 pb-3 sm:px-5">
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
    <article
      aria-busy
      className="border-divider/70 dark:border-divider-dark/70 min-h-[200px] border-b px-4 pt-4 pb-3 sm:px-5"
    >
      <header className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
      </header>
    </article>
  );
}
