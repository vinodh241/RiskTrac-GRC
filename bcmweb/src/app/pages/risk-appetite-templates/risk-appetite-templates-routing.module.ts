import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskAppetiteTemplatesComponent } from './risk-appetite-templates.component';

const routes: Routes = [
  { path: '', component: RiskAppetiteTemplatesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskAppetiteTemplatesRoutingModule { }
