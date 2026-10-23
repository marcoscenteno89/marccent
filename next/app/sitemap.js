import { main } from '@/components/layout/menus';
import { site } from '@/lib/content';
import { url } from '@/lib/schema';

/*
 * /sitemap.xml: every page the main menu links to (apps, design and landing pages included), plus the home page and
 * the privacy policy. Built from the menu, so a page added there is listed here too.
 */

const PRIORITY = { '/': 1, '/about': .9, '/theme': .9 };

export default function sitemap() {
  const paths = [ '/', ...main.flatMap(item => [ item.href, ...(item.children ?? []).map(c => c.href) ]), '/privacy-policy' ]
    .map(href => href.split('#')[0]);
  return [ ...new Set(paths) ].map(path => ({
    url: url(path),
    lastModified: site.updated,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: PRIORITY[path] ?? (path.startsWith('/landing') ? .5 : .7),
  }));
}
