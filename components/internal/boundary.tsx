'use client';

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';

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
};

export function Boundary({ children, label }: Props) {
  const { mode } = useBoundaryMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    if (mode === 'off') return;
    const checkSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setIsSmall(width < 36 && height < 36);
      }
    };

    checkSize();
    const observer = new ResizeObserver(checkSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mode]);

  if (mode === 'off') {
    return <>{children}</>;
  }

  if (isSmall) {
    return (
      <div className="group/boundary relative" style={{ viewTransitionName: 'none' }}>
        <div ref={containerRef}>{children}</div>
        <div className="absolute -top-1 -right-1 flex items-center">
          <span className="pointer-events-none absolute right-full mr-1 hidden rounded bg-[#4f6ef7] px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold whitespace-nowrap text-white shadow group-hover/boundary:block">
            {label || 'Client'}
          </span>
          <div className="h-2.5 w-2.5 rounded-full bg-[#4f6ef7]" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-md border-2 border-[#4f6ef7]"
      style={{ viewTransitionName: 'none' }}
    >
      {label && (
        <span className="absolute -top-px left-2 -translate-y-full rounded-t bg-[#4f6ef7] px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold text-white">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
