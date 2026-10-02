import { test, expect } from '@playwright/test';
import { SERVICE_SLUGS } from './routes';

test('services overview lists every service page', async ({ page }) => {
  await page.goto('/services/');
  const main = page.locator('main');
  for (const slug of SERVICE_SLUGS) {
    await expect(main.locator(`a[href="/services/${slug}/"]`).first()).toBeVisible();
  }
});

for (const slug of SERVICE_SLUGS) {
  test.describe(`/services/${slug}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/services/${slug}/`);
    });

    test('has enough real substance to stand as its own page', async ({ page }) => {
      // 400, not more: the copy was deliberately tightened (Oct 2026). Below
      // this a service page starts to read as thin to visitors and to Google.
      const words = (await page.locator('main').innerText()).split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(400);
      await expect(page.locator('main')).not.toContainText('{');
    });

    test('keeps body text to a readable line length', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const charsPerLine = await page.$eval('.prose p', (p) => {
        const style = getComputedStyle(p);
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.font = `${style.fontSize} ${style.fontFamily}`;
        const avg = ctx.measureText('abcdefghijklmnopqrstuvwxyz ').width / 27;
        return p.getBoundingClientRect().width / avg;
      });
      expect(charsPerLine).toBeLessThanOrEqual(85);
    });

    test('lists concrete deliverables and answers questions', async ({ page }) => {
      const deliverables = page.locator('section', { has: page.getByRole('heading', { name: 'What you get' }) }).locator('li');
      expect(await deliverables.count()).toBeGreaterThanOrEqual(4);
      expect(await page.locator('.faq details').count()).toBeGreaterThanOrEqual(3);
    });

    test('shows related work from this service', async ({ page }) => {
      const related = page.locator('section', { has: page.getByRole('heading', { name: 'Related work' }) });
      const cards = related.locator('article');
      expect(await cards.count()).toBeGreaterThanOrEqual(1);
      for (const card of await cards.all()) await expect(card).toHaveAttribute('data-service', slug);
    });

    test('primary action leads to a form with this service selected', async ({ page }) => {
      await page.locator('.page-hero').getByRole('link', { name: /^Start an? / }).click();
      await expect(page.locator('#contact form select[name="service"]')).toHaveValue(slug);
    });

    test('WhatsApp links carry a message about this service', async ({ page }) => {
      const href = await page.locator('.page-hero a[href*="wa.me"]').getAttribute('href');
      expect(decodeURIComponent(href ?? '')).toMatch(/text=Hi Virat Digital, I'd like to talk about/);
    });

    test('breadcrumb leads back to all services', async ({ page }) => {
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services/');
    });
  });
}
