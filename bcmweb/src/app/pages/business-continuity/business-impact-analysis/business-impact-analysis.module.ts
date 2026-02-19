import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessImpactAnalysisRoutingModule } from './business-impact-analysis-routing.module';
import { BusinessImpactListingComponent } from './business-impact-listing/business-impact-listing.component';
import { ReviewBusinessImpactComponent } from './review-business-impact/review-business-impact.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { BusinessFunctionProfileComponent } from './review-business-impact/business-function-profile/business-function-profile.component';
import { DependenciesComponent } from './review-business-impact/dependencies/dependencies.component';
import { ImpactAssessmentComponent } from './review-business-impact/impact-assessment/impact-assessment.component';
import { ProcessActivitiesDetailsComponent } from './review-business-impact/process-activities-details/process-activities-details.component';
import { RecoveryProcessComponent } from './review-business-impact/recovery-process/recovery-process.component';
import { ResourceRequirementsComponent } from './review-business-impact/resource-requirements/resource-requirements.component';
import { RiskMitigationComponent } from './review-business-impact/risk-mitigation/risk-mitigation.component';
import { StaffContactDetailsComponent } from './review-business-impact/staff-contact-details/staff-contact-details.component';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { InitiateBiaExerciseComponent } from './initiate-bia-exercise/initiate-bia-exercise.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BusinessImpactListingComponent,
    ReviewBusinessImpactComponent,
    InitiateBiaExerciseComponent,
    BusinessFunctionProfileComponent,
    DependenciesComponent,
    ImpactAssessmentComponent,
    ProcessActivitiesDetailsComponent,
    RecoveryProcessComponent,
    ResourceRequirementsComponent,
    RiskMitigationComponent,
    StaffContactDetailsComponent,
  ],
  imports: [
    MatModule,
    CommonModule,
    BusinessImpactAnalysisRoutingModule,
    CoreSharedModule,
    CKEditorModule,
    TranslateModule
  ]
})
export class BusinessImpactAnalysisModule { }
