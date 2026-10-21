'use client';
import { useEffect } from 'react';
import Script from 'next/script';

/*
 * Analytics: Sentry (errors), Google Analytics 4 (visits) and Hotjar (heatmaps), in the browser only, and only when
 * enabled (the layout turns it off with DEBUG=true, so local work isn't tracked). Sentry loads after the page is
 * interactive, so it isn't in any page's first download; GA4 uses Google's own tag (it records route changes itself).
 */

const GA_ID = 'G-XT2J9RQ50E';
const HOTJAR_ID = 1413960;

const Analytics = ({ enabled }) => {
  useEffect(() => {
    if (!enabled) return;
    (async () => {
      const Sentry = await import('@sentry/react');
      Sentry.init({
        dsn: 'https://98ec96cce0c04299ba9478d079f69bc1@o306953.ingest.sentry.io/5638583',
        integrations: [ Sentry.browserTracingIntegration() ], // built in since 7.x (no @sentry/tracing)
        tracesSampleRate: 1.0,
      });
    })();
  }, [enabled]);
  if (!enabled) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      <Script id="hotjar" strategy="lazyOnload">{`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}</Script>
    </>
  );
}

export { Analytics };
