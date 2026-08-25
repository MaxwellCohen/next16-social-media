import { ViewTransition } from 'react';

/**
 * Soft reveal when Suspense content streams in.
 * Pair with `<ExitFade>` around the matching fallback for a handoff.
 */
export function Crossfade({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="slide-up" default="none">
      {children}
    </ViewTransition>
  );
}

/** Fades a Suspense fallback out as real content enters. */
export function ExitFade({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition exit="fade-out" default="none">
      {children}
    </ViewTransition>
  );
}
