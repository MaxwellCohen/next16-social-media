import { Suspense } from 'react';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

export function DropComposer() {
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
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
  );
}
