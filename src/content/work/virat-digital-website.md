---
title: The Virat Digital website
service: websites
status: self-initiated
summary: The site you're on, with its own design system, light and dark themes, and an enquiry flow built around WhatsApp.
tools: [Astro, CSS, TypeScript, Playwright]
format: site
cover: ../../assets/work/virat-digital-website-cover.png
coverAlt: The Virat Digital home page in its dark theme, with the headline "Design, websites and automation for creators and growing businesses" set in wide, heavy type above two buttons.
word: Website
featured: true
order: 3
gallery:
  - src: ../../assets/work/virat-digital-website-mobile.png
    alt: The home page on a phone in the light theme, with the headline broken over six short lines and full-width buttons.
    caption: On a phone the headline has its own line breaks, chosen to fit a 320px screen.
  - src: ../../assets/work/virat-digital-website-menu.png
    alt: The mobile menu open in the dark theme, listing the five services, then Work, About and Contact, with Start a project and WhatsApp buttons.
    caption: The mobile menu lists every service and ends with the two ways to get in touch.
  - src: ../../assets/work/virat-digital-website-service.png
    alt: The YouTube design service page in the light theme, with the headline "Thumbnails and channel art that are clear at phone size".
    caption: Each service has its own page, written for the people searching for it.
---

## The brief

Virat Digital needed a website that does what it promises clients: load quickly on a phone, explain clearly what's on offer, and make getting in touch easy. It also had to be honest. A new studio has no client logos or results to show yet, so the site couldn't borrow credibility it hadn't earned.

## Constraints

- **Mostly phones, often slow connections.** Most visitors arrive from Instagram, YouTube or WhatsApp on a phone.
- **WhatsApp first.** It's how most people here prefer to start a conversation with a business, so it sits beside every call to action.
- **One person maintains it.** Services, contact details and promises live in one place each, so a change is made once.
- **No invented proof.** Every project is labelled as concept, self-initiated or client work.

## Approach

The identity is the type. Archivo has a width axis, so headlines are set expanded and widen once as the page loads; *virat* means immense. Everything else stays quiet: one marigold accent, used only for the thing to do next.

The headline on the home page has fixed line breaks for phones and for larger screens, so neither the font arriving nor the widening animation can move a word to another line. Measured in Chrome, the page doesn't shift as it loads.

It's built with Astro as plain static pages. The home page ships about 6 KB of JavaScript, for the menu, the theme switch and the contact form, and one 74 KB font file trimmed to the weights and widths actually used. Every page is checked automatically for accessibility problems in both themes, for keyboard use, and for sideways scrolling on a 320px screen.
