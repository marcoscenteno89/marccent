import type { Metadata, Viewport } from 'next';
import '@/styles/main.css'; // all styles, in cascade order (styles/main.css); the optional theme is picked there
import { SiteTheme, ScopeThemes } from "marccent-theme/components/theme/core";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Body } from 'marccent-theme/components/theme/core';
import { SiteThemeProvider } from '@/components/layout/theme-provider';
import { Toast } from 'marccent-theme/components/ui/toast';
import { Goo } from 'marccent-theme/components/ui/goo';
import { Analytics } from '@/components/analytics';
import { PauseOffscreen } from 'marccent-theme/components/pause-offscreen';
import { CanvasScanner } from 'marccent-theme/components/visuals/canvas-scanner';
import JsonLd from '@/components/json-ld';
import { siteGraph } from '@/lib/schema';
import { site } from '@/lib/content';
import { DEFAULT_DESIGN } from 'marccent-theme/lib/design';

// Defaults for every page; a page's own metadata replaces the parts it sets. Titles read "<page> · Marccent".
// The social image comes from app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.title}: ${site.tagline}`, template: `%s · ${site.title}` },
  description: site.description,
  applicationName: site.title,
  keywords: site.keywords,
  authors: [{ name: site.author.name, url: '/about' }],
  creator: site.author.name,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.title, locale: site.locale, url: './', title: site.title, description: site.description },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}

export const viewport: Viewport = {
  themeColor: [ { media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' } ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const debug = process.env.DEBUG === 'true'; // read on the server; local work isn't tracked

  return (
    // id="site": the whole site's theme scope (lib/singleton.js SITE); SiteTheme writes its theme here.
    <html id="site" lang="en" className="" data-design={DEFAULT_DESIGN} suppressHydrationWarning>
      <SiteThemeProvider>
        {/* Body is a 1-col grid: header, main and footer are spaced by its gap. It is also the container (.cq)
            the header's layout-ends measures, since an element can't measure itself. */}
        <Body className="cq grid cols-1 gap-0">
          <Header />
          <main className="grid cols-1 gap-lg">{children}</main>
          <Footer />
          <Toast />
          <Goo /> {/* the #goo SVG filter hover-goo uses (styles/hovers.css) */}
          <SiteTheme />
          <ScopeThemes /> {/* elements' own themes, by id (a theme editor's scope: components/theme/editor.js) */}
          <Analytics enabled={!debug} />
          <PauseOffscreen />
          <CanvasScanner /> {/* canvas backgrounds from [data-canvas] (components/visuals/canvas-scanner.js) */}
          <JsonLd data={siteGraph()} /> {/* who runs the site and what it is, for search and answer engines (lib/schema.js) */}
        </Body>
      </SiteThemeProvider>
    </html>
  )
}