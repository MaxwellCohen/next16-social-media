"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFollow } from "@/data/actions/drop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  targetHandle: string;
  initialFollowing: boolean;
};

export function FollowButton({ targetHandle, initialFollowing }: Props) {
  const [following, setOptimistic] = useOptimistic<boolean, void>(
    initialFollowing,
    (state) => !state,
  );
  const [, startTransition] = useTransition();

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      className={cn("px-3 py-1.5 text-xs", following && "min-w-[110px]")}
      onClick={() => {
        startTransition(async () => {
          setOptimistic();
          await toggleFollow(targetHandle);
        });
      }}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
