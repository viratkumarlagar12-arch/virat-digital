import { getCollection, type CollectionEntry } from 'astro:content';
import { commitments } from '../data/site';

export type Service = CollectionEntry<'services'>;
export type Project = CollectionEntry<'work'>;

export async function getServices(): Promise<Service[]> {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function getProjects(): Promise<Project[]> {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}

/** A project gets its own page only when it has a write-up; a cover image
 *  alone shows on its card, which stays unlinked. */
export function hasPage(project: Project): boolean {
  return Boolean(project.body?.trim());
}

export const statusLabel: Record<Project['data']['status'], string> = {
  concept: 'Concept',
  'self-initiated': 'Self-initiated',
  client: 'Client project',
};

const numberWords = ['no', 'one', 'two', 'three', 'four', 'five'];

/** Fills placeholders in content copy from the promises in site.ts. */
export function fill(text: string): string {
  const filled = text
    .replace('{revisions}', numberWords[commitments.revisionRounds] ?? String(commitments.revisionRounds))
    .replace('{replyHours}', String(commitments.replyHours));
  return filled.charAt(0).toUpperCase() + filled.slice(1);
}
