import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentReportsListComponent } from './incident-reports-list/incident-reports-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'incident-report-list', pathMatch: 'full' },
  { path: 'incident-report-list', component: IncidentReportsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentReportRoutingModule { }
