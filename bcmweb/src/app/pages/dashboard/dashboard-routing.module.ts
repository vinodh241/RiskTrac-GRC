import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalDashboardComponent } from './global-dashboard/global-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'global-dashboard', pathMatch: 'full' },
  { path: 'global-dashboard',           component: GlobalDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
