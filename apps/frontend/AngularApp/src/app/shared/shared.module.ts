// angular
import { NgModule } from '@angular/core';
import { CommonModule,NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// wml components
import { WmlComponentsModule } from './wml-components/wml-components.module';

// i18n
import {  TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';

// material
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

// misc
import { SampleCpntComponent } from './components/sample-cpnt/sample-cpnt.component';
import { ColorOptionComponent } from './components/color-option/color-option.component';
import { ThreejsComponent } from './components/threejs/threejs.component';
import { NavZeroComponent } from './components/nav-zero/nav-zero.component';
import { CarouselZeroComponent } from './components/carousel-zero/carousel-zero.component';
import { ContainerZeroComponent } from './components/container-zero/container-zero.component';
import { LogoDisplayZeroComponent } from './components/logo-display-zero/logo-display-zero.component';
import { AdsZeroComponent } from './components/ads-zero/ads-zero.component';



let components = [
  SampleCpntComponent,
  OverlayLoadingComponent,
  ThreejsComponent,
  CarouselZeroComponent,
  ColorOptionComponent,
  NavZeroComponent,
  ContainerZeroComponent,
  LogoDisplayZeroComponent,
  AdsZeroComponent,

];

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


  ]
})
export class SharedModule { }
