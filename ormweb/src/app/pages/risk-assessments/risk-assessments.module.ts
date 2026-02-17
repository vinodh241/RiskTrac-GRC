import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskAssessmentsRoutingModule } from './risk-assessments-routing.module';
import { NewAssesmentComponent } from './new-assesment/new-assesment.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';

@NgModule({
  declarations: [
    NewAssesmentComponent
  ],

  imports: [
    CommonModule,
    RiskAssessmentsRoutingModule,
    MatModule,
    CoresharedModule
  ]
})
export class RiskAssessmentsModule { }
