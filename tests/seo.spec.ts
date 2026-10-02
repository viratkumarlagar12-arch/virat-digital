import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';

// The test build sets SITE_URL=https://example.com, so canonical and Open
// Graph URLs are absolute on that domain.
const SITE = 'https://example.com';

async function jsonLd(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((b) => {
    const data = JSON.parse(b);
    return Array.isArray(data['@graph']) ? data['@graph'] : [data];
  });
}

for (const route of ROUTES) {
  test(`${route} has a canonical URL and its own 1200x630 preview image`, async ({ page, request }) => {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}${route}`);
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(image).toMatch(new RegExp(`^${SITE}/og/[a-z0-9-]+\\.png$`));
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    const response = await request.get(new URL(image!).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const png = await response.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });
}

test('preview images differ per page', async ({ page }) => {
  const images = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    images.add((await page.locator('meta[property="og:image"]').getAttribute('content')) ?? '');
  }
  expect(images.size).toBe(ROUTES.length);
});

test('every page describes the business as structured data', async ({ page }) => {
  await page.goto('/');
  const business = (await jsonLd(page)).find((n) => n['@type'] === 'Organization');
  expect(business).toMatchObject({
    name: 'Virat Digital',
    url: `${SITE}/`,
    email: 'viratkumardigital12@gmail.com',
    telephone: '+918210618353',
  });
  expect(business.sameAs).toEqual(expect.arrayContaining(['https://youtube.com/@viratdigitalmarketing']));
});

test('service pages describe the service and its breadcrumb', async ({ page }) => {
  await page.goto('/services/youtube-design/');
  const nodes = await jsonLd(page);
  expect(nodes.find((n) => n['@type'] === 'Service')).toMatchObject({
    name: 'YouTube design',
    provider: { '@id': `${SITE}/#business` },
  });
  const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList');
  expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual(['Home', 'Services', 'YouTube design']);
});

test('project pages describe the work', async ({ page }) => {
  await page.goto('/work/virat-digital-website/');
  expect((await jsonLd(page)).find((n) => n['@type'] === 'CreativeWork')).toMatchObject({ name: 'The Virat Digital website' });
});

test('sitemap lists public pages only', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const route of ROUTES) expect(sitemap).toContain(`<loc>${SITE}${route}</loc>`);
  for (const hidden of ['/styleguide/', '/thanks/', '/404']) expect(sitemap).not.toContain(hidden);
});

test('robots.txt points at the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('User-agent: *');
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
});
