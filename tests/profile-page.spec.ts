import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Profile page (/u/[handle])', () => {
  // Static shell (goto): the header is static, but the profile feed streams behind Suspense, so it's absent under instant().
  test('static shell — profile feed absent', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/u/aurora');
      await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  // Runtime prefetch (client nav): allow-runtime resolves params, so the profile feed is present under instant().
  test('runtime prefetch — profile feed revealed', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('aside a[aria-label="Profile"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
