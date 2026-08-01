import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Tags page (/tag)', () => {
  test('initial page load shows the header while the tag list streams', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/tag');
      await expect(page.getByRole('heading', { level: 1, name: 'Trending Tags' })).toBeVisible();
      await expect(page.locator('main a[href^="/tag/"]')).toHaveCount(0);
    });

    await expect(page.locator('main a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
