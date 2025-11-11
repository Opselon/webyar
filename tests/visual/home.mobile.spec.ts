import { test, expect } from '@playwright/test';

test('homepage mobile screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/');
  await page.waitForTimeout(1000); // for animations to settle
  await expect(page).toHaveScreenshot('home-mobile.png', { fullPage: true });
});
