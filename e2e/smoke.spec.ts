import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('the home page should load and have the correct title @smoke', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/JobEqual Platform/);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
