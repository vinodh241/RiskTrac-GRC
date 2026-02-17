import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateEmailComponent } from './pages/generate-email/generate-email.component';
import { KriDefinitionsComponent } from './pages/kri-definitions/kri-definitions.component';
import { DashboardRouteGuard } from './services/auth/dashboard-route.guard';

const routes: Routes = [
  { path: 'report-setting', loadChildren: () => import('./pages/report-setting/report-setting.module').then(m => m.ReportSettingModule) },
  { path: 'risk-appetite-documents', loadChildren: () => import('./pages/risk-appetite-documents/risk-appetite-documents.module').then(m => m.RiskAppetiteDocumentsModule) },
  { path: 'risk-appetite-templates', loadChildren: () => import('./pages/risk-appetite-templates/risk-appetite-templates.module').then(m => m.RiskAppetiteTemplatesModule) },
  { path: 'manage-risk-assessments', loadChildren: () => import('./pages/risk-assessments/risk-assessments.module').then(m => m.RiskAssessmentsModule) },
  { path: 'risk-assessments-historical', loadChildren: () => import('./pages/risk-assessments-filtered/risk-assessments-filtered.module').then(m => m.RiskAssessmentsFilteredModule) },
  { path: 'generate-email', component: GenerateEmailComponent },
  { path: 'risk-assessments-submitted', loadChildren: () => import('./pages/risk-assessments-filtered/risk-assessments-filtered.module').then(m => m.RiskAssessmentsFilteredModule) },
  { path: 'view-risk-assessments', loadChildren: () => import('./pages/risk-metrics/risk-metrics.module').then(m => m.RiskMetricsModule) },
  { path: 'submit-risk-assessments', loadChildren: () => import('./pages/risk-metrics/risk-metrics.module').then(m => m.RiskMetricsModule) },
  { path: 'review-risk-assessments', loadChildren: () => import('./pages/risk-metrics/risk-metrics.module').then(m => m.RiskMetricsModule) },
  { path: 'risk-metric-levels', loadChildren: () => import('./pages/risk-metric-levels/risk-metric-levels.module').then(m => m.RiskMetricLevelsModule) },
  { path: 'kri-master', loadChildren: () => import('./pages/kri-master/kri-master.module').then(m => m.KriMasterModule) },
  { path: 'kri-scoring', loadChildren: () => import('./pages/kri-scoring/kri-scoring.module').then(m => m.KriScoringModule) },
  { path: 'kri-measurement', loadChildren: () => import('./pages/kri-scoring/kri-scoring.module').then(m => m.KriScoringModule) },
  // { path: 'my-kri', loadChildren: () => import('./pages/my-kri/my-kri.module').then(m => m.MyKriModule) },
  { path: 'incident-master', loadChildren: () => import('./pages/incident-master/incident-master.module').then(m => m.IncidentMasterModule) },
  { path: 'incident-list', loadChildren: () => import('./pages/incident-list/incident-list.module').then(m => m.IncidentListModule) },
  // { path: '', loadChildren: () => import('./pages/risk-assessments-filtered/risk-assessments-filtered.module').then(m => m.RiskAssessmentsFilteredModule) },
  { path: 'kri-measurement-mykri', loadChildren: () => import('./pages/kri-measurement-mykri/kri-measurement-mykri.module').then(m => m.kriMeasurementMykriModule)},
  { path: 'kri-measurement-review', loadChildren: () => import('./pages/kri-measurement-review/kri-measurement-review.module').then(m => m.kriMeasurementReviewModule)},

  {path:'',loadChildren:()=>import('./pages/dashboards/dashboard.module').then(m=>m.DashboardModule)},
  { path: 'kri-definitions', component: KriDefinitionsComponent },
  { path: 'kri-historical', loadChildren: () => import('./pages/kri-historical/kri-historical.module').then(m => m.KriHistoricalModule)},
  { path: 'kri-reporting', loadChildren: () => import('./pages/kri-reporting/kri-reporting.module').then(m => m.KriReportingModule)},
  { path: 'kri-historical-reporting', loadChildren: () => import('./pages/kri-historical-reporting/kri-historical-reporting.module').then(m => m.KriHistoricalReportingModule)},
  { path: 'manage-risk-assessments', loadChildren: () => import('./pages/risk-assessments/risk-assessments.module').then(m => m.RiskAssessmentsModule) },
  { path: 'inherent-risk', loadChildren: () => import('./pages/rcsa/inherent-risk/inherent-risk-routing.module').then(m => m.InherentRiskRoutingModule) },
//   { path: '', redirectTo: 'risk-assessments', pathMatch: 'full' },
  { path: 'schedule-assessments', loadChildren: () => import('./pages/rcsa/schedule-assessments/schedule-assessments-routing.module').then(m => m.ScheduleAssessmentsRoutingModule) },
  { path: 'self-assessments', loadChildren: () => import('./pages/rcsa/self-assessments/self-assessments-routing.module').then(m => m.SelfAssessmentsRoutingModule) },
  { path: 'master-inherent-risk', loadChildren: () => import('./pages/rcsa/master/master-inherent-risk/master-inherent-risk-routing.module').then(m => m.MasterInherentRiskRoutingModule) },
  { path: 'master-control-environment', loadChildren: () => import('./pages/rcsa/master/master-control-environment/master-control-environment.module').then(m => m.MasterControlEnvironmentModule) },
  { path: 'master-residual-risk-rating', loadChildren: () => import('./pages/rcsa/master/master-residual-risk-rating/master-residual-risk-rating.module').then(m => m.MasterResidualRiskRatingModule) },
  {path:'master-inherent-risk',loadChildren:()=>import('./pages/rcsa/master/master-inherent-risk/master-inherent-risk-routing.module').then(m=>m.MasterInherentRiskRoutingModule)},
  {path:'master-control-environment',loadChildren:()=>import('./pages/rcsa/master/master-control-environment/master-control-environment.module').then(m=>m.MasterControlEnvironmentModule)},
  {path:'master-residual-risk-rating',loadChildren:()=>import('./pages/rcsa/master/master-residual-risk-rating/master-residual-risk-rating.module').then(m=>m.MasterResidualRiskRatingModule)},
  {path:'reports',loadChildren:()=>import('./pages/reports/reports.module').then(m=>m.ReportsModule), canActivate: [DashboardRouteGuard]},
  {path:'dashboard-overall',loadChildren:()=>import('./pages/dashboards/dashboard.module').then(m=>m.DashboardModule), canActivate: [DashboardRouteGuard]},
  {path: 'master-rcsa', loadChildren: () => import('./pages/rcsa/master/master-rcsa/master-rcsa-routing.module').then(m=>m.MasterRcsaRoutingModule)},
  { path: 'kri-review', loadChildren: () => import('./pages/kri-review/kri-review.module').then(m => m.KriReviewModule)},
  { path : 'risk-register', loadChildren: () => import('./pages/risk-register/risk-register.module').then(m => m.RiskRegisterModule)}
//   {path:'',loadChildren:()=>import('./pages/dashboards/dashboard.module').then(m=>m.DashboardModule)},
  //{ path: '', redirectTo: 'risk-assessments', pathMatch: 'full' },
//   { path: '', redirectTo: 'master-inherent-risk', pathMatch: 'full' },
//   { path: '**', redirectTo: 'risk-assessments', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
