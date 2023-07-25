import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as Sentry from "@sentry/angular-ivy";
import { BrowserTracing } from "@sentry/browser";

import { AppModule } from './app/app.module';
import { ENV, environment } from './environments/environment';


Sentry.init({
  environment:"Angular_"+ENV.type.toUpperCase(),
  dsn: "https://6cbf3bf3ac3c4659906e0b7036023ac5@o4505122556215296.ingest.sentry.io/4505490809225216",
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ["localhost", "https://tooboards.com","https://ui.preview.tooboards.com"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  // beforeSend

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: ENV.type == "dev"? 0.2: 1.0,
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
