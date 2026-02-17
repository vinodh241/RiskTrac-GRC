import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewScheduleSelfAssessmentsComponent } from './new-schedule-self-assessments/new-schedule-self-assessments.component';
import { SelfAssessmentsComponent } from './self-assessments.component';

const routes: Routes = [
  { path: '', component: SelfAssessmentsComponent },
  { path: ':id', component: SelfAssessmentsComponent },
  { path: 'self-assessments-details/:id', component: NewScheduleSelfAssessmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfAssessmentsRoutingModule { }
