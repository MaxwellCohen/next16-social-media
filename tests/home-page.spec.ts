import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test('shell has page header and skeletons, content streams in after', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article').first()).toBeVisible({ timeout: 15000 });

  await instant(page, async () => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Home' })).toBeVisible();
    await expect(page.locator('article')).toHaveCount(0);
  });

  await expect(page.locator('article').first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('navigation', { name: 'Feed sections' })).toBeVisible();
});
