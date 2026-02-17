import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterResidualRiskRatingComponent } from './master-residual-risk-rating.component';

const routes: Routes = [
  { path: '', component: MasterResidualRiskRatingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterResidualRiskRatingRoutingModule { }
