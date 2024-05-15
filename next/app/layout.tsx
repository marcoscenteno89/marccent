import type { Metadata } from 'next';
import Script from "next/script";
// import { Inter } from 'next/font/google';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import GA4React from 'ga-4-react';
import './globals.css';
import { BootstrapClient } from './components/client/bootstrap.js';
import { CurrentAnimWT } from "./components/client/theme";
import Header from './templates/header';
import Footer from './templates/footer';
import { Body } from './components/client/theme';
import { ThemeProvider, ToastProvider } from "./components/context";
import { WebToast } from "./components/client/component";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marccent',
  description: 'Marcos Centeno Portfolio Website',
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
    <html lang="en">
      <ThemeProvider>
        <ToastProvider>
          <Body>
            <div className="fixed back">
              <CurrentAnimWT id="main" />
            </div>
            <Header />
            <main>{children}</main>
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