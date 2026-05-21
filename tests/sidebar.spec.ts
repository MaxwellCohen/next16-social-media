import { test, expect } from '@playwright/test';

test('trending tags header is static, list streams in', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 3, name: 'Trending now' })).toBeVisible();
  await expect(page.locator('aside a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
});

test('who to follow header is static, users stream in', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 3, name: 'Who to follow' })).toBeVisible();
  await expect(page.locator('aside a[href^="/u/"]').first()).toBeVisible({ timeout: 15000 });
});
