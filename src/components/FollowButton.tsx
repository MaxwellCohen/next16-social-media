'use client';

import { Check } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { toggleFollow } from '@/data/actions/drop';
import { cn } from '@/lib/utils';

type Props = {
  targetHandle: string;
  initialFollowing: boolean;
};

/** Hold the green confirmation flash long enough to read. */
const CONFIRMATION_HOLD_MS = 1200;

export function FollowButton({ targetHandle, initialFollowing }: Props) {
  const [following, setOptimistic] = useOptimistic<boolean, void>(initialFollowing, state => {return !state});
  const [, startTransition] = useTransition();
  // Confirmation flash lives outside the transition so it survives the
  // server response. Cleared by a setTimeout for a fixed duration.
  const [confirmation, setConfirmation] = useState<'followed' | 'removed' | null>(null);

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size="sm"
      className={cn('min-w-[7rem]', confirmation && 'border-success bg-success hover:bg-success text-white')}
      onClick={() => {
        // Snap UI to the new state and flash the confirmation.
        setConfirmation(following ? 'removed' : 'followed');
        window.setTimeout(() => {return setConfirmation(null)}, CONFIRMATION_HOLD_MS);

        startTransition(async () => {
          setOptimistic();
          await toggleFollow(targetHandle);
        });
      }}
    >
      {confirmation ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {confirmation === 'followed' ? 'Followed' : 'Removed'}
        </>
      ) : following ? (
        'Following'
      ) : (
        'Follow'
      )}
    </Button>
  );
}
