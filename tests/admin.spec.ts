import { test, expect } from '@playwright/test';

// The admin dashboard is a client-provider + WebSocket admin surface (its own layout, outside the (app)
// group), so it's exercised functionally rather than with the static-shell/runtime-prefetch instant()
// split used for the streaming feed pages.
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
});
