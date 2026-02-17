import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriReportingComponent } from './kri-reporting.component';

const routes: Routes = [
  { path: '', component: KriReportingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriReportingRoutingModule { }
