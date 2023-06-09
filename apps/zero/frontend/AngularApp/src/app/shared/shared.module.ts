// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common'

// wml components
import { WmlComponentsModule } from './wml-components/wml-components.module';

// i18n
import { TranslateModule } from '@ngx-translate/core';



import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';


// material
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';

// misc
import { NotifyBannerComponent } from './components/notify-banner/notify-banner.component';
import { SampleCpntComponent } from './components/sample-cpnt/sample-cpnt.component';
import { CustomLabelComponent } from './components/custom-label/custom-label.component';
import { ButtonOneComponent } from './components/button-one/button-one.component';
import { StepperComponent } from './components/stepper/stepper.component';

import { RatingCardComponent } from './components/rating-card/rating-card.component';
import { RatingCarouselComponent } from './components/rating-carousel/rating-carousel.component';

import { OptionOneComponent } from './components/option-one/option-one.component';


let components = [
  SampleCpntComponent,
  CustomLabelComponent,
  OverlayLoadingComponent,
  ButtonOneComponent,

  StepperComponent,
  RatingCarouselComponent,
  RatingCardComponent,
  // ScrollBottomPaginationDirective,

]

let materialModules =[
  MatMenuModule,
  MatCardModule,
  MatSlideToggleModule
]
let modules = [
  TranslateModule,
  CommonModule,
  NgOptimizedImage,
  WmlComponentsModule,
  ...materialModules
]
@NgModule({
  imports:[
    ...modules,
    RouterModule,
  ],
  exports: [
    ...components,
    ...modules,
    HttpClientModule,
  ],
  providers:[

  ],
  declarations: [
    ...components,
    NotifyBannerComponent,
    OptionOneComponent
  ]
})
export class SharedModule { }
