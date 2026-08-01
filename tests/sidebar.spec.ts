import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Sidebar', () => {
  // Initial page load (MPA): nav links are baked into the prerendered UI and present under instant().
  // Trending tags read the slow-mode cookie, so they're dynamic and stream in after, like the feeds.
  test('initial page load (MPA) — nav links present, trending streams in', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('aside a[aria-label="Home"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Search"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Bookmarks"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Activity"]')).toBeVisible();
      await expect(page.locator('aside a[href^="/tag/"]')).toHaveCount(0);
    });

    // Dynamic, cookie-gated content streams in after the shell.
    await expect(page.locator('aside a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('aside a[href^="/u/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
