import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Drop page (/drop/[id])', () => {
  // A drop is cached by id, so it's prerendered into the static shell — present under instant().
  test('static shell — cached drop present', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    const href = await link.getAttribute('href');

    await instant(page, async () => {
      await page.goto(href!);
      await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });

  // Client nav also resolves the drop under instant, and the replies section renders.
  test('runtime prefetch — drop revealed with replies', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await expect(page.locator('main article').first()).toBeVisible();
    });

    await expect(page.getByRole('heading', { level: 2, name: 'Replies' })).toBeVisible({ timeout: 15000 });
  });
});
