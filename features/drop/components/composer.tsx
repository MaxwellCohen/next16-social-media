import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { QuickDropForm } from './quick-drop-form';

export function DropComposer() {
  return (
    <>
      <QuickDropForm
        avatar={
          <Suspense fallback={<UserAvatarSkeleton size="md" />}>
            <CurrentUserAvatar />
          </Suspense>
        }
      />
      {/* Mobile: floating action button */}
      <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-50 sm:hidden">
        <NewDropModal
          onOpenTrigger={
            <span
              aria-label="New drop"
              className="bg-accent hover:bg-accent-hover flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </span>
          }
          avatar={
            <Suspense fallback={<UserAvatarSkeleton size="md" />}>
              <CurrentUserAvatar />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
