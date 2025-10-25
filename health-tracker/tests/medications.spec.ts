import { test, expect } from '@playwright/test';

test.describe('Medications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Accept disclaimer
    await page.getByRole('button', { name: 'I Understand' }).click();
    await page.getByRole('link', { name: 'Medications' }).click();
  });

  test('should display empty state when no medications', async ({ page }) => {
    await expect(page.getByText('No medications added')).toBeVisible();
    await expect(page.getByText('Add your first medication to start tracking')).toBeVisible();
  });

  test('should open add medication form', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Medication' }).click();
    await expect(page.getByText('Add Medication')).toBeVisible();
    await expect(page.getByText('Medication Name')).toBeVisible();
  });

  test('should add a new medication', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Medication' }).click();
    
    // Fill in medication details
    await page.getByPlaceholder('e.g., Metformin').fill('Test Medication');
    await page.getByDisplayValue('1').fill('500');
    await page.getByRole('combobox').selectOption('mg');
    
    // Set schedule
    await page.getByDisplayValue('08:00').fill('09:00');
    
    // Select days
    await page.getByLabel('Monday').check();
    await page.getByLabel('Tuesday').check();
    await page.getByLabel('Wednesday').check();
    await page.getByLabel('Thursday').check();
    await page.getByLabel('Friday').check();
    
    // Submit form
    await page.getByRole('button', { name: 'Add Medication' }).click();
    
    // Verify medication was added
    await expect(page.getByText('Test Medication')).toBeVisible();
    await expect(page.getByText('500 mg')).toBeVisible();
  });

  test('should edit existing medication', async ({ page }) => {
    // First add a medication
    await page.getByRole('button', { name: 'Add Medication' }).click();
    await page.getByPlaceholder('e.g., Metformin').fill('Test Medication');
    await page.getByRole('button', { name: 'Add Medication' }).click();
    
    // Edit the medication
    await page.getByRole('button').filter({ hasText: '' }).first().click();
    await expect(page.getByText('Edit Medication')).toBeVisible();
    
    // Change the name
    await page.getByDisplayValue('Test Medication').fill('Updated Medication');
    await page.getByRole('button', { name: 'Update Medication' }).click();
    
    // Verify changes
    await expect(page.getByText('Updated Medication')).toBeVisible();
  });
});