import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

// The admin dashboard is a client-provider + WebSocket admin surface (its own layout, outside the (app)
// group), so it's mostly exercised functionally rather than with the static-shell/runtime-prefetch instant()
// split used for the streaming feed pages. The one instant() case pins the search input into the static
// shell: it must render before any streaming/socket data (the log search wraps the results Suspense).
test.describe('Admin dashboard (/admin)', () => {
  test('board loads with sub-nav and live presence', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('nav[aria-label="Admin dashboard views"]').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/watching/).first()).toBeVisible({ timeout: 15000 });
  });

  test('sub-nav switches between views', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('link', { exact: true, name: 'Activity log' }).click();
    await expect(page).toHaveURL(/\/admin\/log$/);
    await page.getByRole('link', { exact: true, name: 'Trends' }).click();
    await expect(page).toHaveURL(/\/admin\/trends$/);
  });

  test('activity row drills into a drop', async ({ page }) => {
    await page.goto('/admin/log');
    const row = page.locator('main a[href^="/drop/"]').first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.click();
    await expect(page).toHaveURL(/\/drop\//);
  });

  test('log search input is in the static shell before streaming', async ({ page }) => {
    await page.goto('/admin');
    await instant(page, async () => {
      await page.goto('/admin/log');
      await expect(page.getByRole('searchbox', { name: 'Search activity' })).toBeVisible();
      await expect(page.locator('main a[href^="/drop/"]')).toHaveCount(0);
    });
  });
});
