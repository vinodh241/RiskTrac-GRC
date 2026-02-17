import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentMasterComponent } from './incident-master.component';

const routes: Routes = [
  { path: '', component: IncidentMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentMasterRoutingModule { }
