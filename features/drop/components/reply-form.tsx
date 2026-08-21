'use client';

import { useActionState, useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { postReply, type ComposerState } from '@/features/drop/drop-actions';

type Props = {
  dropId: string;
  avatar: ReactNode;
};

const INITIAL: ComposerState = { error: null, status: 'idle' };

export function ReplyComposerForm({ dropId, avatar }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(postReply, INITIAL);

  useEffect(() => {
    if (state.status === 'error' && state.error) {
      toast.error(state.error);
      return;
    }
    if (state.status === 'success') {
      toast.success('Replied!');
      const body = formRef.current?.elements.namedItem('body');
      if (body instanceof HTMLTextAreaElement) body.value = '';
    }
  }, [state]);

  return (
    <Boundary label="ReplyForm">
      <form ref={formRef} action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="parentId" value={dropId} />
        <div className="flex items-start gap-3">
          {avatar}
          <textarea
            name="body"
            aria-label="Reply"
            rows={1}
            required
            maxLength={1000}
            placeholder="Drop a reply…"
            onKeyDown={e => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            className="placeholder-gray field-sizing-content flex-1 resize-none border-0 bg-transparent p-0 pt-2 text-[15px] leading-6 focus:ring-0 focus:outline-none"
          />
        </div>
        {state.error ? (
          <p role="alert" className="text-danger text-xs">
            {state.error}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Reply
          </Button>
        </div>
      </form>
    </Boundary>
  );
}
