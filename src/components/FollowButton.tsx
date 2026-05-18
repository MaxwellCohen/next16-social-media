'use client';

import { useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { toggleFollow } from '@/data/actions/drop';

type Props = {
  targetHandle: string;
  initialFollowing: boolean;
};

export function FollowButton({ targetHandle, initialFollowing }: Props) {
  const [following, setOptimistic] = useOptimistic<boolean, void>(initialFollowing, state => {
    return !state;
  });
  const [, startTransition] = useTransition();

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size="sm"
      className="min-w-[7rem]"
      onClick={() => {
        startTransition(async () => {
          setOptimistic();
          await toggleFollow(targetHandle);
        });
      }}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
