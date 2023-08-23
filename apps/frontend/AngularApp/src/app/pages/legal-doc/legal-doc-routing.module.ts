import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalDocMainComponent } from './legal-doc-main/legal-doc-main.component';

const routes: Routes = [
  { path: 'privacy-policy', component: LegalDocMainComponent },
  { path: 'terms-and-conditions', component: LegalDocMainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalDocRoutingModule { }
