import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

const USER_ROW_LINK = 'a[href^="/users/"]';

test.describe('Invite user flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/users');
    await page.waitForSelector(USER_ROW_LINK, { timeout: 10_000 });
  });

  test('invited user appears in the table and shows success toast', async ({ page }) => {
    const uniqueEmail = `e2e.invite.${Date.now()}@example.com`;

    // Open modal
    await page.getByRole('button', { name: '+ Invite user' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill form — labels have no htmlFor so use placeholder/role selectors
    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder('Jane Smith').fill('E2E Test User');
    await dialog.getByPlaceholder('jane@example.com').fill(uniqueEmail);

    // First <select> is Role, second is Account
    const selects = dialog.locator('select');
    await selects.nth(0).selectOption('viewer');

    // Wait for accounts to load (Account select becomes enabled)
    await expect(selects.nth(1)).not.toBeDisabled({ timeout: 5_000 });
    await selects.nth(1).selectOption({ index: 1 });

    // Submit
    await dialog.getByRole('button', { name: 'Invite user' }).click();

    // Success toast
    await expect(page.getByText('E2E Test User has been invited.')).toBeVisible({ timeout: 5_000 });

    // Modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Search for the new user to confirm they appear in the table
    const searchInput = page.getByPlaceholder('Search by name or email...');
    await searchInput.fill('E2E Test User');
    await page.waitForURL(/search=E2E/, { timeout: 2_000 });

    await expect(page.locator(USER_ROW_LINK).first()).toContainText('E2E Test User', { timeout: 5_000 });
  });

  test('validation errors show when form is submitted empty', async ({ page }) => {
    await page.getByRole('button', { name: '+ Invite user' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Invite user' }).click();

    await expect(dialog.getByText('Name must be at least 2 characters')).toBeVisible();
    await expect(dialog.getByText('Enter a valid email address')).toBeVisible();
  });
});
