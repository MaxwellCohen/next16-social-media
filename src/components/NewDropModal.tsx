'use client';

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
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function close() {
    setOpen(false);
    setError(null);
    formRef.current?.reset();
  }

  return (
    <>
      <Button
        onClick={() => {
          return setOpen(true);
        }}
      >
        New drop
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="border-divider dark:border-divider-dark w-full max-w-lg rounded-2xl border bg-white shadow-2xl dark:bg-black">
            <header className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-5 py-3">
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="text-gray -ml-1.5 rounded-full p-1 transition-colors hover:text-black dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
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
                <textarea
                  name="body"
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

              {error ? <p className="text-danger px-5 pb-2 text-xs">{error}</p> : null}

              <footer className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-end gap-2 border-t px-5 py-3">
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? 'Dropping…' : 'Drop it'}
                </Button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
