import { url } from '@/lib/schema';

/*
 * /robots.txt: everything is open to search engines and to AI crawlers (named, so answer engines can quote the site),
 * except the API routes. Points at the sitemap and at /llms.txt (app/llms.txt/route.js).
 */

const AI_CRAWLERS = [ 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended' ];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
    ],
    sitemap: url('/sitemap.xml'),
    host: url('/'),
  };
}
