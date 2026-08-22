'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { Boundary } from '@/components/internal/boundary';
import { switchUser } from '@/features/user/user-actions';
import { formAction } from '@/lib/form-action';
import { UNREAD_KEY } from '@/lib/swr';
import { cn } from '@/lib/utils';

type User = { handle: string; displayName: string; avatarColor: string };

type Props = {
  currentHandle: string;
  users: User[];
};

export function UserSwitcher({ currentHandle, users }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isPending, startTransition] = useTransition();
  const [optimisticHandle, setOptimisticHandle] = useOptimistic(currentHandle);
  const selected = users.find(u => u.handle === optimisticHandle) ?? users[0];
  const popoverId = useId();

  function handleSelect(handle: string) {
    if (handle === optimisticHandle) return;
    startTransition(async () => {
      setOptimisticHandle(handle);
      const result = await switchUser(handle);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
      void mutate(UNREAD_KEY);
    });
  }

  return (
    <Boundary label="UserSwitcher">
      <div className="relative min-w-0 flex-1" data-pending={isPending ? '' : undefined}>
        <button
          type="button"
          command="toggle-popover"
          commandFor={popoverId}
          className="hover:bg-card dark:hover:bg-card-dark flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 transition-colors"
          style={{ anchorName: '--account-menu' } as React.CSSProperties}
        >
          <div
            aria-hidden
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-semibold text-white uppercase shadow-sm',
              selected.avatarColor,
            )}
          >
            {selected.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-sm leading-tight font-semibold tracking-tight">{selected.displayName}</div>
            <div className="text-gray truncate font-mono text-[11px] leading-tight">@{selected.handle}</div>
          </div>
          <ChevronsUpDown className="text-gray ml-auto hidden h-3.5 w-3.5 shrink-0 lg:block" />
        </button>
        <div
          id={popoverId}
          popover="auto"
          style={
            {
              positionAnchor: '--account-menu',
              viewTransitionName: 'account-menu',
            } as React.CSSProperties
          }
          className="border-divider dark:border-divider-dark m-0 w-64 overflow-hidden rounded-xl border bg-white p-0 shadow-xl open:fixed open:top-[anchor(bottom)] open:left-[anchor(left)] open:mt-2 dark:bg-black"
        >
          <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-2">
            <p className="text-gray text-xs font-medium">Switch account</p>
          </div>
          <div className="max-h-72 overflow-auto py-1">
            {users.map(u => (
              <form key={u.handle} action={formAction(switchUser, u.handle)}>
                <button
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    handleSelect(u.handle);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5',
                    u.handle === optimisticHandle && 'bg-black/3 dark:bg-white/3',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[10px] font-semibold text-white uppercase',
                      u.avatarColor,
                    )}
                  >
                    {u.displayName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-black dark:text-white">{u.displayName}</div>
                    <div className="text-gray truncate font-mono text-[11px]">@{u.handle}</div>
                  </div>
                  {u.handle === optimisticHandle && <Check className="text-accent h-4 w-4 shrink-0" />}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </Boundary>
  );
}
