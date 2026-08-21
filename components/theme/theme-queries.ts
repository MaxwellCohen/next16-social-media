import { cookies } from 'next/headers';
import { THEME_COOKIE, type ThemePreference } from '@/components/theme/theme-constants';

export async function getThemePreference(): Promise<ThemePreference> {
  const store = await cookies();
  const value = store.get(THEME_COOKIE)?.value;
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return 'system';
}

/** Class for <html> when preference is explicit. System resolved by ThemeScript. */
export function themeHtmlClass(theme: ThemePreference): string {
  if (theme === 'dark') return 'dark';
  return '';
}
