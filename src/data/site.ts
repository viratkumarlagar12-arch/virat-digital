// One source for everything the site repeats: name, contact channels,
// navigation and the promises made to clients. Change a value here and every
// page, the header, the footer and the contact form pick it up.

export const site = {
  name: 'Virat Digital',
  description:
    'Logo and brand design, YouTube thumbnails, websites, AI automation and digital marketing for creators and small businesses, from an independent studio in India.',
  // How the founder is named on the site. Left empty until you decide; the
  // About page reads naturally without it.
  founderName: '',
  email: 'viratkumardigital12@gmail.com',
  whatsapp: { number: '918210618353', display: '+91 82106 18353' },
  socials: [
    { name: 'Instagram', handle: '@virat_digital_12', url: 'https://www.instagram.com/virat_digital_12/' },
    { name: 'YouTube', handle: '@viratdigitalmarketing', url: 'https://youtube.com/@viratdigitalmarketing' },
    { name: 'Facebook', handle: 'Virat Digital', url: 'https://www.facebook.com/share/19USV1E2QD/' },
  ],
} as const;

// Promises shown on the site. Only keep what you'll honour on every project.
export const commitments = {
  replyHours: 24,
  revisionRounds: 2,
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** wa.me link, optionally with a prefilled message. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** True when `href` is the current page or a section under it. */
export function isCurrent(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href);
}
