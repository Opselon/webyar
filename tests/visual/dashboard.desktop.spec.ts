import { test, expect } from '@playwright/test';

test('dashboard desktop screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8787/dashboard');
  await page.waitForTimeout(1000); // for animations to settle
  await expect(page).toHaveScreenshot('dashboard-desktop.png', { fullPage: true });
});
