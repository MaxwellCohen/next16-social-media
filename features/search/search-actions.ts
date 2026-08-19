'use server';

import { redirect, RedirectType } from 'next/navigation';
import { z } from 'zod';
import type { Route } from 'next';

const querySchema = z.string().trim().max(200);

export async function search(formData: FormData) {
  const parsed = querySchema.safeParse(formData.get('q') ?? '');
  const value = parsed.success ? parsed.data : '';
  redirect((value ? `/search?q=${encodeURIComponent(value)}` : '/search') as Route, RedirectType.replace);
}
