import { test, expect } from '@playwright/test';

test('Blog flow', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/blog');

  // Click on the first blog post
  await page.locator('.post-card a').first().click();

  // Check that the post title is visible
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
