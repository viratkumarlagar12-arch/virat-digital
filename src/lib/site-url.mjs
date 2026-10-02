// @ts-check

// The site's public address, used for canonical URLs, link previews,
// structured data and the sitemap. SITE_URL wins when it's set. On Netlify,
// the site's own address is used otherwise: its .netlify.app name, or the
// custom domain once one is connected (after a redeploy). Anywhere else
// nothing is assumed, so no URL points at a made-up domain.
/** @param {Record<string, string | undefined>} env */
export function siteUrl(env) {
  if (env.SITE_URL) return env.SITE_URL;
  if (env.NETLIFY === 'true' && env.URL) return env.URL;
  return undefined;
}
