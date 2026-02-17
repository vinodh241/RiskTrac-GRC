import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleAssessmentsRoutingModule } from './schedule-assessments-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { ScheduleAssessmentsComponent } from './schedule-assessments.component';
import { NewScheduleAssessmentsComponent } from './new-schedule-assessments/new-schedule-assessments.component';
import { InprogressScheduleAssessmentsComponent } from './inprogress-schedule-assessments/inprogress-schedule-assessments.component';
import { CompletedScheduleAssessmentsComponent } from './completed-schedule-assessments/completed-schedule-assessments.component';
import { ScheduleAssessmentsDetailsComponent } from './schedule-assessments-details/schedule-assessments-details.component';
import { ExistingCyclesDialogComponent } from './existing-cycles-dialog/existing-cycles-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [
    ScheduleAssessmentsComponent,
    NewScheduleAssessmentsComponent,
    InprogressScheduleAssessmentsComponent,
    CompletedScheduleAssessmentsComponent,
    ScheduleAssessmentsDetailsComponent,
    ExistingCyclesDialogComponent
  ],
  imports: [
    CommonModule,
    ScheduleAssessmentsRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    CoresharedModule
    
  ],
  exports:[
    ScheduleAssessmentsComponent,
    NewScheduleAssessmentsComponent,
    InprogressScheduleAssessmentsComponent,
    CompletedScheduleAssessmentsComponent,
    MatPaginator
  ]
})
export class ScheduleAssessmentsModule { }
