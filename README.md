# Virat Digital website

The website for **Virat Digital**, an independent one-person studio for graphic design,
YouTube design, websites, AI automation and digital marketing. It's a static site built with
[Astro](https://astro.build): plain HTML pages, a small token-based design system
("Ink & Marigold"), light and dark themes, and about 6 KB of JavaScript per page.

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev        # local site at http://localhost:4321, reloads as you edit
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run check      # type-check
npm test           # browser tests (Playwright, uses your installed Chrome)
```

## Where things live

| To change… | Edit |
| --- | --- |
| Name, email, WhatsApp number, social links | `src/data/site.ts` |
| Promises shown on the site (reply time, revision rounds) | `commitments` in `src/data/site.ts` |
| A service: headline, copy, what's included, FAQ | `src/content/services/<service>.md` |
| A project in the work section | `src/content/work/<project>.md` |
| Home page FAQ | `src/data/faq.ts` |
| Client testimonials (real ones only) | `src/data/testimonials.ts` |
| Colours, type, spacing | `src/styles/tokens.css` |
| Pages | `src/pages/` |

Every page, the menu, the footer and the contact form read from these files, so a change made
once shows up everywhere.

### Adding real work

1. Put the image in `src/assets/work/` (PNG or JPG; it's converted to AVIF/WebP at build time).
2. In the project's file in `src/content/work/`, add `cover:` with the image path and
   `coverAlt:` describing what the design shows.
3. Write the case study below the frontmatter (brief, constraints, approach). A project gets its
   own page, and its card becomes a link, once it has written text; with only a cover image,
   the card shows the image and stays unlinked.
4. Set `status:` honestly: `concept`, `self-initiated` or `client`. A `result:` line is only
   accepted for `client` work; the build refuses it otherwise.

The home page hero currently lists the services. Once three or more projects have real images,
a strip showing them at their true sizes is planned there; it isn't built yet.

### Testimonials

Add real client quotes, used with permission, to `src/data/testimonials.ts`. The testimonials
section stays hidden while that list is empty.

## Deploying to Netlify

`netlify.toml` holds the build settings (build command `npm run build`, publish directory
`dist`, Node 24) and the response headers, so nothing needs configuring in Netlify's build
settings.

1. Connect the repository to Netlify.
2. **Turn on form detection** (Site configuration → Forms). Without it, contact form
   submissions go nowhere. Then set up email notifications for the `contact` form.
3. Canonical URLs, link-preview images, structured data, the sitemap and the sitemap line in
   `robots.txt` use the site's Netlify address (`https://<name>.netlify.app`) automatically.
   After you connect a domain, trigger a redeploy (Deploys → Trigger deploy) so they move to
   it. To use a different address, set an environment variable `SITE_URL` (for example
   `https://www.yourdomain.com`); it always wins. Outside Netlify, without `SITE_URL`, they're
   left out rather than pointing at a made-up address.
4. After launch, add the site to Google Search Console and submit `/sitemap-index.xml`.

The form posts to Netlify Forms in the background and shows "Project details sent" or, if
sending fails, a WhatsApp link with the visitor's message filled in. Without JavaScript it posts
normally and lands on `/thanks/`. A hidden field (`bot-field`) catches spam bots.

The form only sends on the deployed site. On `npm run dev` it says that nothing was sent. To
check it end to end, send it once on the deployed site and look for the entry under Forms in
Netlify, and for the notification email.

## Honesty rules

The site makes no claims it can't back up: no invented client counts, results, testimonials,
reviews or logos. Concept and self-initiated work is labelled as such on every card and page.
Keep it that way as content is added.

## Design system

Open `/styleguide/` on the running site (it isn't linked or indexed). It shows every colour pair
with its contrast ratio in both themes, the type scale, buttons, media frames and form fields,
rendered with the real code.

- **Tokens** (`src/styles/tokens.css`) come in three layers: primitives (`--onyx-*` for the
  dark theme, `--ink-*` for the light theme, `--marigold-*`), semantic roles (`--bg`, `--text`, `--accent`…) defined once each with
  `light-dark()`, and component-level props inside `components.css`. Components use semantic
  tokens only, never raw colours.
- **Cascade layers**: `tokens`, `base`, `components`, `sections`. Later layers win, so page
  styles never fight component styles.
- **Type**: Archivo only, self-hosted and trimmed to the weights (400–800) and widths
  (87.5–125%) in use. Headlines are set wide; body text at normal width.
- **Motion**: the home headline widening on laptops is the only thing that moves on its own.
  Everything else responds to the visitor, and `prefers-reduced-motion` turns motion off.

## Tests

`npm test` builds the site and checks it in Chrome:

- every page: one H1, unique title and description, no skipped heading levels, no sideways
  scrolling at 320px, no serious accessibility problems (axe) in either theme
- navigation, the services menu, the mobile menu and the no-JavaScript fallbacks
- the contact form: validation, sending, failure with WhatsApp fallback, service preselection
- the hero doesn't shift the page as the font loads or the headline widens
- structured data, preview images, sitemap and `robots.txt`, and which site address they use

`CROSS=1 npm test` adds Firefox and WebKit (Safari's engine); run
`npx playwright install firefox webkit` once first.

## Still to decide

These are written with defaults or left out until you choose:

- **Promises**: reply within 24 hours and two revision rounds are defaults in
  `src/data/site.ts`. Change them to what you'll keep on every project.
- **Prices**: service pages don't show prices yet. The service files accept a `priceFrom`
  field, but displaying it still needs adding once you decide to publish prices.
- **Your name and photo**: the About page reads fine without them. Set `founderName` in
  `src/data/site.ts`.
- **Process durations**: the process steps don't give timeframes yet.
- **Domain and email**: the site works on its Netlify address until you connect a domain; an
  email address on your own domain also reads as more established than a Gmail one.
- **Privacy page**: written to describe what the site actually does. Have it checked before
  launch, and update it if you add analytics.
- **The line "Client projects are under way"** on the Work page, carried over from the
  previous site. Keep it only while it's true.
