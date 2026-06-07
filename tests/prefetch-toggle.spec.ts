import { test, expect } from '@playwright/test';

// Prefetch toggle UI is currently hidden — implementation will change for stable 16.3.
test.describe.skip('Prefetch toggle', () => {
  test('toggle is visible and shows "Prefetch on" by default', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /prefetch/i });
    await expect(toggle).toBeVisible();
    await expect(toggle).toContainText('Prefetch on');
  });

  test('clicking toggle switches to "Prefetch off"', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /prefetch on/i });
    await toggle.click();

    // Page reloads, toggle should now say "off"
    await page.waitForLoadState('networkidle');
    const toggleOff = page.getByRole('button', { name: /prefetch off/i });
    await expect(toggleOff).toBeVisible({ timeout: 10000 });
  });
});
