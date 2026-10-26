import { site, theme, home, faq, about } from '@/lib/content';
import { main, menuLinks } from '@/components/layout/menus';
import { url } from '@/lib/schema';

/*
 * /llms.txt (llmstxt.org): a plain Markdown summary of the site for AI answer engines: what Marccent is, who built
 * it, the main pages and the FAQ. Built from lib/content.js and the main menu, so it stays in step with the site.
 */

export const dynamic = 'force-static';

const links = (items) => items.map(i => `- [${i.name}](${url(i.href)})`).join('\n');

export function GET() {
  const pages = menuLinks(main).filter(l => !l.external)
    .filter((p, i, all) => all.findIndex(o => o.href === p.href) === i);
  const body = `# ${site.title}

> ${site.description}

${site.title} is the product; ${site.url.replace('https://', '')} is its live demo site. Built by ${site.author.name}, ${site.author.jobTitle.toLowerCase()} in ${site.author.city}, ${site.author.region}. Last updated ${site.updated}.

## The theme in numbers

${theme.stats.map(s => `- ${s.value} ${s.label}`).join('\n')}

## Features

${home.what.features.map(f => `- **${f.title}:** ${f.text}`).join('\n')}

## What ${site.author.name.split(' ')[0]} is working on

${home.now.events.map(e => `- ${e.date}: ${e.title}. ${e.text}`).join('\n')}

## Pages

${links([ { name: 'Home', href: '/' }, ...pages ])}

## About the author

${about.role}. ${about.intro.replace(/\s+/g, ' ').replace(/\*\*/g, '').trim()}

Contact: ${url('/about#contact')}

## FAQ

${faq.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
