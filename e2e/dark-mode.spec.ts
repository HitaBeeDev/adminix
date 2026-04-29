import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

const THEME_KEY = 'adminix-theme';

test.describe('Dark mode persistence', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('toggling to dark mode persists after page refresh', async ({ page }) => {
    // Set light mode via localStorage (page is already on /dashboard from beforeEach login)
    await page.evaluate((key) => localStorage.setItem(key, 'light'), THEME_KEY);
    await page.reload();

    // Click the dark-mode toggle button
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();

    // DOM should gain the `dark` class immediately
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 2_000 });

    // localStorage should reflect the change
    const storedTheme = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
    expect(storedTheme).toBe('dark');

    // After a full reload the dark class is still applied (inline script in index.html)
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // And localStorage still says dark
    const storedAfterReload = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
    expect(storedAfterReload).toBe('dark');
  });

  test('toggling back to light mode removes the dark class', async ({ page }) => {
    // Force dark via localStorage (page is already on /dashboard from beforeEach login)
    await page.evaluate((key) => localStorage.setItem(key, 'dark'), THEME_KEY);
    await page.reload();

    await page.getByRole('button', { name: 'Switch to light mode' }).click();

    await expect(page.locator('html')).not.toHaveClass(/dark/, { timeout: 2_000 });

    const storedTheme = await page.evaluate((key) => localStorage.getItem(key), THEME_KEY);
    expect(storedTheme).toBe('light');
  });
});
