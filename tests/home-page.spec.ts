import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page (/)', () => {
  // Static shell (goto): the feed streams behind Suspense, so drops are absent under instant().
  test('static shell — feed absent', async ({ page }) => {
    await page.goto('/bookmarks');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  // Runtime prefetch (client nav): allow-runtime resolves searchParams, so the feed is present under instant().
  test('runtime prefetch — feed revealed', async ({ page }) => {
    await page.goto('/bookmarks');
    const link = page.locator('aside a[aria-label="Home"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
