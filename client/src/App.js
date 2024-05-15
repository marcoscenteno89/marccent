import React, { Component } from 'react';
import Theme from './components/theme';
import { ThemeProvider } from './components/var';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import GA4React from 'ga-4-react';
import { hotjar } from 'react-hotjar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// import 'bootstrap/dist/css/bootstrap-grid.min.css';
// import 'bootstrap/dist/css/bootstrap-reboot.min.css';

const debug = (process.env.REACT_APP_DEBUG === 'true');

if (!debug) { 
  Sentry.init({
    dsn: "https://98ec96cce0c04299ba9478d079f69bc1@o306953.ingest.sentry.io/5638583",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
  
  hotjar.initialize(process.env.REACT_APP_HOTJAR);
  
  const ga4react = new GA4React('G-XT2J9RQ50E',);
  
  ga4react.initialize().then((ga4) => {
    ga4.pageview(`${window.location.pathname}${window.location.search}`);
  },(err) => {
    console.error(err)
  })
} 

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <Theme />
      </ThemeProvider>  
    )
  }
}

export default App;