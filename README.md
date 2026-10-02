# Virat Digital — Brand Website

A premium single-page website for **Virat Digital** — an independent digital solutions
brand covering graphic design, website development, AI automation and digital marketing.
Dark and light themes, built on a small token-based design system ("Ink & Marigold").
Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies.

## Files

```
MyWebsite/
├── index.html          # All page sections (hero, services, trust, process, work, about, cta, contact)
├── styleguide.html     # Living design system reference (not linked from the site, noindex)
├── css/
│   ├── tokens.css      # Design tokens: palette, both themes, type, spacing, radius, shadows, motion, layout
│   ├── base.css        # Reset, type roles, links and focus, layout primitives (container, section, grid, split)
│   ├── components.css  # Buttons, cards, chips, badges, media frame, header/nav, theme toggle, forms, steps, footer
│   └── styles.css      # Page sections, composed from the three files above
├── js/main.js          # Theme toggle, header state, mobile nav, current-section highlight, process rail, form validation
├── favicon.svg         # Marigold "V" mark
└── README.md
```

## Run it

Double-click `index.html`, or serve it locally:

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open http://localhost:8000

## Honesty-first content — please read before publishing

This site contains **no fabricated credibility**: no fake client counts, ad-spend figures,
years-of-experience claims, testimonials, review scores or logos. A few things are
intentionally left as clearly-marked placeholders for you to fill in:

| Placeholder | Where | What to do |
| --- | --- | --- |
| — | — | All contact channels (Email, WhatsApp, Instagram, YouTube, Facebook) are now real, clickable links in both the Contact section and the footer social icons — no placeholders remain there. |
| Contact form backend | `index.html` — the "Setup note" above the submit button, and `js/main.js` | The form validates in the browser but **does not send anywhere yet** — the note tells visitors that honestly. Wire it to a real endpoint (see below), then remove the note |
| Open Graph image | `index.html` `<head>` — commented-out `og:image` tag | Add a real 1200×630 image at `assets/og-image.jpg`, then uncomment the tag |
| Canonical URL | `index.html` `<head>` — commented-out `<link rel="canonical">` | Add your real domain once you have one, then uncomment |
| "Selected Work" projects | `index.html` — `#work` section | All 6 are explicitly labeled **Concept** (CSS/SVG mockups, not real screenshots), each with a `Tools:` line but no invented "results." Swap in real project images/case studies — and only add a result line — once a project is real client work |
| About copy | `index.html` — `#about` section | Written to reflect an independent creator building the brand, not an established agency |

Nothing else in the copy claims stats, clients or results that don't exist yet.

## Change history

### Design system pass (October 2026)

- New token-based design system ("Ink & Marigold") split across `tokens.css`, `base.css`,
  `components.css` and `styles.css`; every colour now comes from a token (previously 23 were
  hard-coded).
- Dark and light themes: follows the device setting, with a remembered manual toggle.
- Archivo replaces Inter; headlines use its width axis.
- Removed decorative chrome: all-caps eyebrows, glowing dots, non-sequence numbering, the
  orbiting hero graphic, blur blobs, scroll progress bar, hero tilt, card cursor glow and
  staggered fade-ins. The one remaining page-load animation is the hero headline widening.
- Hero now ends with a service index linking to each service card.
- Service links say where they go ("Start a design project") and preselect that service in
  the contact form.
- About section is text-led; headings and tags use sentence case.
- Process steps keep full-strength text (inactive steps were dimmed below WCAG contrast).
- Added `styleguide.html`.

### Earlier polish pass

This was an improvement pass on the existing design system, not a rebuild. Fixed:

- **Mobile hero height** — `.hero` had its own padding that ignored the mobile breakpoints; it's now explicitly reduced at 960px and 620px, and the hero visual shrinks (with orbiting node labels hidden) below 620px so it stays compact.
- **Portfolio grid** — was 5 cards in a 3-column grid (an unbalanced orphan row); added a 6th concept project (YouTube Banner) and a proper 2-column tablet layout, so it's always a clean grid at every breakpoint.
- **Contact form fields** — replaced "Budget Range" with "WhatsApp / Phone" (optional) and updated the Service dropdown to match your real service list.
- **Honest form messaging** — the success message no longer implies a message was delivered; a visible "Setup note" and the post-submit text both say plainly that the form isn't connected to a live inbox yet.
- **Trust section** — the old "Why" section's philosophy points were replaced with the specific, real trust signals you asked for (clear communication, transparent process, responsive design, modern technology, custom solutions, direct collaboration) — no fake stats needed.
- **Services** — each card now states who it's for, not just what it is; removed a self-referential duplicate tag ("Digital Marketing" listed inside the Digital Marketing card); tags now match your exact service list (Logo Design, Brand Identity, YouTube Thumbnail/Banner Design, etc.).
- **Accessibility** — `--text-faint` and the default `.btn-primary` background were both slightly adjusted; each was below the 4.5:1 WCAG AA contrast minimum on the dark surfaces/white text they're used with. Mobile menu now returns keyboard focus to the toggle button on Escape.
- **SEO** — tightened the meta description to a proper length, added a commented-out canonical tag placeholder.
- **Cleanup** — removed an unused CSS variable (`--container-narrow`), added `max-width` (58ch) to long-form paragraphs so line length stays readable regardless of column width.

## Customising

| What | Where |
| --- | --- |
| Brand name / logo | `index.html` — search for `Virat` (nav, hero-adjacent, footer) |
| Colours | `css/tokens.css` — primitives at the top, theme values in the semantic blocks |
| Fonts | Google Fonts `<link>` in `index.html` and `styleguide.html`, and `--font-sans` in `tokens.css` |
| Services & sub-items | `#services` section in `index.html` |
| Trust signals | `#trust` section in `index.html` |
| Process steps | `#process` section |
| Contact form fields/options | `#contact` section |

## Design system

The full reference, with live components and contrast checks in both themes, is
`styleguide.html`. Open it next to the site while you work. It isn't linked from the site
and is marked `noindex`.

**Direction: Ink & Marigold.** Deep indigo ink backgrounds, one marigold accent, and Archivo's
width axis as the brand voice: headlines are set expanded and widen as the screen grows,
body text stays at normal width.

**Three token layers** (all in `css/tokens.css`):

1. **Primitives** — `--ink-50 … --ink-950`, `--marigold-100 … --marigold-900`, status colours.
   Raw values; components never use them directly.
2. **Semantic** — role names such as `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`,
   `--accent-text`, `--line`, `--focus-ring`. These switch per theme.
3. **Component** — local props at the top of each component (`--btn-bg`, `--card-pad` …).
   Variants only swap these, so selector specificity stays flat.

Scales: spacing `--space-1 … --space-32` (name × 4px), type `--text-xs … --text-display`,
radius by role (`--radius-control`, `--radius-card`, `--radius-panel`, `--radius-pill`),
shadows `--shadow-1 … 3`, motion `--dur-*` and `--ease-*`. Breakpoints are mobile-first
`min-width` queries at 40em, 48em, 64em and 80em (listed at the top of `tokens.css`).

**Themes.** Dark is the brand default. The site follows the visitor's device setting until
they use the toggle; their choice is saved in `localStorage` under `vd-theme`. A small script
in `<head>` applies it before first paint, so there's no flash. Without JavaScript the CSS still
follows the device setting and the toggle is hidden.

**Rules for new work**

- Use semantic tokens in components, never primitives or hex values.
- Adding a colour: add the primitive, then the semantic token in the dark block **and both**
  light blocks of `tokens.css` (they must stay identical), then check `styleguide.html`.
- One primary (marigold) button per view; supporting actions use outline or ghost buttons.
- Numbers only on real sequences (`.steps`); everything else uses `.feature-list` or cards.
- Sentence case everywhere; no all-caps labels above headings.
- Motion answers the visitor (hover, press, open). The hero headline is the only page-load
  animation, and `prefers-reduced-motion` turns it off.
- Work cards: replace the typographic `.media-word` placeholder with an `<img>` inside `.media`
  once real work exists. Add `.card-interactive` and a `.card-link` only when a card opens a
  real case study.

## Contact form

The form validates in the browser only (name, email format, message length) — nothing is
sent anywhere yet, and the page says so (a "Setup note" above the submit button, and an
honest post-submit message). To make it live, replace the comment in `js/main.js`
(`// Front-end only for now`) with a `fetch()` POST to a real endpoint (Formspree, Netlify
Forms, a serverless function, etc.) — then remove the setup note from `index.html`.

## Before you publish

1. Fill in the real contact placeholders (email, WhatsApp, Instagram, YouTube).
2. Wire the contact form to a real backend/endpoint, then remove the "Setup note."
3. Replace concept "Selected Work" items with real projects as they're completed.
4. Add a real Open Graph image and canonical URL if you plan to share links / have a domain.
