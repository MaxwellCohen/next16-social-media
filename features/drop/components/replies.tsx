import { EmptyState } from '@/components/ui/empty-state';
import { DropList } from '@/features/drop/components/drop';
import { getReplies } from '@/features/drop/drop-queries';

export async function Replies({ id }: { id: string }) {
  const replies = await getReplies(id);
  if (replies.length === 0) {
    return <EmptyState title="No replies yet" body="Be the first to reply." />;
  }
  return (
    <div>
      <DropList drops={replies} compact />
    </div>
  );
}
