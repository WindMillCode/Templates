// angular
import { NgModule } from '@angular/core';
import { CommonModule,NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// wml components
import { WmlComponentsModule } from './wml-components/wml-components.module';

// i18n
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';

// material
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


// misc
import { SampleCpntComponent } from './components/sample-cpnt/sample-cpnt.component';

import { StepperComponent } from './components/stepper/stepper.component';

import { RatingCardComponent } from './components/rating-card/rating-card.component';
import { RatingCarouselComponent } from './components/rating-carousel/rating-carousel.component';
import { NavZeroComponent } from './components/nav-zero/nav-zero.component';
import { ContactUsFormComponent } from './components/contact-us-form/contact-us-form.component';
import { FooterZeroComponent } from './components/footer-zero/footer-zero.component';
import { SectionZeroComponent } from './components/section-zero/section-zero.component';
import { SectionOneComponent } from './components/section-one/section-one.component';
import { CardZeroComponent } from './components/card-zero/card-zero.component';
import { EventsPanelItemComponent } from './components/events-panel-item/events-panel-item.component';
import { LogoDisplayZeroComponent } from './components/logo-display-zero/logo-display-zero.component';
import { ColorOptionComponent } from './components/color-option/color-option.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { PanelCartContainerComponent } from './components/panel-cart-container/panel-cart-container.component';
import { PanelCartComponent } from './components/panel-cart/panel-cart.component';
import { CardOneComponent } from './components/card-one/card-one.component';
import { CarouselZeroComponent } from './components/carousel-zero/carousel-zero.component';
import { CardTwoComponent } from './components/card-two/card-two.component';
import { ConfirmDialogZeroComponent } from './components/confirm-dialog-zero/confirm-dialog-zero.component';
import { DashboardCtrlZeroComponent } from './components/dashboard-ctrl-zero/dashboard-ctrl-zero.component';


let components = [
  SampleCpntComponent,
  OverlayLoadingComponent,

  StepperComponent,
  RatingCarouselComponent,
  RatingCardComponent,
  RatingStarsComponent,
  NavZeroComponent,

  ContactUsFormComponent,
  FooterZeroComponent,
  SectionZeroComponent,
  SectionOneComponent,
  CardZeroComponent,
  ColorOptionComponent,
  PanelCartContainerComponent,
  PanelCartComponent,
  CardOneComponent,
  CarouselZeroComponent,
  CardTwoComponent,
  ConfirmDialogZeroComponent,
  DashboardCtrlZeroComponent
]

let materialModules =[
  MatSlideToggleModule
]
let modules = [
  TranslateModule,
  CommonModule,
  WmlComponentsModule,
  ...materialModules
]
@NgModule({
  imports:[
    HttpClientModule,
    ...modules,
    RouterModule,

  ],
  exports: [
    ...components,
    ...modules,
    HttpClientModule,
  ],
  providers:[
    {provide:TranslatePipe,useExisting:TranslatePipe}
  ],
  declarations: [
    ...components,

    CardZeroComponent,
    EventsPanelItemComponent,
    LogoDisplayZeroComponent,


  ]
})
export class SharedModule { }
