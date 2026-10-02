import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES } from './routes';

for (const scheme of ['dark', 'light'] as const) {
  test.describe(`${scheme} theme`, () => {
    for (const route of ROUTES) {
      test(`${route} has no serious axe violations`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        const serious = results.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect(serious).toEqual([]);
      });
    }
  });
}

for (const route of ROUTES) {
  test(`${route} never skips a heading level`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (hs) => hs.map((h) => Number(h.tagName[1])));
    const skips = levels.filter((level, i) => i > 0 && level > levels[i - 1] + 1);
    expect(levels[0]).toBe(1);
    expect(skips).toEqual([]);
  });

  test(`${route} has no sideways scroll at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
  });
}
