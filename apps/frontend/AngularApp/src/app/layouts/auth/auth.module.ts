import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';


@NgModule({
  declarations: [
    AuthLayoutComponent
  ],
  imports: [

    ReactiveFormsModule,
    SharedModule,

    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
