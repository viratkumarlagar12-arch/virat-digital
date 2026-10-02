import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Services: one Markdown file each. Frontmatter feeds the header menu, the
// home page rows, the contact form and the service page; the body is the
// long-form page copy.
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),               // "YouTube design"
    order: z.number(),
    menuLine: z.string(),            // one line under the name in menus
    metaTitle: z.string(),
    metaDescription: z.string().min(50).max(160),
    headline: z.string(),            // H1 on the service page
    lead: z.string(),
    outcome: z.string(),             // one line on the home page row
    audience: z.string(),            // who it's for
    includes: z.array(z.string()),
    deliverables: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    cta: z.string(),                 // "Start a thumbnail project"
    whatsappText: z.string(),        // prefilled WhatsApp message
    priceFrom: z.number().optional(),// rupees; shown only when set
  }),
});

// Work: concept, self-initiated or client projects. A project gets its own
// page only when it has a cover image or written body, so nothing thin ships.
const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        service: reference('services'),
        status: z.enum(['concept', 'self-initiated', 'client']),
        summary: z.string(),
        tools: z.array(z.string()),
        format: z.enum(['thumbnail', 'banner', 'site', 'square', 'og']),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        word: z.string(),            // typographic placeholder until a cover exists
        featured: z.boolean().default(false),
        order: z.number(),
        client: z.string().optional(),
        result: z.string().optional(),
      })
      .refine((p) => p.status === 'client' || !p.result, {
        message: 'Results can only be stated for real client work.',
      })
      .refine((p) => !p.cover || !!p.coverAlt, { message: 'A cover image needs coverAlt text.' }),
});

export const collections = { services, work };
