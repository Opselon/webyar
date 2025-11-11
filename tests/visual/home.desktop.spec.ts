import { test, expect } from '@playwright/test';

test('homepage desktop screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/');
  await page.waitForTimeout(1000); // for animations to settle
  await expect(page).toHaveScreenshot('home-desktop.png', { fullPage: true });
});
