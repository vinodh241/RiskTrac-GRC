import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskAssessmentsFilteredComponent } from './risk-assessments-filtered.component';

const routes: Routes = [
  { path: '', component: RiskAssessmentsFilteredComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskAssessmentsFilteredRoutingModule { }
