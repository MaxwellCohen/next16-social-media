import { Suspense } from 'react';
import { CurrentUserAvatar, CurrentUserAvatarSkeleton } from '@/components/CurrentUserAvatar';
import { NewDropModal } from '@/components/NewDropModal';

export function DropComposer() {
  return (
    <section className="border-divider/70 dark:border-divider-dark/70 flex items-center gap-3 border-b p-4 sm:p-5">
      <Suspense fallback={<CurrentUserAvatarSkeleton />}>
        <CurrentUserAvatar />
      </Suspense>
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-gray text-sm">What did you ship today?</span>
        <NewDropModal
          avatar={
            <Suspense fallback={<CurrentUserAvatarSkeleton />}>
              <CurrentUserAvatar />
            </Suspense>
          }
        />
      </div>
    </section>
  );
}
