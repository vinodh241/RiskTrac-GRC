import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceReviewRoutingModule } from './compliance-review-routing.module';
import { ComplianceListingComponent } from './compliance-listing/compliance-listing.component';
import { NewComplianceComponent } from './compliance-listing/new-compliance/new-compliance.component';
import { ComplianceAssessmentListingComponent } from './compliance-assessment-listing/compliance-assessment-listing.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';

@NgModule({
  declarations: [
    ComplianceListingComponent,
    NewComplianceComponent,
    ComplianceAssessmentListingComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    ComplianceReviewRoutingModule,
    CoreSharedModule
  ]
})
export class ComplianceReviewModule { }
