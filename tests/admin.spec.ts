import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

// The admin dashboard's live data is socket-driven, so under instant() the chrome is prerendered but the
// data is absent. There's no RSC runtime-prefetch reveal for the socket, hence no reveal case.
test.describe('Admin dashboard (/admin)', () => {
  test('overview static shell — chrome present, live data absent', async ({ page }) => {
    await page.goto('/');
    await instant(page, async () => {
      await page.goto('/admin');
      await expect(page.getByRole('link', { name: 'Admin dashboard' })).toBeVisible();
      await expect(page.locator('main a[href^="/drop/"]')).toHaveCount(0);
    });
  });

  test('log static shell — search present, log absent', async ({ page }) => {
    await page.goto('/admin');
    await instant(page, async () => {
      await page.goto('/admin/log');
      await expect(page.getByRole('searchbox', { name: 'Search activity' })).toBeVisible();
      await expect(page.locator('main a[href^="/drop/"]')).toHaveCount(0);
    });
  });
});
