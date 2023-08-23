import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeMainComponent } from './home-main/home-main.component';


@NgModule({
  declarations: [
    HomeMainComponent
  ],
  imports: [

    ReactiveFormsModule,
    SharedModule,

    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
