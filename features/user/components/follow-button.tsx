'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/features/user/user-actions';

type Props = {
  targetHandle: string;
  following: boolean;
};

export function FollowButton({ targetHandle, following: initialFollowing }: Props) {
  const [following, setOptimistic] = useOptimistic(initialFollowing);
  const [, startTransition] = useTransition();

  const toggleAction = () => {
    startTransition(async () => {
      setOptimistic(!following);
      try {
        await toggleFollow(targetHandle);
      } catch {
        toast.error('Something went wrong. Try again.');
      }
    });
  };

  return (
    <form
      action={toggleAction}
      onSubmit={e => {
        e.stopPropagation();
      }}
      className="contents"
    >
      <Button variant={following ? 'secondary' : 'primary'} size="sm" className="min-w-[7rem]">
        {following ? 'Following' : 'Follow'}
      </Button>
    </form>
  );
}
