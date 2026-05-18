import { getFeed } from '@/data/queries/drop';
import { Drop } from '@/features/drop/components/Drop';

export async function Feed() {
  const drops = await getFeed();
  return (
    <ul>
      {drops.map(drop => {
        return (
          <li key={drop.id}>
            <Drop drop={drop} />
          </li>
        );
      })}
    </ul>
  );
}
