import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


Sentry.init({
  dsn: "https://98ec96cce0c04299ba9478d079f69bc1@o306953.ingest.sentry.io/5638583",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('app')
);

serviceWorker.unregister();
