import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfAssessmentsRoutingModule } from './self-assessments-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { SelfAssessmentsComponent } from './self-assessments.component';
import { NewScheduleSelfAssessmentsComponent } from './new-schedule-self-assessments/new-schedule-self-assessments.component';


@NgModule({
  declarations: [
    NewScheduleSelfAssessmentsComponent,
    SelfAssessmentsComponent
  ],
  imports: [
    CommonModule,
    SelfAssessmentsRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  exports:[SelfAssessmentsComponent,NewScheduleSelfAssessmentsComponent]
})
export class SelfAssessmentsModule {


 }
