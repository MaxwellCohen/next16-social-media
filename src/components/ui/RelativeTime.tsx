'use client';

import { useEffect, useState } from 'react';
import { timeAgo } from '@/lib/utils';

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
