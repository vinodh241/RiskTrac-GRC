import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BcmsTestListingComponent } from './bcms-test-listing/bcms-test-listing.component';
import { BcmsTestDetailsComponent } from './bcms-assessment-details/bcms-test-details/bcms-test-details.component';
import { BcmsAssessmentDetailsComponent } from './bcms-assessment-details/bcms-assessment-details.component';
import { TestParticipantReportComponent } from './questions-feedback-report/test-participant-report/test-participant-report.component';
import { TestObserverReportComponent } from './questions-feedback-report/test-observer-report/test-observer-report.component';
import { TestReportComponent } from './questions-feedback-report/test-report/test-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'bcms-test-listing', pathMatch: 'full' },
  { path: 'bcms-test-listing',        component: BcmsTestListingComponent },
  { path: 'bcms-assessment-details',  component: BcmsAssessmentDetailsComponent},
  { path: 'bcms-test-details',        component: BcmsTestDetailsComponent },
  { path: 'participant-report',       component: TestParticipantReportComponent },
  { path: 'observer-report',          component: TestObserverReportComponent },
  { path: 'test-report',              component: TestReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BcmsTestingRoutingModule { }
