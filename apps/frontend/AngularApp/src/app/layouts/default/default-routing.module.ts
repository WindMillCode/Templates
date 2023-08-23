import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { ENV } from '@env/environment';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {addPageTitlesToRoute} from "@core/utility/route-utils"

let children:Route["children"] = [
  {
    path:"contact",
    loadChildren:() => import("../../pages/contact/contact.module").then(m=>m.ContactModule)
  },

  {
    path:"",
    loadChildren:() => import("../../pages/home/home.module").then(m=>m.HomeModule)
  },

  {
    path: 'events',
    children:[


    ]
  },
  {
    path: 'store',
    children:[



    ],
  },
  {
    path: 'legal',
    loadChildren: () => import('../../pages/legal-doc/legal-doc.module').then(m => m.LegalDocModule),
  },


]

if(ENV.type === "dev"){

}
children = addPageTitlesToRoute(children)
const layoutRoutes: Routes = [
  {
    path:"",
    component:DefaultLayoutComponent,
    children
  },
];

@NgModule({
  imports: [RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
