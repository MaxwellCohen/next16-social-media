import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page (/)', () => {
  // Initial page load (MPA): the feed streams behind Suspense, so drops are absent under instant().
  test('initial page load (MPA) — feed absent', async ({ page }) => {
    await page.goto('/bookmarks');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  // Client navigation (SPA): prefetch={true} resolves searchParams, so the feed is present under instant().
  test('client navigation (SPA) — runtime-prefetched feed revealed', async ({ page }) => {
    await page.goto('/bookmarks');
    const link = page.locator('aside a[aria-label="Home"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === '/');
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
