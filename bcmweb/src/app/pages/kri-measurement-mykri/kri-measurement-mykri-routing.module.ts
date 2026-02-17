import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriMeasurementMykriComponent } from './kri-measurement-mykri.component';

const routes: Routes = [
  {path: '', component: KriMeasurementMykriComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriMesurementMykriRoutingModule { }