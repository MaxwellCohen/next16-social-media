import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Profile page (/u/[handle])', () => {
  // Initial page load (MPA): the header is static, but the profile feed streams behind Suspense.
  test('initial page load (MPA) — profile feed absent', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/u/aurora');
      await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  // Client navigation (SPA): prefetch={true} resolves params, so the profile feed is present under instant().
  test('client navigation (SPA) — runtime-prefetched profile feed revealed', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('aside a[aria-label="Profile"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === '/u/aurora');
      await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
