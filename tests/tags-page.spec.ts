import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Tags page (/tag)', () => {
  // Initial page load (MPA): the header is prerendered, while the cookie-gated tag list streams in.
  test('initial page load (MPA) — header present, tag list streams in', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/tag');
      await expect(page.getByRole('heading', { level: 1, name: 'Trending Tags' })).toBeVisible();
      await expect(page.locator('main a[href^="/tag/"]')).toHaveCount(0);
    });

    await expect(page.locator('main a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
