import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { NewDropDialog } from '@/features/drop/components/composer-modal';
import { QuickDropForm, QuickDropFormSkeleton } from '@/features/drop/components/quick-drop-form';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

export const NEW_DROP_DIALOG_ID = 'new-drop';

function ComposerAvatar() {
  return (
    <Suspense fallback={<UserAvatarSkeleton size="md" />}>
      <CurrentUserAvatar />
    </Suspense>
  );
}

/** Always-mounted dialog so sidebar + FAB invokers work on every route. */
export function NewDropDialogHost() {
  return <NewDropDialog avatar={<ComposerAvatar />} dialogId={NEW_DROP_DIALOG_ID} />;
}

export function DropComposer() {
  return (
    <>
      <Suspense fallback={<QuickDropFormSkeleton />}>
        <QuickDropForm avatar={<ComposerAvatar />} />
      </Suspense>
      <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-50 sm:right-6 sm:bottom-6 lg:hidden">
        <button
          type="button"
          command="show-modal"
          commandFor={NEW_DROP_DIALOG_ID}
          aria-label="New drop"
          className="bg-accent hover:bg-accent-hover flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg sm:w-auto sm:gap-2 sm:px-5"
        >
          <Plus className="h-6 w-6" />
          <span className="hidden text-sm font-semibold sm:inline">New drop</span>
        </button>
      </div>
    </>
  );
}

export function NewDropSidebarButton() {
  return (
    <Button type="button" className="w-full py-3" command="show-modal" commandFor={NEW_DROP_DIALOG_ID}>
      <Plus className="h-5 w-5" />
      <span className="hidden lg:inline">New drop</span>
    </Button>
  );
}
