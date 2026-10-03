import { test, expect } from '@playwright/test';

test.describe('phones (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('contact page: the form follows the intro closely, and the channels are introduced where they appear', async ({ page }) => {
    await page.goto('/contact/');
    const lead = await page.locator('.page-hero .t-lead').boundingBox();
    const form = await page.locator('form[name="contact"]').boundingBox();
    expect(form!.y - (lead!.y + lead!.height)).toBeLessThan(100);

    const intro = await page.getByText('Prefer to talk first?').boundingBox();
    const list = await page.locator('.contact-list').boundingBox();
    expect(intro!.y).toBeGreaterThan(form!.y + form!.height);
    expect(list!.y).toBeGreaterThan(intro!.y);
  });

  test('page-hero actions fill the width, like the home page', async ({ page }) => {
    await page.goto('/services/websites/');
    const container = await page.locator('.page-hero .container').evaluate((el) => {
      const s = getComputedStyle(el);
      return el.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    });
    const button = await page.locator('.page-hero .btn-primary').boundingBox();
    expect(Math.round(button!.width)).toBe(Math.round(container));
  });

  test('footer contact details are never broken mid-word', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('navigation', { name: 'Footer' });
    for (const name of [/WhatsApp/, /@gmail\.com/]) {
      const lines = await footer.getByRole('link', { name }).evaluate((a) => a.getClientRects().length);
      expect(lines).toBe(1);
    }
  });
});

test.describe('services on touch phones (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const firstRow = (page: import('@playwright/test').Page) =>
    page.locator('section', { has: page.getByRole('heading', { name: 'Services', level: 2 }) }).locator('.service-row').first();

  test("what's included reads as a list, two to a row", async ({ page }) => {
    await page.goto('/');
    const lefts = await firstRow(page).locator('.service-row-includes li').evaluateAll((items) =>
      items.map((li) => Math.round(li.getBoundingClientRect().left)),
    );
    expect(lefts).toHaveLength(5);
    expect(new Set(lefts).size).toBe(2);
  });

  test('service titles are underlined, so they read as links', async ({ page }) => {
    await page.goto('/');
    await expect(firstRow(page).locator('.service-row-title a')).not.toHaveCSS('text-decoration-color', 'rgba(0, 0, 0, 0)');
  });
});

test('on desktop, service titles stay plain until hovered', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.service-row-title a').first()).toHaveCSS('text-decoration-color', 'rgba(0, 0, 0, 0)');
});

test('on phones the founder portrait sits between the heading and the statement, 160px wide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const section = page.locator('section', { has: page.getByRole('heading', { name: /Who you.ll work with/ }) });
  const heading = (await section.getByRole('heading').boundingBox())!;
  const portrait = (await section.locator('.about-portrait').boundingBox())!;
  const statement = (await section.locator('.about-statement').boundingBox())!;
  expect(Math.round(portrait.width)).toBe(160);
  expect(portrait.y).toBeGreaterThan(heading.y + heading.height);
  expect(statement.y).toBeGreaterThan(portrait.y + portrait.height);
});

test('at 320px the WhatsApp button label fits on one line', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  const box = await page.locator('[data-hero] a[href*="wa.me"]').boundingBox();
  expect(box!.height).toBeLessThanOrEqual(56);
});
