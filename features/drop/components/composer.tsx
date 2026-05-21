import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

export function DropComposer() {
  return (
    <>
      {/* Desktop: inline bar */}
      <section className="border-divider/70 dark:border-divider-dark/70 hidden items-center gap-3 border-b p-4 sm:flex sm:p-5">
        <Suspense fallback={<UserAvatarSkeleton size="md" />}>
          <CurrentUserAvatar />
        </Suspense>
        <div className="flex flex-1 items-center justify-between gap-3">
          <NewDropModal
            onOpenTrigger={
              <span className="text-gray flex-1 cursor-pointer text-left text-sm">What did you build today?</span>
            }
            avatar={
              <Suspense fallback={<UserAvatarSkeleton size="md" />}>
                <CurrentUserAvatar />
              </Suspense>
            }
          />
        </div>
      </section>
      {/* Mobile: floating action button */}
      <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-40 sm:hidden">
        <NewDropModal
          onOpenTrigger={
            <span aria-label="New drop" className="bg-accent hover:bg-accent-hover flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg">
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
