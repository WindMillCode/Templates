import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileOneRoutingModule } from './profile-one-routing.module';
import { ProfileOneMainComponent } from './profile-one-main/profile-one-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ProfileOneMainComponent
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    ProfileOneRoutingModule
  ]
})
export class ProfileOneModule { }
