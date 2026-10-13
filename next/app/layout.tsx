import type { Metadata } from 'next';
import Script from "next/script";
// import { Inter } from 'next/font/google';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import GA4React from 'ga-4-react';
import './styles/bootstrap.scss';
import './styles/settings.css';
import './styles/theme.css';
import './styles/grid.css';
import './styles/globals.css';
import './styles/components.css';
import './styles/utils.css'; // last: utils win over component rules
import { BootstrapClient } from './components/client/bootstrap.js';
import { CurrentAnimWT } from "./components/client/theme";
import Header from './templates/header';
import Footer from './templates/footer';
import { Body } from './components/client/theme';
import { ThemeProvider, ToastProvider } from "./components/context";
import { WebToast } from "./components/client/component";
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
          {/* Body is a 1-col grid: header, main and footer are spaced by its gap. */}
          <Body className="grid cols-1 gap-5">
            <div className="fixed-layer back">
              <CurrentAnimWT id="main" />
            </div>
            <Header />
            {/* Side gutter and the space between sections live here once; sections are single boxes. */}
            <main className="wrap wrap-fluid grid cols-1 gap-5">{children}</main>
            <Footer />
            <WebToast />
            <BootstrapClient />
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