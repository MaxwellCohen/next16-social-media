'use client';

import { useRef, useState, useTransition } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { postReply } from '@/data/actions/drop';

type Props = {
  dropId: string;
  authorName: string;
  authorColor: string;
};

export function ReplyComposerForm({ dropId, authorName, authorColor }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData: FormData) => {
        setError(null);
        startTransition(async () => {
          const result = await postReply(dropId, formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          formRef.current?.reset();
        });
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex gap-3">
        <Avatar name={authorName} color={authorColor} size="md" />
        <textarea
          name="body"
          rows={2}
          required
          maxLength={280}
          placeholder="Drop a reply…"
          className="placeholder-gray flex-1 resize-none border-0 bg-transparent p-0 text-[15px] focus:ring-0 focus:outline-none"
        />
      </div>

      {error ? <p className="text-danger text-xs">{error}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Replying…' : 'Reply'}
        </Button>
      </div>
    </form>
  );
}
