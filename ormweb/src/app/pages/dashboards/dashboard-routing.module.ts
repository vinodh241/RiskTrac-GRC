import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouteGuard } from 'src/app/services/auth/dashboard-route.guard';

const routes: Routes = [
  { path: '', pathMatch: "full", redirectTo: 'dashboard-overall' },
  { path: 'dashboard-overall', component: DashboardComponent, canActivate: [DashboardRouteGuard] },
  { path: 'dashboard-rcsa', component: DashboardComponent, canActivate: [DashboardRouteGuard] },
  { path: 'dashboard-risk-appetite', component: DashboardComponent, canActivate: [DashboardRouteGuard] },
  { path: 'dashboard-kri', component: DashboardComponent, canActivate: [DashboardRouteGuard] },
  { path: 'dashboard-incident', component: DashboardComponent, canActivate: [DashboardRouteGuard] }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
