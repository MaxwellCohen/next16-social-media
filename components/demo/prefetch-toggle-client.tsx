'use client';

import { Zap, ZapOff } from 'lucide-react';
import { useOptimistic } from 'react';
import { cn } from '@/lib/utils';

export function PrefetchToggleClient({
  enabled,
  toggleAction,
}: {
  enabled: boolean;
  toggleAction: (enable: boolean) => Promise<void>;
}) {
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled);

  return (
    <form
      action={async () => {
        setOptimisticEnabled(!optimisticEnabled);
        await toggleAction(!optimisticEnabled);
        window.location.reload();
      }}
      className="fixed right-4 bottom-4 z-50 hidden sm:block sm:right-6 sm:bottom-6"
    >
      <button
        type="submit"
        className={cn(
          'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md transition-colors',
          optimisticEnabled
            ? 'border-accent/30 bg-accent/10 text-accent dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400'
            : 'border-divider text-gray dark:border-divider-dark bg-white/80 dark:bg-black/80',
        )}
        aria-pressed={optimisticEnabled}
      >
        {optimisticEnabled ? <Zap className="size-3.5" /> : <ZapOff className="size-3.5" />}
        <span>{optimisticEnabled ? 'Prefetch on' : 'Prefetch off'}</span>
      </button>
    </form>
  );
}
