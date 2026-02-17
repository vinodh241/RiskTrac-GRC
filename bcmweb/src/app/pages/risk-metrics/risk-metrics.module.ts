import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskMetricsRoutingModule } from './risk-metrics-routing.module';
import { RiskMetricsComponent } from './risk-metrics.component';
import { RiskUnitComponent } from './risk-unit/risk-unit.component';
import { RiskChartComponent } from './risk-chart/risk-chart.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { RiskUnitMakerComponent } from './risk-unit-maker/risk-unit-maker.component';
import { RiskUnitReviewerComponent } from './risk-unit-reviewer/risk-unit-reviewer.component';
import { CommentsComponent } from './comments/comments.component';
import { MetricsComponent } from './metrics/metrics.component';
import { LimitsComponent } from './limits/limits.component';
import {FileUploadModule} from "ng2-file-upload"; 
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';

@NgModule({
  declarations: [
    RiskMetricsComponent,
    RiskUnitComponent,
    RiskChartComponent,
    RiskUnitMakerComponent,
    RiskUnitReviewerComponent,
    CommentsComponent,
    MetricsComponent,
    LimitsComponent,
  ],
  imports: [
    CoresharedModule,
    CommonModule,
    RiskMetricsRoutingModule,
    MatModule,
    FileUploadModule
  ]
})
export class RiskMetricsModule { }
