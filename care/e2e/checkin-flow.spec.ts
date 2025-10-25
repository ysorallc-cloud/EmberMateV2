import { test, expect } from '@playwright/test';

test('daily check-in happy path', async ({ page }) => {
  await page.goto('/settings');
  await page.getByText('Seed demo data').click();
  await page.goto('/check-in');
  await page.getByRole('button', { name: 'All taken' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});
