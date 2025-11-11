import { test, expect } from '@playwright/test';

test('homepage loads and CTA works', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: /مشاوره/i }).click();
  await expect(page).toHaveURL(/contact|services/);
});
