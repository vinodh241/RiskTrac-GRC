import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/modules/mat/mat.module';

import { RiskAssessmentsFilteredRoutingModule } from './risk-assessments-filtered-routing.module';
import { RiskAssessmentsFilteredComponent } from './risk-assessments-filtered.component';


@NgModule({
  declarations: [
    RiskAssessmentsFilteredComponent
  ],
  imports: [
    CommonModule,
    RiskAssessmentsFilteredRoutingModule,
    MatModule
  ]
})
export class RiskAssessmentsFilteredModule { }
