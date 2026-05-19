'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';

type Props = {
  store: Ariakit.DialogStore;
  title: string;
  initialFocus?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
};

export function Modal({ store, title, initialFocus, children }: Props) {
  return (
    <Ariakit.Dialog
      store={store}
      backdrop={<div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />}
      className="border-divider dark:border-divider-dark fixed top-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border bg-white shadow-2xl outline-none dark:bg-black"
      unmountOnHide
      initialFocus={initialFocus}
    >
      <header className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-5 py-3">
        <Ariakit.DialogDismiss
          aria-label="Close"
          className="text-gray -ml-1.5 rounded-full p-1 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </Ariakit.DialogDismiss>
        <Ariakit.VisuallyHidden>
          <Ariakit.DialogHeading>{title}</Ariakit.DialogHeading>
        </Ariakit.VisuallyHidden>
      </header>
      {children}
    </Ariakit.Dialog>
  );
}
