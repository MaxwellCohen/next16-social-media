'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/features/user/user-actions';
import { formAction } from '@/lib/form-action';

type Props = {
  targetHandle: string;
  following: boolean;
};

export function FollowButton({ targetHandle, following: initialFollowing }: Props) {
  const [following, setOptimistic] = useOptimistic(initialFollowing);
  const [, startTransition] = useTransition();

  return (
    <Boundary label="FollowButton">
      <form action={formAction(toggleFollow, targetHandle)}>
        <Button
          type="submit"
          variant={following ? 'secondary' : 'primary'}
          size="sm"
          className="min-w-28"
          onClick={e => {
            e.preventDefault();
            startTransition(async () => {
              setOptimistic(!following);
              try {
                const result = await toggleFollow(targetHandle);
                if (!result.ok) toast.error(result.error);
              } catch {
                toast.error('Something went wrong. Try again.');
              }
            });
          }}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </form>
    </Boundary>
  );
}
