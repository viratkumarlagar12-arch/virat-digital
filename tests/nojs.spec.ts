import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

for (const route of ROUTES) {
  test(`${route} is readable without JavaScript`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });
}

test('no dead controls without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav-toggle')).toBeHidden();
  await expect(page.locator('.theme-toggle')).toBeHidden();
});

test('the header still leads to every page without JavaScript', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Menu' }).click();
  const footerNav = page.getByRole('navigation', { name: 'Footer' });
  await expect(footerNav).toBeInViewport();
  await expect(footerNav.getByRole('link', { name: 'YouTube design' })).toBeVisible();
  await expect(footerNav.getByRole('link', { name: 'Work' })).toBeVisible();
});

test('the theme follows the device without JavaScript', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 245, 249)');
});

test('the menu link is not shown when JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Menu' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await context.close();
});
