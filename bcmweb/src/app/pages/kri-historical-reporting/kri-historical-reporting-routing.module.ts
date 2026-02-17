import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KriHistoricalReportingComponent } from './kri-historical-reporting.component';

const routes: Routes = [
  {path:'', component: KriHistoricalReportingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KriHistoricalReportingRoutingModule { }
