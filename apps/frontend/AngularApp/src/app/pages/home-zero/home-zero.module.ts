import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeZeroRoutingModule } from './home-zero-routing.module';
import { HomeZeroComponent } from './home-zero/home-zero.component';


@NgModule({
  declarations: [
    HomeZeroComponent
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    
    CommonModule,
    HomeZeroRoutingModule
  ]
})
export class HomeZeroModule { }
