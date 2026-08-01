import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Drop page (/drop/[id])', () => {
  // Initial page load (MPA): a drop is cached by id, so it is present in the prerendered UI.
  test('initial page load (MPA) — cached drop present', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    const href = await link.getAttribute('href');
    if (!href) throw new Error('Expected the drop link to have an href');

    await instant(page, async () => {
      await page.goto(href);
      await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });

  // Client navigation (SPA): runtime prefetch resolves the drop and replies before the click commits.
  test('client navigation (SPA) — runtime-prefetched drop and replies revealed', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    const href = await link.getAttribute('href');
    if (!href) throw new Error('Expected the drop link to have an href');

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === href);
      await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Replies' })).toBeVisible();
    });
  });
});
