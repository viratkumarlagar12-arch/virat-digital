import { test, expect } from '@playwright/test';
import { siteUrl } from '../src/lib/site-url.mjs';

// Which public address the build uses for canonical URLs, link previews,
// structured data and the sitemap.
test.describe('site address', () => {
  test('SITE_URL wins when it is set', () => {
    expect(siteUrl({ SITE_URL: 'https://www.example.in', NETLIFY: 'true', URL: 'https://virat.netlify.app' })).toBe('https://www.example.in');
  });

  test("on Netlify without SITE_URL, the site's own address is used", () => {
    expect(siteUrl({ NETLIFY: 'true', URL: 'https://virat.netlify.app' })).toBe('https://virat.netlify.app');
  });

  test('elsewhere, nothing is assumed', () => {
    expect(siteUrl({})).toBeUndefined();
    expect(siteUrl({ URL: 'https://something-else.example' })).toBeUndefined();
  });
});
