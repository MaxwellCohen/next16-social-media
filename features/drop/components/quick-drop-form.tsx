'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { postDrop } from '@/features/drop/drop-actions';

type Props = {
  avatar: React.ReactNode;
};

export function QuickDropForm({ avatar }: Props) {
  const [, formAction, isPending] = useActionState(async (_: unknown, formData: FormData) => {
    const result = await postDrop(formData);
    if (!result.ok) {
      toast.error(result.error);
    } else {
      toast.success('Dropped!');
    }
    return null;
  }, null);

  return (
    <section className="border-divider/70 dark:border-divider-dark/70 hidden items-center gap-3 border-b p-4 sm:flex sm:p-5">
      {avatar}
      <form action={formAction} className="flex flex-1 items-center gap-2">
        <input
          type="text"
          name="body"
          required
          maxLength={1000}
          placeholder="What did you build today?"
          className="placeholder-gray border-divider focus:border-accent dark:border-divider-dark dark:focus:border-accent flex-1 rounded-full border bg-transparent px-4 py-2 text-sm focus:ring-0 focus:outline-none"
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Drop it
        </Button>
      </form>
    </section>
  );
}
