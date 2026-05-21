import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test('shell shows header, tags list streams in', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article').first()).toBeVisible({ timeout: 15000 });

  await instant(page, async () => {
    await page.goto('/tag');

    await expect(page.getByRole('heading', { level: 1, name: 'Tags' })).toBeVisible();
    await expect(page.locator('main a[href^="/tag/"]')).toHaveCount(0);
  });

  await expect(page.locator('main a[href^="/tag/"]').first()).toBeVisible({ timeout: 15000 });
});
