import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Sidebar', () => {
  // Nav links are static and trending tags are globally cached, so both are baked into the
  // static shell — present under instant() — unlike the cookie-gated feeds.
  test('static shell — nav links and cached trending present', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('aside a[aria-label="Home"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Search"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Bookmarks"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Activity"]')).toBeVisible();
      await expect(page.locator('aside a[href^="/tag/"]').first()).toBeVisible();
    });

    await expect(page.locator('aside a[href^="/u/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
