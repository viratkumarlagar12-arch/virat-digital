import { test, expect } from '@playwright/test';
import sharp from 'sharp';
import { SERVICE_SLUGS } from './routes';

test.describe('hero', () => {
  test('says what the studio does and offers both ways to start', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-hero]');
    await expect(hero.locator('h1')).toContainText('creators and growing businesses');
    await expect(hero.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '/contact/');
    await expect(hero.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/918210618353/);
  });

  test('links to every service while there are too few work images for a strip', async ({ page }) => {
    await page.goto('/');
    const index = page.locator('[data-hero]').getByRole('list', { name: 'Services' });
    for (const slug of SERVICE_SLUGS) {
      await expect(index.locator(`a[href="/services/${slug}/"]`)).toHaveCount(1);
    }
  });

  test('brand render sits behind the content, from a local AVIF/WebP asset, in both themes', async ({ page }) => {
    const visual = page.locator('[data-hero] .hero-visual');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(visual).toBeVisible();
    await expect(visual).toHaveAttribute('alt', /letter V/);
    await expect(visual).toHaveAttribute('src', /^\/_astro\//);
    await expect(page.locator('[data-hero] picture source[type="image/avif"]')).toHaveCount(1);
    await expect(visual).toHaveCSS('position', 'absolute');
    await expect.poll(() => visual.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

    // Light theme: the same render, never a dark block. The strip at the
    // hero's right edge (no text there) must stay close to the page colour.
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(visual).toBeVisible();
    await expect.poll(() => visual.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const hero = (await page.locator('[data-hero]').boundingBox())!;
    const viewport = page.viewportSize()!;
    const strip = await page.screenshot({ clip: { x: viewport.width * 0.92, y: hero.y + hero.height * 0.2, width: viewport.width * 0.08, height: hero.height * 0.5 } });
    const { channels } = await sharp(strip).stats();
    expect((channels[0].mean + channels[1].mean + channels[2].mean) / 3).toBeGreaterThan(170);
  });

  test('headline animation causes no layout shift', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForTimeout(1800); // longer than the 1.1s animation
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(total), 100);
        }),
    );
    expect(cls).toBeLessThan(0.01);
  });

  // Fixed line breaks: 6 lines on phones, 4 from tablets up. The count must
  // hold with or without Archivo, so the font arriving never moves the page.
  const expectedLines = (width: number) => (width < 768 ? 6 : 4);
  const measure = (page: import('@playwright/test').Page) =>
    page.$eval('.hero-title', (h1) => ({
      lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
      overflow: h1.scrollWidth - h1.clientWidth,
    }));

  for (const width of [320, 390, 768, 1024, 1280, 1920]) {
    test(`headline keeps its lines and fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400); // let the widening finish
      const { lines, overflow } = await measure(page);
      expect(lines).toBe(expectedLines(width));
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const width of [390, 1280]) {
    test(`headline keeps its lines in the fallback font at ${width}px`, async ({ page }) => {
      await page.route('**/fonts/*.woff2', (route) => route.abort());
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const { lines } = await measure(page);
      expect(lines).toBe(expectedLines(width));
    });
  }
});

test('selected work shows featured projects with honest labels', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Selected work' }) });
  const cards = section.locator('article');
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card.locator('.badge')).toHaveText(/^(Concept|Self-initiated|Client project)$/);
  }
  await expect(section.getByRole('link', { name: 'See all work' })).toHaveAttribute('href', '/work/');
});

test('the thumbnail project shows the real thumbnail work, labelled self-initiated', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('[data-project="youtube-thumbnail-system"]');
  await expect(card.locator('.badge')).toHaveText('Self-initiated');
  await expect(card.locator('.media-word')).toHaveCount(0);
  await expect(card.locator('picture source[type="image/avif"]')).toHaveCount(1);
  const img = card.locator('img');
  await expect(img).toHaveAttribute('alt', /thumbnail/i);
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test('services section links to each service page', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Services', level: 2 }) });
  for (const slug of SERVICE_SLUGS) {
    await expect(section.locator(`a[href="/services/${slug}/"]`)).toHaveCount(1);
  }
});

test('process is a four-step ordered list', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ol.steps > li')).toHaveCount(4);
});

test('commitments state the reply time; no testimonials section without real ones', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'What you can count on' })).toBeVisible();
  await expect(page.getByText(/within 24 hours/).first()).toBeVisible();
  await expect(page.locator('[data-testimonials]')).toHaveCount(0);
});

test('FAQ answers open and close', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('.faq details');
  expect(await items.count()).toBeGreaterThanOrEqual(5);
  const first = items.first();
  await expect(first.locator('.faq-answer')).toBeHidden();
  await first.locator('summary').click();
  await expect(first.locator('.faq-answer')).toBeVisible();
});

test('page ends with the contact form', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-contact] form[name="contact"]')).toHaveCount(1);
});
