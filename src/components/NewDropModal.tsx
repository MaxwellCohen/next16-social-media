'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { postDrop } from '@/data/actions/drop';
import { cn } from '@/lib/utils';

type Props = {
  authorName: string;
  authorColor: string;
};

export function NewDropModal({ authorName, authorColor }: Props) {
  const dialog = Ariakit.useDialogStore();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function close() {
    setError(null);
    formRef.current?.reset();
    dialog.hide();
  }

  return (
    <>
      <Button
        onClick={() => {
          dialog.show();
        }}
      >
        New drop
      </Button>

      <Ariakit.Dialog
        store={dialog}
        backdrop={<div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />}
        className="border-divider dark:border-divider-dark fixed top-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border bg-white shadow-2xl outline-none dark:bg-black"
        unmountOnHide
        initialFocus={textareaRef}
      >
        <header className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-5 py-3">
          <Ariakit.DialogDismiss
            aria-label="Close"
            className="text-gray -ml-1.5 rounded-full p-1 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </Ariakit.DialogDismiss>
          <Ariakit.VisuallyHidden>
            <Ariakit.DialogHeading>New drop</Ariakit.DialogHeading>
          </Ariakit.VisuallyHidden>
        </header>

        <form
          ref={formRef}
          action={(formData: FormData) => {
            setError(null);
            startTransition(async () => {
              const result = await postDrop(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              close();
            });
          }}
        >
          <div className="flex gap-3 px-5 pt-4 pb-3">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white uppercase shadow-sm',
                authorColor,
              )}
              aria-hidden
            >
              {authorName.charAt(0)}
            </div>
            <Ariakit.VisuallyHidden>
              <label htmlFor="new-drop-body">Drop body</label>
            </Ariakit.VisuallyHidden>
            <textarea
              id="new-drop-body"
              name="body"
              ref={textareaRef}
              rows={6}
              required
              maxLength={1000}
              placeholder={'What did you ship today?\n\nWrap code in ```ts ... ``` to embed a snippet.'}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              className="placeholder-gray flex-1 resize-none border-0 bg-transparent p-0 text-base focus:ring-0 focus:outline-none"
            />
          </div>

          {error ? (
            <p role="alert" className="text-danger px-5 pb-2 text-xs">
              {error}
            </p>
          ) : null}

          <footer className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-end gap-2 border-t px-5 py-3">
            <Ariakit.DialogDismiss render={<Button variant="secondary">Cancel</Button>} />
            <Button type="submit" disabled={pending}>
              {pending ? 'Dropping…' : 'Drop it'}
            </Button>
          </footer>
        </form>
      </Ariakit.Dialog>
    </>
  );
}
