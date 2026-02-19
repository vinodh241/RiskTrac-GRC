import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcmsTestingRoutingModule } from './bcms-testing-routing.module';

import { BcmsTestListingComponent } from './bcms-test-listing/bcms-test-listing.component';
import { BcmsTestDetailsComponent } from './bcms-assessment-details/bcms-test-details/bcms-test-details.component';
import { CreateBcmsTestComponent } from './bcms-test-listing/create-bcms-test/create-bcms-test.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { BcmsAssessmentDetailsComponent } from './bcms-assessment-details/bcms-assessment-details.component';
import { ParticipantsListComponent } from './bcms-assessment-details/participants-list/participants-list.component';
import { TestParticipantReportComponent } from './questions-feedback-report/test-participant-report/test-participant-report.component';
import { TestObserverReportComponent } from './questions-feedback-report/test-observer-report/test-observer-report.component';
import { TestReportComponent } from './questions-feedback-report/test-report/test-report.component';
import { ReviewCommentsHistoryComponent } from './questions-feedback-report/review-comments-history/review-comments-history.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BcmsTestListingComponent,
    BcmsTestDetailsComponent,
    CreateBcmsTestComponent,
    BcmsAssessmentDetailsComponent,
    ParticipantsListComponent,
    TestParticipantReportComponent,
    TestObserverReportComponent,
    TestReportComponent,
    ReviewCommentsHistoryComponent,
  ],
  imports: [
    CommonModule,
    BcmsTestingRoutingModule,
    MatModule,
    CKEditorModule,
    CoreSharedModule,
    TranslateModule
  ]
})
export class BcmsTestingModule { }
