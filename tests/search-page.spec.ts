import { test, expect } from '@playwright/test';

test.describe('Search page (/search)', () => {
  // Typing drives a router.replace per keystroke and the results stream from the server; the input lives
  // in a client shell above the results Suspense, so it must keep focus and capture every character.
  test('search keeps focus while results stream from the server', async ({ page }) => {
    await page.goto('/search');
    const search = page.getByRole('searchbox', { name: 'Search drops' });
    await search.waitFor({ state: 'visible', timeout: 15000 });
    await search.click();
    await page.keyboard.type('hello', { delay: 150 });
    await expect(search).toBeFocused();
    await expect(search).toHaveValue('hello');
  });
});
