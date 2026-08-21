'use client';

import { Suspense, useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ComposerFormatActions, ComposerPreviewToggle } from '@/features/drop/components/composer-toolbar';
import { DropPreview, PreviewSkeleton, type Preview } from '@/features/drop/components/drop-preview';
import { postDrop, type ComposerState } from '@/features/drop/drop-actions';
import { renderDropPreview } from '@/features/drop/drop-preview-action';
import { useTextareaFormat } from '@/hooks/use-textarea-format';
import { cn } from '@/lib/utils';

type Props = {
  avatar: React.ReactNode;
};

const INITIAL: ComposerState = { error: null, status: 'idle' };

export function QuickDropForm({ avatar }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, formAction] = useActionState(postDrop, INITIAL);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [, startTransition] = useTransition();
  const { insertAtCaret, insertSnippet, wrapSelection } = useTextareaFormat(textareaRef);

  useEffect(() => {
    if (state.status === 'error' && state.error) {
      toast.error(state.error);
      return;
    }
    if (state.status === 'success') {
      toast.success('Dropped!');
      startTransition(() => {
        setMode('write');
        setPreview(null);
      });
      if (textareaRef.current) textareaRef.current.value = '';
    }
  }, [state, startTransition]);

  function showPreview() {
    const body = textareaRef.current?.value.trim() ?? '';
    if (!body) {
      setPreview(null);
    } else if (preview?.body !== body) {
      setPreview({ body, node: renderDropPreview(body) });
    }
    setMode('preview');
  }

  return (
    <Boundary label="QuickDropForm">
      <section className="border-divider/70 dark:border-divider-dark/70 hidden border-b px-4 py-3 sm:block sm:px-5">
        <form ref={formRef} action={formAction} className="flex items-start gap-3">
          {avatar}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative grid min-h-20">
              <textarea
                name="body"
                ref={textareaRef}
                required
                maxLength={1000}
                rows={3}
                aria-label="Drop body"
                placeholder="What did you build today?"
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                className={cn(
                  'placeholder-gray col-start-1 row-start-1 field-sizing-content min-h-20 w-full resize-none border-0 bg-transparent pt-1.5 pr-9 text-base leading-relaxed focus:ring-0 focus:outline-none',
                  mode === 'preview' && 'invisible',
                )}
              />
              <div
                aria-hidden={mode === 'write'}
                className={cn('col-start-1 row-start-1 pt-1.5 pr-9', mode === 'write' && 'invisible')}
              >
                <Suspense key={preview?.body} fallback={<PreviewSkeleton />}>
                  <DropPreview preview={preview} />
                </Suspense>
              </div>
              <div className="absolute top-1 right-0">
                <ComposerPreviewToggle size="sm" mode={mode} onPreview={showPreview} onEdit={() => setMode('write')} />
              </div>
            </div>
            {state.error ? (
              <p role="alert" className="text-danger mt-1 text-xs">
                {state.error}
              </p>
            ) : null}
            <footer className="mt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-0.5">
                {mode === 'write' ? (
                  <ComposerFormatActions
                    size="sm"
                    insertAtCaret={insertAtCaret}
                    insertSnippet={insertSnippet}
                    wrapSelection={wrapSelection}
                  />
                ) : null}
              </div>
              <Button type="submit">Drop it</Button>
            </footer>
          </div>
        </form>
      </section>
    </Boundary>
  );
}

export function QuickDropFormSkeleton() {
  return (
    <section
      aria-hidden
      className="border-divider/70 dark:border-divider-dark/70 hidden border-b px-4 py-3 sm:block sm:px-5"
    >
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-20" />
          <footer className="mt-1 flex items-center justify-end">
            <Skeleton className="h-9 w-20 rounded-full" />
          </footer>
        </div>
      </div>
    </section>
  );
}
