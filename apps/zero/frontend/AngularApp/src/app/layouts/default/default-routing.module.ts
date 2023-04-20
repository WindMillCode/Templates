import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ENV } from '@env/environment';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';


let children = [
  {
    path:"",
    loadChildren:() => import("../../pages/home/home.module").then(m=>m.HomeModule)
  },
  {
    path:"product-survey",
    loadChildren:() => import("../../pages/questionaire-one/questionaire-one.module").then(m=>m.QuestionaireOneModule)
  },
  {
    path:"sample",
    loadChildren:() => import("../../pages/sample/sample.module").then(m=>m.SampleModule)
  }
]
if(ENV.type === "dev"){
  children.push(  {
    path:"profile",
    loadChildren:() => import("../../pages/profile-one/profile-one.module").then(m=>m.ProfileOneModule)
  })
}
const routes: Routes = [

  {
    path:"",
    component:DefaultLayoutComponent,
    children

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
