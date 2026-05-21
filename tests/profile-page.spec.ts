import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test('shell shows header and banner, profile data streams in', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article').first()).toBeVisible({ timeout: 15000 });

  await instant(page, async () => {
    await page.goto('/u/aurora');

    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
  });

  const profileName = page.locator('header h1').last();
  await expect(profileName).toBeVisible({ timeout: 15000 });
});
