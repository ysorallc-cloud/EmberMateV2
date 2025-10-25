import { test, expect } from '@playwright/test';

test('first-run disclaimer gate shows and can be accepted', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'I understand' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
