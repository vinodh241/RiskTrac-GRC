import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteRiskAssessmentsRoutingModule } from './site-risk-assessments-routing.module';

import { AssessmentRiskListingComponent } from './assessment-risk-listing/assessment-risk-listing.component';
import { UpdateRiskComponent } from './assessment-risk-listing/update-risk/update-risk.component';
import { SiteRiskAssessmentListingComponent } from './site-risk-assessment-listing/site-risk-assessment-listing.component';
import { AddEditSiteRiskComponent } from './site-risk-assessment-listing/add-edit-site-risk/add-edit-site-risk.component';
import { SraConsolidatedReportComponent } from './site-risk-assessment-listing/sra-consolidated-report/sra-consolidated-report.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AssessmentRiskListingComponent,
    UpdateRiskComponent,
    SiteRiskAssessmentListingComponent,
    AddEditSiteRiskComponent,
    SraConsolidatedReportComponent
  ],
  imports: [
    CommonModule,
    SiteRiskAssessmentsRoutingModule,
    MatModule,
    CoreSharedModule,
    TranslateModule
  ]
})
export class SiteRiskAssessmentsModule { }
