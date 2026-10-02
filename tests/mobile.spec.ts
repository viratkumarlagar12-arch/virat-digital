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

test('at 320px the WhatsApp button label fits on one line', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  const box = await page.locator('[data-hero] a[href*="wa.me"]').boundingBox();
  expect(box!.height).toBeLessThanOrEqual(56);
});
