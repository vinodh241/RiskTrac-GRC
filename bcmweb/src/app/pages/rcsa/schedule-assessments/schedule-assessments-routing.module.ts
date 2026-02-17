import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleAssessmentsComponent } from './schedule-assessments.component';
import { SelfAssessmentsComponent } from 'src/app/pages/rcsa/self-assessments/self-assessments.component';
import { RiskRegisterComponent } from '../../risk-register/risk-register.component';
import { RiskRegisterAssessmentWiseComponent } from './risk-register-assessment-wise/risk-register-assessment-wise.component';

const routes: Routes = [
  { path: '', component: ScheduleAssessmentsComponent },
  {
    path: 'selfassessment',
    component: SelfAssessmentsComponent
  },
  {
    path : 'risk-register-assessment-wise' ,
    component : RiskRegisterAssessmentWiseComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleAssessmentsRoutingModule { }
