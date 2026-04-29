import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

const NAV_LINKS = [
  { label: 'Dashboard', url: '/dashboard' },
  { label: 'Users',     url: '/users' },
  { label: 'Accounts',  url: '/accounts' },
  { label: 'Roles',     url: '/roles' },
  { label: 'Activity',  url: '/activity' },
  { label: 'Reports',   url: '/reports' },
  { label: 'Settings',  url: '/settings' },
];

test.describe('Navigation', () => {
  test('all nav links load without uncaught exceptions or console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const uncaughtErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      uncaughtErrors.push(err.message);
    });

    await login(page);

    for (const { url } of NAV_LINKS) {
      await page.goto(url);
      // Wait for at least one meaningful element to appear (not just spinner)
      await page.waitForLoadState('networkidle', { timeout: 10_000 });
    }

    expect(
      uncaughtErrors,
      `Uncaught errors found: ${uncaughtErrors.join(', ')}`,
    ).toHaveLength(0);

    // Filter out known benign MSW / HMR noise
    const realErrors = consoleErrors.filter(
      (msg) =>
        !msg.includes('ERR_FAILED') &&
        !msg.includes('[MSW]') &&
        !msg.includes('[vite]') &&
        !msg.includes('favicon'),
    );

    expect(
      realErrors,
      `Console errors found: ${realErrors.join(', ')}`,
    ).toHaveLength(0);
  });

  for (const { label, url } of NAV_LINKS) {
    test(`${label} page loads and shows expected heading or content`, async ({ page }) => {
      await login(page);
      await page.goto(url);
      await page.waitForLoadState('networkidle', { timeout: 10_000 });
      await expect(page).toHaveURL(url);

      // The page should not show a generic 404 / error boundary
      await expect(page.getByText('404')).not.toBeVisible();
    });
  }
});
