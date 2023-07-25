import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeZeroComponent } from './home-zero/home-zero.component';

const routes: Routes = [{ path: '', component: HomeZeroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeZeroRoutingModule { }
