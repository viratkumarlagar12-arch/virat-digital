import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { ogEntries, type OgEntry } from '../../lib/og';

// Link-preview cards (1200x630), rendered at build time: ink background,
// the page's line in expanded Archivo, and the marigold V mark.
// satori needs static TTF fonts, so two instances of Archivo live in
// src/assets/og-fonts (they're never sent to visitors).

export const getStaticPaths = (async () =>
  (await ogEntries()).map((entry) => ({ params: { slug: entry.slug }, props: entry }))) satisfies GetStaticPaths;

const fontDir = join(process.cwd(), 'src/assets/og-fonts');
const fonts = Promise.all([readFile(join(fontDir, 'archivo-800-125.ttf')), readFile(join(fontDir, 'archivo-400-100.ttf'))]);

const INK = '#0e0f28';
const PAPER = '#f5f5f9';
const MUTED = '#bec0cb';
const MARIGOLD = '#f5a509';

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

function card({ title, label }: OgEntry): Node {
  const size = title.length <= 40 ? 84 : title.length <= 72 ? 68 : 56;
  const mark = el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 14, background: MARIGOLD },
    el('svg', {}, el('path', {}, undefined, { d: 'M18 18 L32 46 L46 18', fill: 'none', stroke: INK, 'stroke-width': 6.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), { width: 64, height: 64, viewBox: '0 0 64 64' }),
  );
  return el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '72px 80px', background: INK, fontFamily: 'Archivo' }, [
    el('div', { display: 'flex', fontFamily: 'Archivo Expanded', fontSize: size, lineHeight: 1, letterSpacing: '-0.04em', color: PAPER, maxWidth: 1000 }, title),
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      el('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
        mark,
        el('div', { display: 'flex', fontFamily: 'Archivo Expanded', fontSize: 34, color: PAPER }, 'Virat Digital'),
      ]),
      el('div', { display: 'flex', fontSize: 30, color: MUTED }, label),
    ]),
  ]);
}

export const GET: APIRoute = async ({ props }) => {
  const [expanded, regular] = await fonts;
  const svg = await satori(card(props as OgEntry) as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Archivo Expanded', data: expanded, weight: 800, style: 'normal' },
      { name: 'Archivo', data: regular, weight: 400, style: 'normal' },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
