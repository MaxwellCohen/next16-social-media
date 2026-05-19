'use client';

import { use, useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/features/user/user-actions';

type Props = {
  targetHandle: string;
  followingPromise: Promise<boolean>;
};

export function FollowButton({ targetHandle, followingPromise }: Props) {
  const initialFollowing = use(followingPromise);
  const [following, setOptimistic] = useOptimistic(initialFollowing);
  const [, startTransition] = useTransition();

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size="sm"
      className="min-w-[7rem]"
      onClick={() => {
        startTransition(async () => {
          setOptimistic(!following);
          await toggleFollow(targetHandle);
        });
      }}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
