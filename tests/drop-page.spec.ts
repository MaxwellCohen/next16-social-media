import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test('shell shows skeleton, content streams in with composer and replies', async ({ page }) => {
  await page.goto('/');
  const firstDrop = page.locator('article').first();
  await firstDrop.waitFor({ timeout: 15000 });

  await instant(page, async () => {
    await firstDrop.locator('a[aria-label="Open drop"]').click();

    await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toBeVisible();
    await expect(page.getByPlaceholderText(/reply/i)).not.toBeVisible();
  });

  await expect(page.locator('article header').first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByPlaceholderText(/reply/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { level: 2, name: 'Replies' })).toBeVisible();
});
