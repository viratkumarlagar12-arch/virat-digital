import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

test.describe('every page', () => {
  for (const route of ROUTES) {
    test(`${route} has one h1, a site title and a description`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/Virat Digital/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThanOrEqual(50);
      expect(description?.length ?? 0).toBeLessThanOrEqual(160);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  }

  test('titles are unique', async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES) {
      await page.goto(route);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(ROUTES.length);
  });
});

test('unknown URLs get the 404 page with a way home', async ({ page }) => {
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});

test('styleguide is reachable but not indexable', async ({ page }) => {
  const response = await page.goto('/styleguide/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('Archivo is self-hosted and loads', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost')) external.push(r.url());
  });
  await page.goto('/');
  const loaded = await page.evaluate(async () => (await document.fonts.load('800 16px Archivo')).length);
  expect(loaded).toBeGreaterThan(0);
  expect(external).toEqual([]);
});

test.describe('theme', () => {
  test('follows a light device setting before any click', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 245, 249)');
  });

  test('follows a dark device setting before any click', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 11, 15)');
  });

  test('toggle switches theme and the choice survives a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 245, 249)');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  });

  test("the marigold band's button is filled with each theme's ink", async ({ page }) => {
    const button = page.locator('.band-accent .btn-secondary');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/work/virat-digital-website/');
    await expect(button).toHaveCSS('background-color', 'rgb(11, 11, 15)');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/work/virat-digital-website/');
    await expect(button).toHaveCSS('background-color', 'rgb(14, 15, 40)');
  });
});
