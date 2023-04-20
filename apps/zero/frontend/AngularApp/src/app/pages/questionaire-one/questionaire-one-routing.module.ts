import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionaireOneMainComponent } from './questionaire-one-main/questionaire-one-main.component';

const routes: Routes = [
  {path:"",component:QuestionaireOneMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionaireOneRoutingModule { }
