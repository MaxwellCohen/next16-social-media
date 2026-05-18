'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{ viewTransitionName: 'theme-toggle' }}
      className="border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5"
    >
      {!mounted ? (
        <>
          <span className="rounded-full p-1.5">
            <Sun className="size-4 opacity-0" />
          </span>
          <span className="rounded-full p-1.5">
            <Moon className="size-4 opacity-0" />
          </span>
          <span className="rounded-full p-1.5">
            <Monitor className="size-4 opacity-0" />
          </span>
        </>
      ) : (
        <>
          <ToggleButton active={theme === 'light'} label="Light mode" onClick={() => setTheme('light')}>
            <Sun className="size-4" />
          </ToggleButton>
          <ToggleButton active={theme === 'dark'} label="Dark mode" onClick={() => setTheme('dark')}>
            <Moon className="size-4" />
          </ToggleButton>
          <ToggleButton active={theme === 'system'} label="System theme" onClick={() => setTheme('system')}>
            <Monitor className="size-4" />
          </ToggleButton>
        </>
      )}
    </div>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        active
          ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
          : 'text-gray hover:text-black dark:hover:text-white',
      )}
    >
      {children}
    </button>
  );
}
