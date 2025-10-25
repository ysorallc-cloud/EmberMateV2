import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard with correct title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Health Dashboard' })).toBeVisible();
  });

  test('should show disclaimer modal on first visit', async ({ page }) => {
    await expect(page.getByText('Important Disclaimer')).toBeVisible();
    await expect(page.getByText('Not HIPAA Compliant')).toBeVisible();
  });

  test('should accept disclaimer and show dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'I Understand' }).click();
    await expect(page.getByText('Important Disclaimer')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Health Dashboard' })).toBeVisible();
  });

  test('should open daily check-in modal', async ({ page }) => {
    // Accept disclaimer first
    await page.getByRole('button', { name: 'I Understand' }).click();
    
    // Click the floating action button
    await page.getByRole('button').filter({ hasText: '' }).first().click();
    
    await expect(page.getByText('Daily Check-In')).toBeVisible();
    await expect(page.getByText('Medications')).toBeVisible();
  });

  test('should navigate to medications page', async ({ page }) => {
    await page.getByRole('button', { name: 'I Understand' }).click();
    await page.getByRole('link', { name: 'Medications' }).click();
    await expect(page.getByRole('heading', { name: 'Medications' })).toBeVisible();
  });

  test('should navigate to vitals page', async ({ page }) => {
    await page.getByRole('button', { name: 'I Understand' }).click();
    await page.getByRole('link', { name: 'Vitals' }).click();
    await expect(page.getByRole('heading', { name: 'Vitals & Trends' })).toBeVisible();
  });
});