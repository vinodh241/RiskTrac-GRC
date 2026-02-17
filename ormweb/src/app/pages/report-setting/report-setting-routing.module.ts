import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportSettingComponent } from './report-setting.component';

const routes: Routes = [
  { path: '', component: ReportSettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportSettingRoutingModule { }
