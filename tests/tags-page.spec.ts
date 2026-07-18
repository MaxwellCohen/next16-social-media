import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Tags page (/tag)', () => {
  // The tag list is globally cached, so it's prerendered into the static shell — present under
  // instant() — unlike the cookie-gated feeds that stream in.
  test('static shell — header and cached tag list present', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/tag');
      await expect(page.getByRole('heading', { level: 1, name: 'Trending Tags' })).toBeVisible();
      await expect(page.locator('main a[href^="/tag/"]').first()).toBeVisible();
    });
  });
});
