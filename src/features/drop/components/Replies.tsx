import { EmptyState } from '@/components/ui/EmptyState';
import { getReplies } from '@/data/queries/drop';
import { Drop } from '@/features/drop/components/Drop';

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
