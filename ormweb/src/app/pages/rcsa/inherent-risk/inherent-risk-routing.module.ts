import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InherentRiskComponent } from './inherent-risk.component';

const routes: Routes = [
  { path: '', component: InherentRiskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InherentRiskRoutingModule { }
