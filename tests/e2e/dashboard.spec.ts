import { test, expect } from '@playwright/test';

test.describe('Dashboard flow', () => {
  test('should allow a user to log in and create a new post', async ({ page }) => {
    // Login
    await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/dashboard/login');
    await page.getByLabel('User').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: /ورود/i }).click();

    // Go to posts and create a new one
    await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/dashboard/posts');
    await page.getByRole('link', { name: /New Post/i }).click();
    await page.getByLabel('Title').fill('My New Post');
    await page.getByLabel('Content').fill('This is the content of my new post.');
    await page.getByRole('button', { name: /Save/i }).click();

    // Check that the post was created
    await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/blog');
    await expect(page.getByText('My New Post')).toBeVisible();
  });
});
