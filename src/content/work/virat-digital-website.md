---
title: The Virat Digital website
service: websites
status: self-initiated
summary: "The site you're on: its own design system, light and dark themes, and WhatsApp-first enquiries."
tools: [Astro, CSS, TypeScript, Playwright]
format: site
cover: ../../assets/work/virat-digital-website-cover.png
coverAlt: The Virat Digital home page in its dark theme, with the headline "Design, websites and automation for creators and growing businesses" set in wide, heavy type above two buttons, with a sculpted dark V behind it on the right.
word: Website
featured: true
order: 3
gallery:
  - src: ../../assets/work/virat-digital-website-mobile.png
    alt: The home page on a phone in the light theme, with the headline broken over six short lines, a pale stone V behind it, and full-width buttons.
    caption: Line breaks set for phones, down to a 320px screen.
  - src: ../../assets/work/virat-digital-website-menu.png
    alt: The mobile menu open in the dark theme, listing the five services, then Work, About and Contact, with Start a project and WhatsApp buttons.
    caption: Every service, then the two ways to get in touch.
  - src: ../../assets/work/virat-digital-website-service.png
    alt: The YouTube design service page in the light theme, with the headline "Thumbnails and channel art that are clear at phone size".
    caption: One page per service, written for the people searching for it.
---

## The brief

A site that does what it promises clients: fast on a phone, clear about what's on offer, easy to get in touch. And honest: a new studio has no client logos or results yet, so it borrows no credibility it hasn't earned.

## Constraints

- **Phones, slow connections.** Most visitors arrive from Instagram, YouTube or WhatsApp.
- **WhatsApp first.** It's how most people here start a conversation, so it sits beside every call to action.
- **One person maintains it.** Each service, contact detail and promise lives in one place.
- **No invented proof.** Every project is labelled concept, self-initiated or client.

## Approach

The identity is the type. Archivo's width axis sets headlines expanded, widening once on load: *virat* means immense. One marigold accent marks the next step; everything else stays quiet.

The home headline has fixed line breaks for each screen size, so neither the font loading nor the animation moves a word, and the page doesn't shift as it loads.

Static pages built with Astro: about 6 KB of JavaScript and one 74 KB font. Every page is tested automatically for accessibility in both themes, keyboard use and sideways scrolling at 320px.
