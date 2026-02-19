import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SiteRiskWidgetComponent } from './widgets/site-risk-widget/site-risk-widget.component';
import { RemediationTrackerWidgetComponent } from './widgets/remediation-tracker-widget/remediation-tracker-widget.component';
import { GlobalDashboardComponent } from './global-dashboard/global-dashboard.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { CoreSharedModule } from 'src/app/core-shared/core-shared.module';
import { LeadingZeroFilterModule } from 'src/app/includes/utilities/leading-zero-filter/leading-zero-filter.module';
import { RemediationTrackerPieChartComponent } from './widgets/remediation-tracker-widget/remediation-tracker-pie-chart/remediation-tracker-pie-chart.component';
import { ActionItemsBarChartComponent } from './widgets/remediation-tracker-widget/action-items-bar-chart/action-items-bar-chart.component';
import { RiskDataChartComponent } from './widgets/risk-details-widget/risk-data-chart/risk-data-chart.component';
import { BcpCriticalityDistributionComponent } from './widgets/bcp-criticality-distribution/bcp-criticality-distribution.component';
import { PeriodicReviewWidgetComponent } from './widgets/periodic-review-widget/periodic-review-widget.component';
import { BcpCoverageWidgetComponent } from './widgets/bcp-coverage-widget/bcp-coverage-widget.component';
import { RiskDetailsWidgetComponent } from './widgets/risk-details-widget/risk-details-widget.component';



@NgModule({
  declarations: [
    GlobalDashboardComponent,
    SiteRiskWidgetComponent,
    RemediationTrackerWidgetComponent,
    RemediationTrackerPieChartComponent,
    ActionItemsBarChartComponent,
    RiskDataChartComponent,
    BcpCriticalityDistributionComponent,
    PeriodicReviewWidgetComponent,
    BcpCoverageWidgetComponent,
    RiskDetailsWidgetComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatModule,
    CKEditorModule,
    CoreSharedModule,
    LeadingZeroFilterModule
  ]
})
export class DashboardModule { }
