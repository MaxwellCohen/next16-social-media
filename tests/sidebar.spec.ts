import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Sidebar', () => {
  test('initial page load shows nav links while right rail content streams behind skeletons', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('aside a[aria-label="Home"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Search"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Bookmarks"]')).toBeVisible();
      await expect(page.locator('aside a[aria-label="Activity"]')).toBeVisible();
      await expect(page.locator('aside a[href^="/tag/"]')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Trending now' })).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Who to follow' })).toHaveCount(0);
    });

    // Dynamic, cookie-gated content streams in after the skeletons.
    await expect(page.locator('aside a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('aside a[href^="/u/"]').first()).toBeVisible({ timeout: 15000 });
  });
});
