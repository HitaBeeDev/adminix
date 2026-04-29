import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

// The users table uses CSS grid divs — each user row contains a link to /users/:id
const USER_ROW_LINK = 'a[href^="/users/"]';

test.describe('Users page search', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/users');
    // Wait for at least one user row link to appear
    await page.waitForSelector(USER_ROW_LINK, { timeout: 10_000 });
  });

  test('search term is reflected in the URL', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name or email...');
    await searchInput.fill('Sarah');

    // URL updates after debounce (300 ms)
    await expect(page).toHaveURL(/search=Sarah/, { timeout: 2_000 });
  });

  test('search filters the visible results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name or email...');
    await searchInput.fill('Sarah');

    await page.waitForURL(/search=Sarah/);

    // At least one visible user row containing "Sarah"
    await expect(page.locator(USER_ROW_LINK).first()).toContainText('Sarah', { timeout: 5_000 });
  });

  test('clearing search restores all results and removes URL param', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name or email...');
    await searchInput.fill('Sarah');
    await page.waitForURL(/search=Sarah/);

    // Use fill('') to fire React's onChange (clear() does not dispatch synthetic events)
    await searchInput.fill('');

    // The `search` param should be gone from the URL after the debounce
    await expect(page).not.toHaveURL(/search=/, { timeout: 2_000 });

    // At least one user row is visible again
    await expect(page.locator(USER_ROW_LINK).first()).toBeVisible({ timeout: 5_000 });
  });
});
