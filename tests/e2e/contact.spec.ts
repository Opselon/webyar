import { test, expect } from '@playwright/test';

test('Contact form', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/contact');

  // Fill out the form
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('This is a test message.');

  // Submit the form
  await page.getByRole('button', { name: /ارسال/i }).click();

  // Check for the success message
  await expect(page.locator('.success-message')).toBeVisible();
});
