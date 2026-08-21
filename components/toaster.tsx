'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <div style={{ viewTransitionName: 'toaster' }} className="pointer-events-none fixed inset-0 z-9999">
      <SonnerToaster theme="system" position="bottom-right" />
    </div>
  );
}
