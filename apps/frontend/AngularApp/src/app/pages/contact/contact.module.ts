import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactMainComponent } from './contact-main/contact-main.component';


@NgModule({
  declarations: [
    ContactMainComponent
  ],
  imports: [

    ReactiveFormsModule,
    SharedModule,

    CommonModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
