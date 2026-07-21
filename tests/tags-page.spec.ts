import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Tags page (/tag)', () => {
  // The header is static, so it's in the shell. The tag list reads the slow-mode cookie, so it's
  // dynamic — absent under instant() and streamed in after, like the cookie-gated feeds.
  test('static shell — header present, tag list streams in', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/tag');
      await expect(page.getByRole('heading', { level: 1, name: 'Trending Tags' })).toBeVisible();
      await expect(page.locator('main a[href^="/tag/"]')).toHaveCount(0);
    });

    await expect(page.locator('main a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
