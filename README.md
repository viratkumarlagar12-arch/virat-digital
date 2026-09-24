# Virat Digital — Brand Website

A premium, dark-first, single-page website for **Virat Digital** — an independent digital
solutions brand covering graphic design, website development, AI automation and digital
marketing. Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies.

## Files

```
MyWebsite/
├── index.html        # All page sections (hero, services, trust, process, work, about, cta, contact)
├── css/styles.css     # Design tokens, dark visual system, layout, components, responsive rules
├── js/main.js         # Scroll progress, nav, reveal animations, process timeline, form validation
├── favicon.svg         # Minimal "V" mark favicon
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

## What changed in this polish pass

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
| Accent color | `css/styles.css` — `:root` block (`--accent`, `--accent-2`) |
| Fonts | `index.html` Google Fonts `<link>`, and `--font` in `styles.css` |
| Services & sub-items | `#services` section in `index.html` |
| Trust signals | `#trust` section in `index.html` |
| Process steps | `#process` section |
| Contact form fields/options | `#contact` section |

## Design system notes

- **Dark-first**: near-black background (`--bg`), off-white text (`--text`), single electric
  accent (`--accent`, indigo-blue) used sparingly for glow, borders and interactive states.
- **8px spacing scale** via `--sp-1` … `--sp-8` custom properties.
- **Motion**: scroll-reveal (staggered), a scroll-linked process timeline fill, subtle hero
  parallax on pointer move, and a top scroll-progress bar — all disabled automatically for
  users with `prefers-reduced-motion: reduce`.
- **No stock imagery**: the hero visual, project "mockups" and about-section graphic are all
  CSS/SVG — no generic stock photos.

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
