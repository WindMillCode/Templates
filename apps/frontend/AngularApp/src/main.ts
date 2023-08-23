import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as Sentry from "@sentry/angular-ivy";
import { BrowserTracing } from "@sentry/browser";

import { AppModule } from './app/app.module';
import { ENV, environment } from './environments/environment';


Sentry.init({
  environment:"Angular_"+ENV.type.toUpperCase(),
  dsn: "[YOUR DSN HERE]",
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ["localhost", "https://your-app.com","https://ui.preview.your-app.com"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  // beforeSend

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: ENV.type == "dev"? 0.0: 1.0,
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
