import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterRcsaComponent } from './master-rcsa.component'

const routes: Routes = [
  { path: '', component: MasterRcsaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRcsaRoutingModule { }