import { apps } from '@/components/apps/list';

// The Menu itself (and externalProps, menuLinks) is the theme's (components/ui/menu.js); this file is the site's data.
export { Menu, externalProps, menuLinks } from 'marccent-theme/components/ui/menu';

// Shared menus: edit a link here and the header, hero and contact page all pick it up.
// name: visible text. label: aria-label for icon-only links. icon: full Font Awesome classes.
// external: opens in a new tab (spread target/rel from externalProps); internal links stay in the site.

export const social = [
  { name: 'Message Me', href: '/about#contact', label: 'Message Me', icon: 'fa-solid fa-message', external: false },
  { name: 'Codepen', href: 'https://codepen.io/marcos-centeno/pens/public', label: 'Codepen Link', icon: 'fa-brands fa-codepen', external: true },
  { name: 'Linkedin', href: 'https://www.linkedin.com/in/marcos-centeno-0b1a7b65/', label: 'Linkedin Link', icon: 'fa-brands fa-linkedin', external: true },
  { name: 'Github', href: 'https://github.com/marcoscenteno89', label: 'Github Link', icon: 'fa-brands fa-github', external: true },
];

// The About page's contact section: email first, then the external links (Message Me would point at the page itself).
export const contact = [
  { name: 'Email', href: 'mailto:marcoscenteno89@gmail.com', label: 'Email Me', icon: 'fa-solid fa-envelope', external: true },
  ...social.filter(s => s.external),
];

// Main navigation. An item with children is a dropdown; its href is the "browse all" page. A child with children of
// its own is a submenu (the Theme menu).
// Apps come from components/apps/list, so adding an app there adds it here too.
export const main = [
  { name: 'About', href: '/about' },
  {
    name: 'Apps',
    href: '/apps',
    children: [
      { name: 'Browse Apps', href: '/apps' },
      ...apps.map(app => ({ name: app.name, href: app.url, icon: `fa-solid ${app.icon}` })),
    ],
  },
  {
    // The theme: its docs, then submenus for the design pages and the landing pages.
    name: 'Theme',
    href: '/docs',
    children: [
      { name: 'Docs', href: '/docs', icon: 'fa-solid fa-book' },
      {
        name: 'Design',
        icon: 'fa-solid fa-palette',
        children: [
          { name: 'Theme', href: '/theme', icon: 'fa-solid fa-palette' },
          { name: 'Shapes', href: '/shapes', icon: 'fa-solid fa-shapes' },
          { name: 'Widgets', href: '/widgets', icon: 'fa-solid fa-puzzle-piece' },
          { name: 'Parallax', href: '/parallax', icon: 'fa-solid fa-mountain-sun' },
          { name: 'Images', href: '/images', icon: 'fa-solid fa-images' },
          { name: 'Animations', href: '/animations', icon: 'fa-solid fa-wand-magic-sparkles' },
        ],
      },
      {
        name: 'Landing Pages',
        icon: 'fa-solid fa-window-maximize',
        children: [
          { name: 'Pulsegrid', href: '/landing/pulsegrid', icon: 'fa-solid fa-wave-square' },
          { name: 'Ridgeline', href: '/landing/ridgeline', icon: 'fa-solid fa-mountain' },
          { name: 'Brightside Dental', href: '/landing/brightside', icon: 'fa-solid fa-tooth' },
          { name: 'Fernbank', href: '/landing/fernbank', icon: 'fa-solid fa-seedling' },
          { name: 'Signal Summit', href: '/landing/signal-summit', icon: 'fa-solid fa-tower-broadcast' },
          { name: 'Starfall Mesa', href: '/landing/starfall', icon: 'fa-solid fa-moon' },
        ],
      },
    ],
  },
];
