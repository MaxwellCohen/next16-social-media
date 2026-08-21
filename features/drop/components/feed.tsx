import { Fragment, Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadMore, PageAnchor } from '@/components/ui/load-more';
import { Drop, DropListSkeleton } from '@/features/drop/components/drop';
import { MAX_FEED_PAGE } from '@/features/drop/drop-constants';
import { getDiscoverFeed, getFeed } from '@/features/drop/drop-queries';
import type { Route } from 'next';

/*
  Both feeds put the page number in the URL. The URL is shareable and survives a
  reload. Each Load more re-renders pages 1 through N on the server, and links to
  #page-N so the browser lands at the new page instead of the top of the feed.
*/

function pageHref(nextPage: number, tab?: 'discover') {
  const query = tab === 'discover' ? `?tab=discover&page=${nextPage}` : `?page=${nextPage}`;
  return `/${query}#page-${nextPage}` as Route;
}

export async function Feed({ page = 1 }: { page?: number }) {
  const { items } = await getFeed(1);
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your following feed is quiet"
        body="Follow some people, or head to Discover to find new voices."
      />
    );
  }
  return (
    <ul>
      {Array.from({ length: page }).map((_, i) => {
        const p = i + 1;
        const isLast = p === page;
        return (
          <Fragment key={p}>
            {p > 1 ? <PageAnchor page={p} /> : null}
            {p === 1 ? (
              <FeedPage page={p} isLast={isLast} />
            ) : (
              <Suspense fallback={<DropListSkeleton count={3} />}>
                <Crossfade>
                  <FeedPage page={p} isLast={isLast} />
                </Crossfade>
              </Suspense>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}

async function FeedPage({ page, isLast }: { page: number; isLast: boolean }) {
  const { items, hasMore } = await getFeed(page);
  return (
    <>
      {items.map(item => (
        <li key={item.kind === 'repost' ? `repost:${item.repostedBy}:${item.drop.id}` : `drop:${item.drop.id}`}>
          <Drop drop={item.drop} repostedBy={item.kind === 'repost' ? item.repostedBy : undefined} />
        </li>
      ))}
      {isLast && hasMore && page < MAX_FEED_PAGE ? (
        <li className="flex justify-center p-6">
          <LoadMore href={pageHref(page + 1)} />
        </li>
      ) : null}
    </>
  );
}

export async function DiscoverFeed({ page = 1 }: { page?: number }) {
  const { drops } = await getDiscoverFeed(1);
  if (drops.length === 0) {
    return (
      <EmptyState title="You already follow everyone" body="Nothing new to discover right now. Check back later." />
    );
  }
  return (
    <ul>
      {Array.from({ length: page }).map((_, i) => {
        const p = i + 1;
        const isLast = p === page;
        return (
          <Fragment key={p}>
            {p > 1 ? <PageAnchor page={p} /> : null}
            {p === 1 ? (
              <DiscoverPage page={p} isLast={isLast} />
            ) : (
              <Suspense fallback={<DropListSkeleton count={3} />}>
                <Crossfade>
                  <DiscoverPage page={p} isLast={isLast} />
                </Crossfade>
              </Suspense>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}

async function DiscoverPage({ page, isLast }: { page: number; isLast: boolean }) {
  const { drops, hasMore } = await getDiscoverFeed(page);
  return (
    <>
      {drops.map(drop => (
        <li key={drop.id}>
          <Drop drop={drop} />
        </li>
      ))}
      {isLast && hasMore && page < MAX_FEED_PAGE ? (
        <li className="flex justify-center p-6">
          <LoadMore href={pageHref(page + 1, 'discover')} />
        </li>
      ) : null}
    </>
  );
}
