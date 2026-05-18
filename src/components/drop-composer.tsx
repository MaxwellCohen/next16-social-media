import { Avatar } from "@/components/ui/avatar";
import { NewDropModal } from "@/components/new-drop-modal";
import { getCurrentUser } from "@/data/queries/user";

export async function DropComposer() {
  const user = await getCurrentUser();
  return (
    <section className="border-divider dark:border-divider-dark flex items-center gap-3 border-b p-4 sm:p-5">
      <Avatar name={user.displayName} color={user.avatarColor} size="md" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray font-mono text-sm">
          What did you ship today?
        </span>
        <NewDropModal
          authorName={user.displayName}
          authorColor={user.avatarColor}
        />
      </div>
    </section>
  );
}
