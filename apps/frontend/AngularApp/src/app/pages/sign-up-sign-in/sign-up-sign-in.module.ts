import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpSignInRoutingModule } from './sign-up-sign-in-routing.module';
import { SignUpSignInMainComponent } from './sign-up-sign-in-main/sign-up-sign-in-main.component';


@NgModule({
  declarations: [
    SignUpSignInMainComponent
  ],
  imports: [

    ReactiveFormsModule,
    SharedModule,

    CommonModule,
    SignUpSignInRoutingModule
  ]
})
export class SignUpSignInModule { }
