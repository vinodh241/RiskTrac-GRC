import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterControlEnvironmentComponent } from './master-control-environment.component';

const routes: Routes = [
  { path: '', component: MasterControlEnvironmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterControlEnvironmentRoutingModule { }
