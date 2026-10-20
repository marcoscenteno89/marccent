import type { Metadata } from 'next';
import Script from "next/script";
// import { Inter } from 'next/font/google';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import GA4React from 'ga-4-react';
import './styles/base.css';
import './styles/settings.css';
import './styles/theme.css';
import './styles/grid.css';
import './styles/custom.css';
import './styles/components.css';
import './styles/utils.css'; // last: utils win over component rules
// Optional design style (styles/design-styles/): type, shape, depth and effects over the site's own colors.
// Keep at most one uncommented; comment them all for the plain theme.
// import './styles/design-styles/minimal.css';
import './styles/design-styles/modern.css';
// import './styles/design-styles/professional.css';
// import './styles/design-styles/elegant.css';
// import './styles/design-styles/techy.css';
// import './styles/design-styles/glassmorphism.css';
// import './styles/design-styles/neumorphism.css';
// import './styles/design-styles/papercut.css';
// import './styles/design-styles/brutalism.css';
// import './styles/design-styles/retro.css';
// import './styles/design-styles/playful.css';
// import './styles/design-styles/editorial.css';
// import './styles/design-styles/bento.css';
// import './styles/design-styles/handdrawn.css';
// import './styles/design-styles/notebook.css';
// import './styles/design-styles/terminal.css';
// import './styles/design-styles/swiss.css';
// import './styles/design-styles/art-deco.css';
// import './styles/design-styles/comic.css';
// import './styles/design-styles/organic.css';
// import './styles/design-styles/claymorphism.css';
// import './styles/design-styles/aurora.css';
// import './styles/design-styles/cyberpunk.css';
// import './styles/design-styles/memphis.css';
// import './styles/design-styles/kinetic.css';
import { UpdateThemeVariables } from "./components/client/theme";
import { CurrentAnimWT } from "./components/client/animations";
import Header from './templates/header';
import Footer from './templates/footer';
import { Body } from './components/client/theme';
import { ThemeProvider, ToastProvider } from "./components/context";
import { Toast } from "./components/client/component";
import { site } from '@/components/server/content';

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const debug = (process.env.DEBUG === 'true');
  if (!debug) { 
    Sentry.init({
      dsn: "https://98ec96cce0c04299ba9478d079f69bc1@o306953.ingest.sentry.io/5638583",
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });

    const ga4react = new GA4React('G-XT2J9RQ50E',);
  
    ga4react.initialize().then((ga4) => {
      ga4.pageview(`${window.location.pathname}${window.location.search}`);
    },(err) => {
      console.error(err)
    })
  }

  return (
    <html lang="en" className="">
      <ThemeProvider>
        <ToastProvider>
          {/* Body is a 1-col grid: header, main and footer are spaced by its gap. It is also the container (.cq)
              the header's layout-ends measures, since an element can't measure itself. */}
          <Body className="cq grid cols-1 gap-lg">
            <div className="fixed-layer back">
              <CurrentAnimWT id="main" />
            </div>
            <Header />
            <main className="grid cols-1 gap-lg">{children}</main>
            <Footer />
            <Toast />
            <UpdateThemeVariables />
            <Script 
              strategy="lazyOnload"
              id="hotjar"
              dangerouslySetInnerHTML={{ __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:1413960,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `}}/>
          </Body>
        </ToastProvider>
      </ThemeProvider>
    </html>
  )
}