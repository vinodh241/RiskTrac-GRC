import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriReportingRoutingModule } from './kri-reporting-routing.module';
import { KriReportingComponent } from './kri-reporting.component';
import { MatModule } from 'src/app/modules/mat/mat.module';


@NgModule({
  declarations: [
    KriReportingComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    KriReportingRoutingModule
  ]
})
export class KriReportingModule { }
