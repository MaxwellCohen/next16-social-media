'use client';

import { RotateCcw } from 'lucide-react';
import { useTransition } from 'react';
import { resetDemo } from '@/data/actions/seed';

export function ResetDemoButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await resetDemo();
        });
      }}
      disabled={pending}
      className="text-gray hover:text-black dark:hover:text-white inline-flex items-center gap-1.5 self-start font-mono text-[11px] transition-colors disabled:opacity-50"
      aria-label="Reset demo data"
    >
      <RotateCcw className={pending ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} />
      <span>{pending ? 'resetting…' : 'reset demo'}</span>
    </button>
  );
}
