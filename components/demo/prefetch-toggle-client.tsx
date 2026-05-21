'use client';

import { Zap, ZapOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import { togglePrefetch } from './prefetch-toggle-action';

export function PrefetchToggleClient({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled);

  return (
    <form
      action={async () => {
        setOptimisticEnabled(!optimisticEnabled);
        await togglePrefetch(!optimisticEnabled);
        router.refresh();
      }}
    >
      <button
        type="submit"
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs tracking-tight transition-colors',
          optimisticEnabled
            ? 'text-accent hover:bg-accent/10 dark:hover:bg-accent/15 dark:text-blue-400'
            : 'text-muted hover:bg-card dark:text-muted-dark dark:hover:bg-card-dark',
        )}
      >
        {optimisticEnabled ? <Zap className="size-4" /> : <ZapOff className="size-4" />}
        <span>{optimisticEnabled ? 'Prefetch on' : 'Prefetch off'}</span>
      </button>
    </form>
  );
}
