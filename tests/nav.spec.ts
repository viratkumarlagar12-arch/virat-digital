import { test, expect } from '@playwright/test';

test('first Tab reaches the skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('current page is marked in the navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/work/');
  const primary = page.getByRole('navigation', { name: 'Primary' });
  await expect(primary.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(primary.getByRole('link', { name: 'About', exact: true })).not.toHaveAttribute('aria-current', 'page');
});

test.describe('desktop services menu', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('opens on click, lists every service, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Services' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator('#servicesMenu');
    await expect(panel.getByRole('link')).toHaveCount(6); // 5 services + all services
    await expect(panel.getByRole('link', { name: 'YouTube design' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('closes when clicking elsewhere', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Services' });
    await button.click();
    await page.locator('h1').click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, makes the page behind it inert, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Websites' })).toBeVisible();
    await expect(nav.getByRole('link', { name: /WhatsApp/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  });

  test('locks page scroll while open', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
  });
});

test.describe('WhatsApp links', () => {
  test('use the business number', async ({ page }) => {
    await page.goto('/contact/');
    const hrefs = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href).toMatch(/^https:\/\/wa\.me\/918210618353(\?text=.+)?$/);
  });
});
