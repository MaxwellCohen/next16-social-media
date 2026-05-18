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
export function RelativeTime({ date }: { date: Date }) {
  const [label, setLabel] = useState(() => {
    return timeAgo(date);
  });

  useEffect(() => {
    setLabel(timeAgo(date));
    const id = setInterval(() => {
      setLabel(timeAgo(date));
    }, 60_000);
    return () => {
      clearInterval(id);
    };
  }, [date]);

  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {label}
    </time>
  );
}
