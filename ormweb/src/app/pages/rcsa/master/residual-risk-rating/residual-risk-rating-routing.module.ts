import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidualRiskRatingComponent } from './residual-risk-rating.component';

const routes: Routes = [
  { path: '', component: ResidualRiskRatingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidualRiskRatingRoutingModule { }
