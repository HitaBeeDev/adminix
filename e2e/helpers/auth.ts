import type { Page } from '@playwright/test';

export const VALID_EMAIL = 'alex.morgan@adminix.dev';
export const VALID_PASSWORD = 'password';

export async function login(page: Page, email = VALID_EMAIL, password = VALID_PASSWORD) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
}
