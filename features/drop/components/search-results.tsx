import { EmptyState } from '@/components/ui/empty-state';
import { DropList } from '@/features/drop/components/drop';
import { searchDrops } from '@/features/drop/drop-queries';
import { UserRow } from '@/features/user/components/user-row';
import { searchUsers } from '@/features/user/user-queries';

export async function SearchResults({ query }: { query: string }) {
  const [users, drops] = await Promise.all([searchUsers(query), searchDrops(query)]);

  if (users.length === 0 && drops.length === 0) {
    return <EmptyState title="No results" body={`Nothing matched "${query}".`} />;
  }

  return (
    <>
      {users.length > 0 && (
        <div>
          <h2 className="text-gray px-4 pt-5 pb-2 text-xs font-semibold tracking-wide sm:px-5">People</h2>
          {users.map(u => {
            return <UserRow key={u.handle} handle={u.handle} displayName={u.displayName} />;
          })}
        </div>
      )}
      {drops.length > 0 && (
        <div>
          {users.length > 0 && (
            <h2 className="text-gray px-4 pt-4 pb-2 text-xs font-semibold tracking-wide sm:px-5">Drops</h2>
          )}
          <DropList drops={drops} />
        </div>
      )}
    </>
  );
}
