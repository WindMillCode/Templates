import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { ENV } from '@env/environment';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {addPageTitlesToRoute} from "@core/utility/route-utils"

let children:Route["children"] = [

  {
    path:"",
    loadChildren:() => import("../../pages/home-zero/home-zero.module").then(m=>m.HomeZeroModule)
  },

  { path: 'home', loadChildren: () => import('../../pages/home-zero/home-zero.module').then(m => m.HomeZeroModule) },



]


children = addPageTitlesToRoute(children)

const routes: Routes = [
  {
    path:"",
    component:DefaultLayoutComponent,
    children
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
