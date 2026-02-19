import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceListingComponent } from './compliance-listing/compliance-listing.component';
import { ComplianceAssessmentListingComponent } from './compliance-assessment-listing/compliance-assessment-listing.component';

const routes: Routes = [{ path: '', redirectTo: 'compliance-listing', pathMatch: 'full' },
{ path: 'compliance-listing', component: ComplianceListingComponent },
{ path: 'assessment-compliance-listing', component: ComplianceAssessmentListingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ComplianceReviewRoutingModule { }
