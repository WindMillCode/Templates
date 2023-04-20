import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionaireOneRoutingModule } from './questionaire-one-routing.module';
import { QuestionaireOneMainComponent } from './questionaire-one-main/questionaire-one-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    QuestionaireOneMainComponent
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    QuestionaireOneRoutingModule
  ]
})
export class QuestionaireOneModule { }
