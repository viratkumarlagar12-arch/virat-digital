import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/about/');
});

test('explains the one-person studio without placeholders', async ({ page }) => {
  await expect(page.locator('main')).toContainText('one-person studio');
  await expect(page.locator('main')).not.toContainText('[');
  await expect(page.locator('main')).not.toContainText('{');
});

test('lists the tools named in the projects, grouped by service', async ({ page }) => {
  const tools = page.locator('section', { has: page.getByRole('heading', { name: 'Tools I use' }) });
  await expect(tools.getByRole('heading', { name: 'YouTube design' })).toBeVisible();
  for (const tool of ['Figma', 'Photoshop', 'Astro', 'n8n']) await expect(tools.getByText(tool, { exact: true }).first()).toBeVisible();
});

test('links to the YouTube channel and ends with the contact form', async ({ page }) => {
  await expect(page.locator('main a[href="https://youtube.com/@viratdigitalmarketing"]').first()).toBeVisible();
  await expect(page.locator('[data-contact] form[name="contact"]')).toHaveCount(1);
});
