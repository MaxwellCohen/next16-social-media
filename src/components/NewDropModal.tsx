'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';
import { useActionState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { postDrop } from '@/data/actions/drop';

type Props = {
  avatar: ReactNode;
};

type State = { error: string | null; submittedAt: number };

const INITIAL: State = { error: null, submittedAt: 0 };

async function submit(_: State, formData: FormData): Promise<State> {
  const result = await postDrop(formData);
  if (!result.ok) return { error: result.error, submittedAt: 0 };
  return { error: null, submittedAt: Date.now() };
}

export function NewDropModal({ avatar }: Props) {
  const dialog = Ariakit.useDialogStore();
  const [state, formAction, pending] = useActionState(submit, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.submittedAt > 0) {
      formRef.current?.reset();
      dialog.hide();
    }
  }, [state.submittedAt, dialog]);

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

        <form ref={formRef} action={formAction}>
          <div className="flex gap-3 px-5 pt-4 pb-3">
            {avatar}
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

          {state.error ? (
            <p role="alert" className="text-danger px-5 pb-2 text-xs">
              {state.error}
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
