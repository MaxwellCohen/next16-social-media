'use client';
import { startTransition, useEffect, useState, type ReactNode } from 'react';

/** Visible only when scripting is enabled. Hides dead JS-only controls without JS. */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
  }, [setIsClient]);
  if (!isClient) {
    return null;
  }
  return <>{children}</>;
}
