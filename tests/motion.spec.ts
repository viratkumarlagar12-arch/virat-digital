import { test, expect, type Page } from '@playwright/test';

const cssAnimations = (page: Page) =>
  page.evaluate(() => document.getAnimations().filter((a) => 'animationName' in a).map((a) => (a as CSSAnimation).animationName));

test('on laptops the headline is the only thing that moves on its own', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  expect(await cssAnimations(page)).toEqual(['hero-expand']);
});

test('on phones nothing moves on its own', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await cssAnimations(page)).toEqual([]);
});

test('with reduced motion the headline arrives already wide', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.waitForTimeout(250); // the 150ms delay, nothing more
  await expect(page.locator('.hero-title')).toHaveCSS('font-stretch', '125%');
});

test('process steps light up as the visitor scrolls past them', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const steps = page.locator('ol.steps > li');
  await expect(steps.first()).not.toHaveClass(/is-active/);
  await steps.last().evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(steps.last()).toHaveClass(/is-active/);
  const progress = await page.locator('ol.steps').evaluate((el) => Number(el.style.getPropertyValue('--steps-progress')));
  expect(progress).toBeGreaterThan(0.9);
});

test.describe('sticky WhatsApp button on phones', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('appears after the first screen and steps aside at the contact form', async ({ page }) => {
    await page.goto('/');
    const sticky = page.locator('.wa-sticky');
    await expect(sticky).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await expect(sticky).toBeVisible();
    await expect(sticky).toHaveAttribute('href', /^https:\/\/wa\.me\/918210618353\?text=/);
    await page.locator('[data-contact] form').scrollIntoViewIfNeeded();
    await expect(sticky).toBeHidden();
  });
});

test('sticky WhatsApp button never shows on larger screens', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(300);
  await expect(page.locator('.wa-sticky')).toBeHidden();
});
