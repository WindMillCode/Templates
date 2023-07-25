import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpSignInMainComponent } from './sign-up-sign-in-main/sign-up-sign-in-main.component';

const routes: Routes = [{ path: '', component: SignUpSignInMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpSignInRoutingModule { }
