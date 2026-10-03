import { test, expect, type Page } from '@playwright/test';

// Headings follow one scale on phones (approved October 2026): hero H1 >
// page H1 > section H2 > H3, with looser leading. From 768px up the sizes
// and leading are exactly what they were before.

const roles = {
  hero: ['/', '.hero-title'],
  pageH1: ['/services/graphic-design/', 'main h1'],
  h2: ['/', 'section:has(.service-rows) h2'],
  proseH2: ['/services/graphic-design/', '.prose h2'],
  rowH3: ['/', '.service-row-title'],
} as const;
type Role = keyof typeof roles;

async function measure(page: Page, role: Role) {
  const [path, selector] = roles[role];
  if (new URL(page.url() || 'http://x/').pathname !== path) {
    await page.goto(path);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})));
    });
  }
  return page.locator(selector).first().evaluate((el) => {
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize), lh = parseFloat(s.lineHeight);
    return { size, leading: lh / size, lines: Math.round(el.getBoundingClientRect().height / lh) };
  });
}

const phone: Record<number, Record<Role, number>> = {
  320: { hero: 35.1, pageH1: 32.0, h2: 26.0, proseH2: 26.0, rowH3: 24 },
  375: { hero: 41.8, pageH1: 35.6, h2: 28.4, proseH2: 28.4, rowH3: 24 },
  390: { hero: 43.5, pageH1: 36.5, h2: 29.0, proseH2: 29.0, rowH3: 24 },
};
const leading: Record<Role, number> = { hero: 1, pageH1: 1, h2: 1.1, proseH2: 1.1, rowH3: 1.1 };

for (const width of [320, 375, 390]) {
  test.describe(`headings at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } });

    test('follow the phone scale', async ({ page }) => {
      for (const role of Object.keys(roles) as Role[]) {
        const m = await measure(page, role);
        expect(m.size, `${role} size`).toBeCloseTo(phone[width][role], 0);
        expect(m.leading, `${role} leading`).toBeCloseTo(leading[role], 2);
      }
    });

    test('break into the expected number of lines, without overflow', async ({ page }) => {
      expect((await measure(page, 'hero')).lines).toBe(6);
      expect((await measure(page, 'pageH1')).lines).toBe(4);
      await page.goto('/');
      for (const h2 of await page.locator('main section > .container h2, main .section-head h2').all()) {
        const text = (await h2.textContent())!.trim();
        const lines = await h2.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
        expect(lines, text).toBe(width === 320 && text === 'Tell me about your project' ? 2 : 1);
      }
      for (const path of ['/', '/about/', '/services/', '/services/graphic-design/', '/work/', '/contact/']) {
        await page.goto(path);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBeLessThanOrEqual(0);
      }
    });
  });
}

// Measured before the change; tablets and desktops must not move.
const unchanged: Record<number, Record<Role, [number, number]>> = {
  768: { hero: [62.2, 57.22], pageH1: [60.67, 55.82], h2: [45.44, 46.35], proseH2: [33.92, 34.6], rowH3: [33.92, 37.31] },
  1024: { hero: [74.84, 68.85], pageH1: [74.5, 68.54], h2: [53.12, 54.18], proseH2: [36, 36.72], rowH3: [36, 39.6] },
  1440: { hero: [96, 88.32], pageH1: [96, 88.32], h2: [60, 61.2], proseH2: [36, 36.72], rowH3: [36, 39.6] },
};

for (const width of [768, 1024, 1440]) {
  test(`headings at ${width}px are unchanged`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const role of Object.keys(roles) as Role[]) {
      const m = await measure(page, role);
      const [size, lineHeight] = unchanged[width][role];
      expect(m.size, `${role} size`).toBeCloseTo(size, 1);
      expect(m.size * m.leading, `${role} line height`).toBeCloseTo(lineHeight, 1);
    }
  });
}
