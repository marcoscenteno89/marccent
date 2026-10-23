import { site, faq, about } from '@/lib/content';
import { social } from '@/components/layout/menus';

/*
 * Structured data (schema.org, as JSON-LD) for search engines and AI answer engines: who runs the site, what it is,
 * and the FAQ. Built from lib/content.js, so the copy and the data never disagree. Render with <JsonLd> (components/json-ld.js).
 * The @id links let the pieces point at each other: the website's publisher is the person, the profile page is about them.
 */

const url = (path = '/') => new URL(path, site.url).href;
const PERSON = url('/#person');
const WEBSITE = url('/#website');
const THEME = url('/#theme');

const person = () => ({
  '@type': 'Person',
  '@id': PERSON,
  name: site.author.name,
  jobTitle: site.author.jobTitle,
  email: `mailto:${site.author.email}`,
  image: url(site.author.image),
  url: url('/about'),
  address: { '@type': 'PostalAddress', addressLocality: site.author.city, addressRegion: site.author.region, addressCountry: site.author.country },
  knowsAbout: about.skills.slice(0, 12),
  sameAs: social.filter(s => s.external).map(s => s.href),
});

// The theme itself: the product this site demos.
const theme = () => ({
  '@type': 'CreativeWork',
  '@id': THEME,
  name: `${site.title} theme`,
  description: faq[0].a,
  creator: { '@id': PERSON },
  url: url('/theme'),
  genre: 'CSS theme',
  dateModified: site.updated,
});

// Every page: the site, its author and the theme.
const siteGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': WEBSITE, name: site.title, url: url('/'), description: site.description, inLanguage: 'en-US', publisher: { '@id': PERSON }, about: { '@id': THEME } },
    person(),
    theme(),
  ],
});

// The home page's questions and answers.
const faqPage = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

// The About page: a profile of the person, which is also how to contact them.
const profilePage = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: url('/about'),
  name: about.meta.title,
  description: about.meta.description,
  dateModified: site.updated,
  isPartOf: { '@id': WEBSITE },
  mainEntity: { '@id': PERSON },
});

export { url, siteGraph, faqPage, profilePage };
