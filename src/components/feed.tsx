import { Drop, DropSkeleton } from '@/components/drop';
import { getFeed } from '@/data/queries/drop';

export async function Feed() {
  const drops = await getFeed();
  return (
    <ul>
      {drops.map(drop => {return (
        <li key={drop.id}>
          <Drop drop={drop} />
        </li>
      )})}
    </ul>
  );
}

export function FeedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, i) => {return (
        <li key={i}>
          <DropSkeleton />
        </li>
      )})}
    </ul>
  );
}
