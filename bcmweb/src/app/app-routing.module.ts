import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './includes/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',                loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'master-data',              loadChildren: () => import('./pages/master-data/master-data.module').then(m => m.MasterDataModule) },
  { path: 'business-continuity-plan', loadChildren: () => import('./pages/business-continuity/business-continuity-plans/business-continuity-plans.module').then(m => m.BusinessContinuityPlansModule) },
  { path: 'site-risk-assessments',    loadChildren: () => import('./pages/business-continuity/site-risk-assessments/site-risk-assessments.module').then(m => m.SiteRiskAssessmentsModule) },
  { path: 'bcms-testing',             loadChildren: () => import('./pages/business-continuity/bcms-testing/bcms-testing.module').then(m => m.BcmsTestingModule) },
  { path: 'crisis-communication',     loadChildren: () => import('./pages/crisis-management/crisis-communication/crisis-communication.module').then(m => m.CrisisCommunicationModule) },
  { path: 'incident-report',          loadChildren: () => import('./pages/crisis-management/incident-report/incident-report.module').then(m => m.IncidentReportModule) },
  { path: 'compliance' ,              loadChildren: () => import('./pages/compliance/compliance-review/compliance-review.module').then(m => m.ComplianceReviewModule)},
  { path: 'remediation-tracker' ,     loadChildren: () => import('./pages/compliance/remediation-tracker/remediation-tracker.module').then(m => m.RemediationTrackerModule)},
  { path: 'business-impact-analysis', loadChildren: () => import('./pages/business-continuity/business-impact-analysis/business-impact-analysis.module').then(m => m.BusinessImpactAnalysisModule) },
  { path: '**',                       component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
