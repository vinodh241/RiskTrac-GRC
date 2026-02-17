import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskMetricsComponent } from './risk-metrics.component';

const routes: Routes = [
  { path: '', component: RiskMetricsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskMetricsRoutingModule { }
