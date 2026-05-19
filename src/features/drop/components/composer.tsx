import { Suspense } from 'react';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

export function DropComposer() {
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
      <Suspense fallback={<UserAvatarSkeleton size="md" />}>
        <UserAvatar />
      </Suspense>
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray text-sm">What did you build today?</span>
        <NewDropModal
          avatar={
            <Suspense fallback={<UserAvatarSkeleton size="md" />}>
              <UserAvatar />
            </Suspense>
          }
        />
      </div>
    </section>
  );
}
