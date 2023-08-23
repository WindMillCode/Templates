// angular
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


// misc
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { environment as env } from '@env/environment';

// i18n
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import {HttpLoaderFactory, I18NPageTitleStrategy, waitFori18nextToLoad} from "@core/utility/i18n-utils"

// interceptors
import { NewAzureAccessTokenInterceptor } from '@shared/interceptors/new-azure-access-token.interceptor';
import { XsrfInterceptor } from '@shared/interceptors/xsrf.interceptor';

// sentry
import { Router, TitleStrategy } from '@angular/router';
import { GlobalErrorHandler } from '@shared/errorhandlers/global-error-handler';
import { TraceService } from '@sentry/angular-ivy';

declare global {
  let tsParticles
  let Square
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    }),
  ],

  providers: [

    {
      provide: APP_INITIALIZER,
      useFactory: waitFori18nextToLoad,
      deps: [TranslateService],
      multi: true
    },
    {provide:HTTP_INTERCEPTORS,useClass:NewAzureAccessTokenInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:XsrfInterceptor,multi:true},
    {provide:TitleStrategy,useClass:I18NPageTitleStrategy },

    // Sentry
    {
      provide: ErrorHandler,
      useFactory:()=> new GlobalErrorHandler({
        showDialog: true
      }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [TraceService],
      multi: true,
    },
    {
      provide: TraceService,
      deps: [Router],
    },



],
  bootstrap: [AppComponent]
})
export class AppModule { }
