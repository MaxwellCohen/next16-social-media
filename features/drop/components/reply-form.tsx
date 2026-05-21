'use client';

import { useActionState, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { postReply } from '@/features/drop/drop-actions';

type Props = {
  dropId: string;
  avatar: ReactNode;
};

const INITIAL = { error: null as string | null };

export function ReplyComposerForm({ dropId, avatar }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (_: typeof INITIAL, formData: FormData) => {
    const result = await postReply(dropId, formData);
    if (!result.ok) toast.error(result.error);
    return { error: result.ok ? null : result.error };
  }, INITIAL);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
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
          className="placeholder-gray flex-1 resize-none border-0 bg-transparent p-0 text-[15px] leading-10 focus:ring-0 focus:outline-none"
        />
      </div>
      {state.error ? <p role="alert" className="text-danger text-xs">{state.error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          Reply
        </Button>
      </div>
    </form>
  );
}
