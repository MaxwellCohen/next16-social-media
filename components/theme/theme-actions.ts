'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { THEME_COOKIE, type ThemePreference } from '@/components/theme/theme-constants';

const themeSchema = z.enum(['light', 'dark', 'system']);

export async function setTheme(theme: ThemePreference) {
  const parsed = themeSchema.safeParse(theme);
  if (!parsed.success) return;
  const store = await cookies();
  store.set(THEME_COOKIE, parsed.data, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  refresh();
}
