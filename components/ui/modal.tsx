'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';
import { Boundary } from '@/components/internal/boundary';

type Props = {
  store: Ariakit.DialogStore;
  title: string;
  initialFocus?: React.RefObject<HTMLElement | null>;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
};

export function Modal({ store, title, initialFocus, headerContent, children }: Props) {
  return (
    <Boundary label="Modal" asChild>
      <Ariakit.Dialog
        store={store}
        backdrop={
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            style={{ viewTransitionName: 'modal-backdrop' }}
          />
        }
        className="dark:border-divider-dark border-divider fixed inset-0 z-50 flex h-dvh max-h-dvh w-full flex-col bg-white outline-none sm:inset-auto sm:top-16 sm:left-1/2 sm:h-auto sm:max-h-[calc(100dvh-5rem)] sm:w-[calc(100%-2rem)] sm:max-w-xl sm:-translate-x-1/2 sm:rounded-2xl sm:border sm:shadow-2xl dark:bg-black"
        style={{ viewTransitionName: 'modal' }}
        unmountOnHide
        hideOnInteractOutside={false}
        initialFocus={initialFocus}
      >
        <header className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3">
          <Ariakit.DialogDismiss
            aria-label="Close"
            className="text-gray -ml-1.5 rounded-full p-1 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </Ariakit.DialogDismiss>
          <Ariakit.VisuallyHidden>
            <Ariakit.DialogHeading>{title}</Ariakit.DialogHeading>
          </Ariakit.VisuallyHidden>
          {headerContent}
        </header>
        {children}
      </Ariakit.Dialog>
    </Boundary>
  );
}
