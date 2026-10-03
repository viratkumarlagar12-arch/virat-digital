import { test, expect } from '@playwright/test';

const cards = (page: import('@playwright/test').Page) => page.locator('main .work-card');

test('work index shows every project with an honest label', async ({ page }) => {
  await page.goto('/work/');
  await expect(cards(page)).toHaveCount(7);
  for (const card of await cards(page).all()) {
    await expect(card.locator('.badge')).toHaveText(/^(Concept|Self-initiated|Client project)$/);
  }
});

test('the banner card shows the real banner, still labelled Concept, unlinked and banner-shaped', async ({ page }) => {
  await page.goto('/work/');
  const card = page.locator('[data-project="youtube-banner-concept"]');
  await expect(card.locator('.badge')).toHaveText('Concept');
  await expect(card.locator('.card-title')).toHaveText('YouTube banner concept');
  await expect(card.locator('.media-word')).toHaveCount(0);
  await expect(card.locator('picture source[type="image/avif"]')).toHaveCount(1);
  const img = card.locator('img');
  await expect(img).toHaveAttribute('alt', /YouTube channel banner for Virat Marketing/);
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  const frame = (await card.locator('.media').boundingBox())!;
  expect(frame.width / frame.height).toBeCloseTo(1546 / 423, 1);
  await expect(card.locator('a')).toHaveCount(0);
  expect((await page.request.get('/work/youtube-banner-concept/')).status()).toBe(404);
});

test('the work page makes no unconfirmed claim about client projects', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('.page-hero .t-lead')).toHaveText('Concept and self-initiated pieces, labelled and shown at their real size and shape.');
  await expect(page.locator('main')).not.toContainText('under way');
});

test('only projects with something to show link to their own page', async ({ page }) => {
  await page.goto('/work/');
  const links = page.locator('main .work-card a.card-link');
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')).sort())).toEqual([
    '/work/virat-digital-brand-identity/',
    '/work/virat-digital-website/',
    '/work/youtube-thumbnail-system/',
  ]);
});

test.describe('service filter', () => {
  test('shows only the chosen service and says how many', async ({ page }) => {
    await page.goto('/work/');
    const filter = page.getByRole('group', { name: 'Filter by service' });
    await filter.getByRole('button', { name: 'YouTube design' }).click();
    await expect(filter.getByRole('button', { name: 'YouTube design' })).toHaveAttribute('aria-pressed', 'true');
    await expect(cards(page).filter({ visible: true })).toHaveCount(2);
    for (const card of await cards(page).filter({ visible: true }).all()) await expect(card).toHaveAttribute('data-service', 'youtube-design');
    await expect(page.locator('[data-filter-status]')).toHaveText('Showing 2 projects in YouTube design');
    await expect(page).toHaveURL(/\?service=youtube-design$/);

    await filter.getByRole('button', { name: 'All' }).click();
    await expect(cards(page).filter({ visible: true })).toHaveCount(7);
    await expect(page.locator('[data-filter-status]')).toHaveText('Showing all 7 projects');
  });

  test('a service in the URL is applied on arrival', async ({ page }) => {
    await page.goto('/work/?service=websites');
    await expect(cards(page).filter({ visible: true })).toHaveCount(2);
  });

  test('without JavaScript every project is listed and no dead filter shows', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/work/');
    await expect(cards(page).filter({ visible: true })).toHaveCount(7);
    await expect(page.getByRole('group', { name: 'Filter by service' })).toBeHidden();
    await context.close();
  });
});

test.describe('project page', () => {
  test('presents the project with its label, real images and a next step', async ({ page }) => {
    const response = await page.goto('/work/virat-digital-website/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('The Virat Digital website');
    await expect(page.locator('.page-hero .badge')).toHaveText('Self-initiated');
    const cover = page.locator('.project-cover img');
    await expect(cover).toHaveAttribute('alt', /.{20,}/);
    await expect(page.locator('.project-cover picture source[type="image/avif"]')).toHaveCount(1);
    expect(await cover.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole('link', { name: 'Start a project' }).last()).toHaveAttribute('href', '/contact/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work/');
  });

  test('cover morphs from the card it was opened from', async ({ page }) => {
    await page.goto('/work/');
    const cardName = await page.locator('.work-card[data-project="virat-digital-website"] .media').evaluate((el) => getComputedStyle(el).viewTransitionName);
    await page.goto('/work/virat-digital-website/');
    const coverName = await page.locator('.project-cover').evaluate((el) => getComputedStyle(el).viewTransitionName);
    expect(cardName).toBe('work-virat-digital-website');
    expect(coverName).toBe(cardName);
  });
});
