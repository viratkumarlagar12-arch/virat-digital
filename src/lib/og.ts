import { getServices, getProjects, hasPage } from './content';

// One preview image per public page. The file name comes from the page's
// path, so Seo.astro can find a page's image without being told.
export function ogSlug(pathname: string): string {
  const trimmed = pathname.replace(/^\/|\/$/g, '');
  return trimmed ? trimmed.replace(/\//g, '-') : 'home';
}

export type OgEntry = {
  slug: string;
  title: string;   // the large text on the card
  label: string;   // the small text beside the brand
};

export async function ogEntries(): Promise<OgEntry[]> {
  const entry = (path: string, title: string, label: string) => ({ slug: ogSlug(path), title, label });
  const services = await getServices();
  const projects = (await getProjects()).filter(hasPage);
  return [
    entry('/', 'Design, websites and automation for creators and growing businesses.', 'Independent studio'),
    entry('/services/', 'Graphic design, YouTube design, websites, AI automation and marketing.', 'Services'),
    ...services.map((s) => entry(`/services/${s.id}/`, s.data.headline, s.data.title)),
    entry('/work/', 'Concept and self-initiated work, each labelled for what it is.', 'Work'),
    ...projects.map((p) => entry(`/work/${p.id}/`, p.data.title, 'Work')),
    entry('/about/', 'A one-person studio for design, websites and automation.', 'About'),
    entry('/contact/', 'Tell me what you’re making. I reply within 24 hours.', 'Start a project'),
    entry('/privacy/', 'What I collect when you get in touch, and why.', 'Privacy'),
  ];
}
