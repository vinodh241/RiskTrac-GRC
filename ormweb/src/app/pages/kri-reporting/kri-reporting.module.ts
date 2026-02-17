import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriReportingRoutingModule } from './kri-reporting-routing.module';
import { KriReportingComponent } from './kri-reporting.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [
    KriReportingComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    KriReportingRoutingModule,
    CoresharedModule
  ]
})
export class KriReportingModule { }
