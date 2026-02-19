import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessContinuityPlansRoutingModule } from './business-continuity-plans-routing.module';

import { BusinessContinuityListingComponent } from './business-continuity-listing/business-continuity-listing.component';
import { InitiateBCPComponent } from './business-continuity-listing/initiate-bcp/initiate-bcp.component';
import { ReviewBusinessFunctionComponent } from './review-business-function/review-business-function.component';
import { BusinessFunctionProfileComponent } from './review-business-function/business-function-profile/business-function-profile.component';
import { DependenciesComponent } from './review-business-function/dependencies/dependencies.component';
// import { ImpactAssessmentComponent } from './review-business-function/impact-assessment/impact-assessment.component';
import { ProcessActivitiesDetailsComponent } from './review-business-function/process-activities-details/process-activities-details.component';
import { RiskMitigationComponent } from './review-business-function/risk-mitigation/risk-mitigation.component';
import { ResourceRequirementsComponent } from './review-business-function/resource-requirements/resource-requirements.component';
import { StaffContactDetailsComponent } from './review-business-function/staff-contact-details/staff-contact-details.component';
import { RecoveryProcessComponent } from './review-business-function/recovery-process/recovery-process.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { BcpUnderReviewComponent } from './business-continuity-listing/bcp-under-review/bcp-under-review.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ImpactAssessmentComponent } from './review-business-function/impact-assessment/impact-assessment.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BusinessContinuityListingComponent,
    InitiateBCPComponent,
    ReviewBusinessFunctionComponent,
    BusinessFunctionProfileComponent,
    ProcessActivitiesDetailsComponent,
    DependenciesComponent,
    ImpactAssessmentComponent,
    RiskMitigationComponent,
    ResourceRequirementsComponent,
    StaffContactDetailsComponent,
    RecoveryProcessComponent,
    BcpUnderReviewComponent
  ],
  imports: [
    CommonModule,
    BusinessContinuityPlansRoutingModule,
    MatModule,
    CoreSharedModule,
    CKEditorModule,
    TranslateModule
  ]
})
export class BusinessContinuityPlansModule { }
