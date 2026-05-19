'use client';

import * as Ariakit from '@ariakit/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type ReactNode } from 'react';
import { switchUser } from '@/features/user/user-actions';
import { cn } from '@/lib/utils';

type User = { handle: string; displayName: string; avatarColor: string };

type Props = {
  currentHandle: string;
  users: User[];
  children: ReactNode;
};

export function UserSwitcher({ currentHandle, users, children }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentHandle);
  const popover = Ariakit.usePopoverStore({ placement: 'top-start' });

  function handleSelect(handle: string) {
    popover.hide();
    if (handle === selected) return;
    setSelected(handle);
    startTransition(async () => {
      await switchUser(handle);
      router.refresh();
    });
  }

  return (
    <>
      <Ariakit.PopoverDisclosure
        store={popover}
        disabled={isPending}
        className="hover:bg-card dark:hover:bg-card-dark flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors disabled:opacity-50"
      >
        {children}
        <ChevronsUpDown className="text-gray ml-auto h-4 w-4 shrink-0" />
      </Ariakit.PopoverDisclosure>
      <Ariakit.Popover
        store={popover}
        gutter={8}
        className="border-divider dark:border-divider-dark z-50 w-64 overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-black"
      >
        <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-2.5">
          <p className="text-xs font-semibold tracking-tight">Switch account</p>
        </div>
        <div className="max-h-72 overflow-auto py-1">
          {users.map(u => {
            return (
              <button
                key={u.handle}
                type="button"
                onClick={() => {
                  return handleSelect(u.handle);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white uppercase',
                    u.avatarColor,
                  )}
                >
                  {u.displayName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold tracking-tight">{u.displayName}</div>
                  <div className="text-gray truncate font-mono text-[11px]">@{u.handle}</div>
                </div>
                <Check className={cn('h-4 w-4 shrink-0', u.handle === selected ? 'text-accent' : 'opacity-0')} />
              </button>
            );
          })}
        </div>
      </Ariakit.Popover>
    </>
  );
}
