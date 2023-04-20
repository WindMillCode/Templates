import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOneMainComponent } from './profile-one-main/profile-one-main.component';

const routes: Routes = [
  {path:"",component:ProfileOneMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileOneRoutingModule { }
