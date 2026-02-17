import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskAssessmentsComponent } from './risk-assessments.component';

const routes: Routes = [
  { path: '', component: RiskAssessmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskAssessmentsRoutingModule { }
