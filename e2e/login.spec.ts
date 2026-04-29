import { test, expect } from '@playwright/test';
import { VALID_EMAIL, VALID_PASSWORD } from './helpers/auth';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    // Each test gets a fresh browser context — localStorage is empty by default.
    await page.goto('/login');
  });

  test('valid credentials redirect to /dashboard', async ({ page }) => {
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('invalid credentials show error and stay on /login', async ({ page }) => {
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('empty submission shows field validation errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
