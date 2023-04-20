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
import { ScrollBottomPaginationDirective } from './directives/scroll-bottom-pagination-directive/scroll-bottom-pagination.directive';
import { ButtonOneComponent } from './components/button-one/button-one.component';
import { NavMainComponent } from './components/nav/nav-main/nav-main.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SectionsOneComponent } from './components/sections-one/sections-one.component';
import { RatingCardComponent } from './components/rating-card/rating-card.component';
import { RatingCarouselComponent } from './components/rating-carousel/rating-carousel.component';
import { SectionsTwoComponent } from './components/sections-two/sections-two.component';
import { AvatarOneComponent } from './components/avatar-one/avatar-one.component';
import { JoinWaitlistFormComponent } from './components/join-waitlist-form/join-waitlist-form.component';
import { CandidacyInfoFormComponent } from './components/candidacy-info-form/candidacy-info-form.component';
import { DecideToDoSurveyComponent } from './components/decide-to-do-survey/decide-to-do-survey.component';
import { OptionOneComponent } from './components/option-one/option-one.component';


let components = [
  SampleCpntComponent,
  CustomLabelComponent,
  OverlayLoadingComponent,
  ButtonOneComponent,
  NavMainComponent,
  StepperComponent,
  FileUploadComponent,
  SectionsOneComponent,
  RatingCarouselComponent,
  RatingCardComponent,
  SectionsTwoComponent,
  AvatarOneComponent,
  CandidacyInfoFormComponent,
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
    JoinWaitlistFormComponent,
    DecideToDoSurveyComponent,
    OptionOneComponent
  ]
})
export class SharedModule { }
