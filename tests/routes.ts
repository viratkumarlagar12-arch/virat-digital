// Every public page. Tests that loop over pages read this list, so a new
// page gets the same checks the moment it's added here.
export const SERVICE_SLUGS = [
  'graphic-design',
  'youtube-design',
  'websites',
  'ai-automation',
  'digital-marketing',
];

export const ROUTES = [
  '/',
  '/services/',
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}/`),
  '/work/',
  '/work/virat-digital-website/',
  '/work/virat-digital-brand-identity/',
  '/work/youtube-thumbnail-system/',
  '/about/',
  '/contact/',
  '/privacy/',
];
