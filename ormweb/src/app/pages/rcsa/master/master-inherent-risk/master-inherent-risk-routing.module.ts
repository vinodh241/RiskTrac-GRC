import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterInherentRiskComponent } from './master-inherent-risk.component';

const routes: Routes = [
  { path: '', component: MasterInherentRiskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterInherentRiskRoutingModule { }
