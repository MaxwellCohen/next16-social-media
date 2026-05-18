import { Avatar } from "@/components/ui/avatar";
import { NewDropModal } from "@/components/new-drop-modal";
import { getCurrentUser } from "@/data/queries/user";

export async function DropComposer() {
  const user = await getCurrentUser();
  return (
    <section className="flex items-center gap-3 border-b border-divider/70 p-4 sm:p-5 dark:border-divider-dark/70">
      <Avatar name={user.displayName} color={user.avatarColor} size="md" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray text-sm">What did you ship today?</span>
        <NewDropModal
          authorName={user.displayName}
          authorColor={user.avatarColor}
        />
      </div>
    </section>
  );
}
