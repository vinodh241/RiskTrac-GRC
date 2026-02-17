import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriScoringComponent } from './kri-scoring.component';
import { KriMeasurementComponent } from '../dashboards/kri/kri-measurement/kri-measurement.component';

const routes: Routes = [
  // { path: '', component: KriScoringComponent }
  {path: '', component: KriMeasurementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriScoringRoutingModule { }
