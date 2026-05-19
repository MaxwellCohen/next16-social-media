import { EmptyState } from '@/components/ui/empty-state';
import { Drop } from '@/features/drop/components/drop';
import { getDropsByTag } from '@/features/drop/drop-queries';

export async function TagFeed({ tag }: { tag: string }) {
  const drops = await getDropsByTag(tag);
  if (drops.length === 0) {
    return <EmptyState title="No drops with this tag yet" body="Be the first to use it." />;
  }
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
