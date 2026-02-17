import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriMeasurementReviewComponent } from './kri-measurement-review.component';

const routes: Routes = [
  {path: '', component: KriMeasurementReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriMesurementReviewRoutingModule { }