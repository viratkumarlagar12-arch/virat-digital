// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The real domain isn't decided yet. Set SITE_URL (e.g. in Netlify's
// environment settings) once it is; canonical URLs, Open Graph URLs and the
// sitemap are only emitted when it's set, so nothing points at a made-up domain.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: site ? [sitemap({ filter: (page) => !page.includes('/styleguide/') })] : [],
});
