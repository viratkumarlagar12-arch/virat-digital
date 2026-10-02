// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteUrl } from './src/lib/site-url.mjs';

// Canonical URLs, Open Graph URLs, structured data and the sitemap are only
// emitted when the public address is known (see src/lib/site-url.mjs).
const site = siteUrl(process.env);

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: site
    ? [sitemap({ filter: (page) => !['/styleguide/', '/thanks/', '/404', '/og/'].some((path) => page.includes(path)) })]
    : [],
});
