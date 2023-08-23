import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { addPageTitlesToRoute } from '@core/utility/route-utils';

let children:Route["children"] = [
  { path: 'sign-up', loadChildren: () => import('../../pages/sign-up-sign-in/sign-up-sign-in.module').then(m => m.SignUpSignInModule) },
  { path: 'sign-in', loadChildren: () => import('../../pages/sign-up-sign-in/sign-up-sign-in.module').then(m => m.SignUpSignInModule) }
]
children = addPageTitlesToRoute(children)
const layoutRoutes: Routes = [
  {
    path:"auth",
    component:AuthLayoutComponent,
    children
  },
];

@NgModule({
  imports: [RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }


