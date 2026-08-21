import { Monitor, Moon, Sun } from 'lucide-react';
import { Boundary } from '@/components/internal/boundary';
import { setTheme } from '@/components/theme/theme-actions';
import type { ThemePreference } from '@/components/theme/theme-constants';
import { formAction } from '@/lib/form-action';
import { cn } from '@/lib/utils';

type Props = { variant?: 'pill' | 'inline'; theme?: ThemePreference };

export function ThemeToggle({ variant = 'pill', theme = 'system' }: Props) {
  const wrapperClass =
    variant === 'inline'
      ? 'inline-flex items-center gap-0.5'
      : 'border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5';

  return (
    <Boundary label="ThemeToggle">
      <div style={{ viewTransitionName: 'theme-toggle' }} className={wrapperClass}>
        <ThemeButton active={theme === 'light'} label="Light mode" theme="light">
          <Sun className="size-4" />
        </ThemeButton>
        <ThemeButton active={theme === 'dark'} label="Dark mode" theme="dark">
          <Moon className="size-4" />
        </ThemeButton>
        <ThemeButton active={theme === 'system'} label="System theme" theme="system">
          <Monitor className="size-4" />
        </ThemeButton>
      </div>
    </Boundary>
  );
}

function ThemeButton({
  active,
  label,
  theme,
  children,
}: {
  active: boolean;
  label: string;
  theme: ThemePreference;
  children: React.ReactNode;
}) {
  return (
    <form action={formAction(setTheme, theme)}>
      <button
        type="submit"
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
    </form>
  );
}
