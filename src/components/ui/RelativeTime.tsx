'use client';

import { useEffect, useState } from 'react';
import { timeAgo } from '@/lib/utils';

/**
 * Client-rendered relative timestamp. Reading `Date.now()` is a runtime
 * concern that doesn't belong in the cached server tree, so the formatter
 * runs in the browser and re-evaluates as time passes. We suppress the
 * hydration warning because the value is *expected* to disagree with the
 * server's snapshot — the server can't know the exact second the client
 * hydrates.
 */
export function RelativeTime({ date, verbose = false }: { date: Date; verbose?: boolean }) {
  const [label, setLabel] = useState(() => {
    return verbose ? formatAbsolute(date) : timeAgo(date);
  });

  useEffect(() => {
    const update = () => {
      setLabel(verbose ? formatAbsolute(date) : timeAgo(date));
    };
    update();
    if (verbose) return;
    const id = setInterval(update, 60_000);
    return () => {
      clearInterval(id);
    };
  }, [date, verbose]);

  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {label}
    </time>
  );
}

function formatAbsolute(date: Date): string {
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const day = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${time} · ${day}`;
}
