import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteRiskAssessmentListingComponent } from './site-risk-assessment-listing/site-risk-assessment-listing.component';
import { AssessmentRiskListingComponent } from './assessment-risk-listing/assessment-risk-listing.component';

const routes: Routes = [
  { path: '', redirectTo: 'site-risk-listing', pathMatch: 'full' },
  { path: 'site-risk-listing', component: SiteRiskAssessmentListingComponent },
  { path: 'risk-listing', component: AssessmentRiskListingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRiskAssessmentsRoutingModule { }
