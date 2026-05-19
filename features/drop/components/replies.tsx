import { EmptyState } from '@/components/ui/empty-state';
import { DropList } from '@/features/drop/components/drop';
import { getReplies } from '@/features/drop/drop-queries';

export async function Replies({ id }: { id: string }) {
  const replies = await getReplies(id);
  return (
    <section>
      <h2 className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-3 text-sm font-semibold tracking-tight sm:px-5">
        Replies
      </h2>
      {replies.length === 0 ? (
        <EmptyState title="No replies yet" body="Be the first to reply." />
      ) : (
        <DropList drops={replies} />
      )}
    </section>
  );
}
