import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleMainComponent } from './sample-main/sample-main.component';

const routes: Routes = [
  {path:"",component:SampleMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
