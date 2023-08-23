import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalDocRoutingModule } from './legal-doc-routing.module';
import { LegalDocMainComponent } from './legal-doc-main/legal-doc-main.component';

@NgModule({
  declarations: [
    LegalDocMainComponent,
  ],
  imports: [

    ReactiveFormsModule,
    SharedModule,

    CommonModule,
    LegalDocRoutingModule
  ]
})
export class LegalDocModule { }
