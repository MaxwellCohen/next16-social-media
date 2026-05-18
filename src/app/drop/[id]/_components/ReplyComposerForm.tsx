'use client';

import { use, useActionState, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { postReply } from '@/data/actions/drop';

type Props = {
  idPromise: Promise<string>;
  avatar: ReactNode;
};

const INITIAL = { error: null as string | null };

export function ReplyComposerForm({ idPromise, avatar }: Props) {
  const dropId = use(idPromise);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (_: typeof INITIAL, formData: FormData) => {
    const result = await postReply(dropId, formData);
    return { error: result.ok ? null : result.error };
  }, INITIAL);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {avatar}
        <textarea
          name="body"
          rows={2}
          required
          maxLength={280}
          placeholder="Drop a reply…"
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          className="placeholder-gray flex-1 resize-none border-0 bg-transparent p-0 text-[15px] focus:ring-0 focus:outline-none"
        />
      </div>

      {state.error ? <p className="text-danger text-xs">{state.error}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Replying…' : 'Reply'}
        </Button>
      </div>
    </form>
  );
}

export function ReplyComposerFormSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="skeleton-animation h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-1.5">
          <div className="skeleton-animation h-4 w-3/4" />
          <div className="skeleton-animation h-4 w-1/2" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="skeleton-animation h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
