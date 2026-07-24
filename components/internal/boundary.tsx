'use client';

import { cloneElement, createContext, isValidElement, useContext, useEffect, useSyncExternalStore } from 'react';

export type BoundaryMode = 'off' | 'on';

type BoundaryContextType = {
  mode: BoundaryMode;
  toggleMode: () => void;
};

const BoundaryContext = createContext<BoundaryContextType | null>(null);

const BOUNDARY_MODE_KEY = 'boundaryMode';

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === BOUNDARY_MODE_KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}
function getSnapshot(): BoundaryMode {
  return localStorage.getItem(BOUNDARY_MODE_KEY) === 'on' ? 'on' : 'off';
}
function getServerSnapshot(): BoundaryMode {
  return 'off';
}

export function BoundaryProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleMode = () => {
    const next = mode === 'off' ? 'on' : 'off';
    localStorage.setItem(BOUNDARY_MODE_KEY, next);
    listeners.forEach(l => l());
  };

  useEffect(() => {
    document.documentElement.classList.toggle('boundary-mode', mode === 'on');
  }, [mode]);

  return <BoundaryContext.Provider value={{ mode, toggleMode }}>{children}</BoundaryContext.Provider>;
}

export function useBoundaryMode() {
  const ctx = useContext(BoundaryContext);
  if (!ctx) throw new Error('useBoundaryMode must be used within BoundaryProvider');
  return ctx;
}

type Props = {
  children: React.ReactNode;
  label?: string;
  asChild?: boolean;
};

// Tags the child's own DOM node so CSS outlines it — no wrapper, so layout is untouched.
// `asChild`: the single child is a component that forwards unknown props to its host
// node (Ariakit Dialog/Popover, next/link), including portaled ones.
export function Boundary({ children, label, asChild }: Props) {
  const { mode } = useBoundaryMode();
  const name = label ?? 'Client';

  if (isValidElement(children) && (asChild || typeof children.type === 'string')) {
    return cloneElement(children as React.ReactElement<{ 'data-component'?: string }>, { 'data-component': name });
  }

  // No host node to tag (Suspense/portal/conditional): wrap, and only in boundary mode.
  if (mode === 'off') {
    return <>{children}</>;
  }

  return <div data-component={name}>{children}</div>;
}
