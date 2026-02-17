import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskMetricLevelsComponent } from './risk-metric-levels.component';

const routes: Routes = [
  { path: '', component: RiskMetricLevelsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskMetricLevelsRoutingModule { }
