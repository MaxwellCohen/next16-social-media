'use client';

import * as Ariakit from '@ariakit/react';
import { Bold, Code2, Eye, Hash, Italic, PenLine, Plus } from 'lucide-react';
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ToolbarButton } from '@/features/drop/components/composer-toolbar';
import { DropPreview, type Preview } from '@/features/drop/components/drop-preview';
import { postDrop } from '@/features/drop/drop-actions';
import { renderDropPreview } from '@/features/drop/drop-preview-action';
import { useTextareaFormat } from '@/hooks/use-textarea-format';
import { cn } from '@/lib/utils';

type Props = {
  avatar: ReactNode;
  onOpenTrigger?: ReactNode;
};

type State = { error: string | null; submittedAt: number };

const INITIAL: State = { error: null, submittedAt: 0 };

export function NewDropModal({ avatar, onOpenTrigger }: Props) {
  const dialog = Ariakit.useDialogStore();
  const [state, formAction] = useActionState(async (_: State, formData: FormData) => {
    const result = await postDrop(formData);
    if (!result.ok) {
      toast.error(result.error);
      return { error: result.error, submittedAt: 0 };
    }
    toast.success('Dropped!');
    return { error: null, submittedAt: Date.now() };
  }, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewMinHeight, setPreviewMinHeight] = useState(0);

  useEffect(() => {
    if (state.submittedAt > 0) dialog.hide();
  }, [state.submittedAt, dialog]);

  function openComposer() {
    setMode('write');
    dialog.show();
  }

  function showPreview() {
    const el = textareaRef.current;
    const body = el?.value.trim() ?? '';
    setPreviewMinHeight(el?.offsetHeight ?? 0);
    if (!body) {
      setPreview(null);
    } else if (preview?.body !== body) {
      setPreview({ body, node: renderDropPreview(body) });
    }
    setMode('preview');
  }

  function showWrite() {
    setMode('write');
  }

  const { insertAtCaret, insertSnippet, wrapSelection } = useTextareaFormat(textareaRef);

  return (
    <Boundary label="NewDropModal">
      <>
        {onOpenTrigger ? (
          <button type="button" onClick={openComposer}>
            {onOpenTrigger}
          </button>
        ) : (
          <Button className="w-full py-3" onClick={openComposer}>
            <Plus className="h-5 w-5" />
            <span className="hidden lg:inline">New drop</span>
          </Button>
        )}
        <Modal
          store={dialog}
          title="New drop"
          initialFocus={textareaRef}
          headerContent={
            mode === 'write' ? (
              <ToolbarButton label="Preview" onClick={showPreview}>
                <Eye className="h-5 w-5" />
              </ToolbarButton>
            ) : (
              <ToolbarButton label="Edit" onClick={showWrite}>
                <PenLine className="h-5 w-5" />
              </ToolbarButton>
            )
          }
        >
          <form ref={formRef} action={formAction} className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex flex-1 items-start gap-3 overflow-y-auto px-5 pt-5 pb-4">
              {avatar}
              <Ariakit.VisuallyHidden>
                <label htmlFor="new-drop-body">Drop body</label>
              </Ariakit.VisuallyHidden>
              <textarea
                id="new-drop-body"
                name="body"
                ref={textareaRef}
                rows={5}
                required
                maxLength={1000}
                placeholder="What did you build today?"
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                className={cn(
                  'placeholder-gray field-sizing-content min-h-40 flex-1 resize-none border-0 bg-transparent pt-1.5 text-lg leading-relaxed focus:ring-0 focus:outline-none',
                  mode === 'preview' && 'hidden',
                )}
              />
              <div
                className={cn('min-h-40 flex-1 pt-1.5', mode === 'write' && 'hidden')}
                style={{ minHeight: previewMinHeight || undefined }}
              >
                <DropPreview preview={preview} />
              </div>
            </div>
            {state.error ? (
              <p role="alert" className="text-danger px-5 pb-2 text-xs">
                {state.error}
              </p>
            ) : null}
            <footer className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between gap-2 border-t px-4 py-3 sm:px-5">
              <div className="flex items-center gap-0.5">
                {mode === 'write' ? (
                  <>
                    <ToolbarButton label="Bold" onClick={() => wrapSelection('**')}>
                      <Bold className="h-5 w-5" />
                    </ToolbarButton>
                    <ToolbarButton label="Italic" onClick={() => wrapSelection('*')}>
                      <Italic className="h-5 w-5" />
                    </ToolbarButton>
                    <ToolbarButton label="Add code snippet" onClick={insertSnippet}>
                      <Code2 className="h-5 w-5" />
                    </ToolbarButton>
                    <ToolbarButton label="Add hashtag" onClick={() => insertAtCaret('#')}>
                      <Hash className="h-5 w-5" />
                    </ToolbarButton>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Ariakit.DialogDismiss render={<Button variant="secondary">Cancel</Button>} />
                <Button type="submit">Drop it</Button>
              </div>
            </footer>
          </form>
        </Modal>
      </>
    </Boundary>
  );
}

