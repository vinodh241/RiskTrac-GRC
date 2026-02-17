import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlEnvironmentComponent } from './control-environment.component';

const routes: Routes = [
  { path: '', component: ControlEnvironmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlEnvironmentRoutingModule { }
