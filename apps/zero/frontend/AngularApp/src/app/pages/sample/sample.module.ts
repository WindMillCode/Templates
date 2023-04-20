import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';

import { SampleMainComponent } from './sample-main/sample-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SampleMainComponent
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    SampleRoutingModule
  ]
})
export class SampleModule { }
