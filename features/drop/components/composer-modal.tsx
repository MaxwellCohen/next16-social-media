'use client';

import { Plus, X } from 'lucide-react';
import { Suspense, useActionState, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/ui/client-only';
import { ComposerField } from '@/features/drop/components/composer-field';
import { ComposerFormatActions, ComposerPreviewToggle } from '@/features/drop/components/composer-toolbar';
import { PreviewSkeleton, ThreadPreview } from '@/features/drop/components/drop-preview';
import { postThread, type ComposerState } from '@/features/drop/drop-actions';
import { renderThreadPreview } from '@/features/drop/drop-preview-action';
import { useTextareaFormat } from '@/hooks/use-textarea-format';
import { cn } from '@/lib/utils';

type ThreadPreviewState = { key: string; nodes: Promise<ReactNode[]> };

type Props = {
  avatar: ReactNode;
  dialogId?: string;
};

const INITIAL: ComposerState = { error: null, status: 'idle' };

/** Nested disclosure so each no-JS click adds one field and keeps the add control at the bottom. */
function NoJsExtraDrop({ avatar, children }: { avatar: ReactNode; children?: ReactNode }) {
  return (
    <details className="group">
      <summary className="text-accent hover:bg-accent/10 mt-3 flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2 text-sm font-medium transition-colors group-open:hidden [&::-webkit-details-marker]:hidden">
        <Plus className="h-4 w-4" />
        Add another drop
      </summary>
      <div className="border-divider/70 dark:border-divider-dark/70 border-t py-4">
        <ComposerField avatar={avatar} placeholder="Add to your thread…" />
      </div>
      {children}
    </details>
  );
}

export function NewDropDialog({ avatar, dialogId = 'new-drop' }: Props) {
  const reactId = useId();
  const id = dialogId;
  const [state, formAction] = useActionState(postThread, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeRef = useRef<HTMLTextAreaElement>(null);
  const writeRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const [segmentIds, setSegmentIds] = useState<number[]>([0]);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [preview, setPreview] = useState<ThreadPreviewState | null>(null);
  const [writeHeight, setWriteHeight] = useState(0);
  const { insertAtCaret, insertSnippet, wrapSelection } = useTextareaFormat(activeRef);
  useEffect(() => {
    if (state.status === 'error' && state.error) {
      toast.error(state.error);
      return;
    }
    if (state.status === 'success') {
      toast.success('Dropped!');
      dialogRef.current?.close();
      setSegmentIds([nextId.current++]);
      setMode('write');
      setPreview(null);
    }
  }, [state]);

  function addSegment() {
    setSegmentIds(ids => [...ids, nextId.current++]);
  }

  function removeSegment(segmentId: number) {
    setSegmentIds(ids => ids.filter(x => x !== segmentId));
  }

  function showPreview() {
    const form = formRef.current;
    const bodies = form
      ? Array.from(form.querySelectorAll<HTMLTextAreaElement>('textarea[name="body"]'))
          .map(t => t.value.trim())
          .filter(Boolean)
      : [];
    setWriteHeight(writeRef.current?.offsetHeight ?? 0);
    const key = bodies.join('|');
    if (preview?.key !== key) {
      setPreview({ key, nodes: renderThreadPreview(bodies) });
    }
    setMode('preview');
  }

  return (
    <Boundary label="NewDropDialog">
      <dialog
        ref={dialogRef}
        id={id}
        className="dark:border-divider-dark border-divider m-0 h-dvh max-h-dvh w-full max-w-none bg-white p-0 text-black open:fixed open:inset-0 open:z-50 open:flex open:flex-col sm:open:inset-auto sm:open:top-16 sm:open:left-1/2 sm:open:h-auto sm:open:max-h-[calc(100dvh-5rem)] sm:open:w-[calc(100%-2rem)] sm:open:max-w-xl sm:open:-translate-x-1/2 sm:open:rounded-2xl sm:open:border sm:open:shadow-2xl dark:bg-black dark:text-white"
        style={{ viewTransitionName: 'modal' }}
      >
        <header className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3">
          <button
            type="button"
            command="close"
            commandFor={id}
            aria-label="Close"
            className="text-gray -ml-1.5 rounded-full p-1 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="sr-only">New drop</h2>
          <ComposerPreviewToggle mode={mode} onPreview={showPreview} onEdit={() => setMode('write')} />
        </header>
        <Suspense>
          <form ref={formRef} action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 pt-5 pb-4">
              <div ref={writeRef} className={cn(mode === 'preview' && 'hidden')}>
                <div className="divide-divider/70 dark:divide-divider-dark/70 flex flex-col divide-y">
                  {segmentIds.map((segmentId, index) => (
                    <div key={segmentId} className="py-4 first:pt-0">
                      <ComposerField
                        avatar={avatar}
                        placeholder={index === 0 ? 'What did you build today?' : 'Add to your thread…'}
                        autoFocus={index === segmentIds.length - 1}
                        onFocus={el => {
                          activeRef.current = el;
                        }}
                        onRemove={index > 0 ? () => removeSegment(segmentId) : undefined}
                      />
                    </div>
                  ))}
                </div>
                <div className="js:hidden">
                  <NoJsExtraDrop avatar={avatar}>
                    <NoJsExtraDrop avatar={avatar} />
                  </NoJsExtraDrop>
                </div>
                <ClientOnly>
                  <button
                    type="button"
                    onClick={addSegment}
                    className="text-accent hover:bg-accent/10 mt-3 flex w-fit items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2 text-sm font-medium transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add another drop
                  </button>
                </ClientOnly>
              </div>
              {mode === 'preview' && preview ? (
                <div className="flex flex-col" style={{ minHeight: writeHeight || undefined }}>
                  <Suspense key={preview.key || reactId} fallback={<PreviewSkeleton />}>
                    <ThreadPreview nodes={preview.nodes} />
                  </Suspense>
                </div>
              ) : null}
            </div>
            {state.error ? (
              <p role="alert" className="text-danger px-5 pb-2 text-xs">
                {state.error}
              </p>
            ) : null}
            <footer className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between gap-2 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-3">
              <div className="flex items-center gap-0.5">
                {mode === 'write' ? (
                  <ComposerFormatActions
                    insertAtCaret={insertAtCaret}
                    insertSnippet={insertSnippet}
                    wrapSelection={wrapSelection}
                  />
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button type="button" variant="secondary" command="close" commandFor={id}>
                  Cancel
                </Button>
                <Button type="submit">Drop it</Button>
              </div>
            </footer>
          </form>
        </Suspense>
      </dialog>
    </Boundary>
  );
}
