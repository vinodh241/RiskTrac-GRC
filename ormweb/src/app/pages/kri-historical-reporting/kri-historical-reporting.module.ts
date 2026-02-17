import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriHistoricalReportingRoutingModule } from './kri-historical-reporting-routing.module';
import { KriHistoricalReportingComponent } from './kri-historical-reporting.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [
    KriHistoricalReportingComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    KriHistoricalReportingRoutingModule,
    CoresharedModule
  ]
})
export class KriHistoricalReportingModule { }
