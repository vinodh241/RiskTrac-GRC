import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidualRiskRatingRoutingModule } from './residual-risk-rating-routing.module';
import { ResidualRiskComponent } from './residual-risk/residual-risk.component';
import { OverallInherentRiskRatingComponent } from './overall-inherent-risk-rating/overall-inherent-risk-rating.component';
import { ResidualRiskRatingComponent } from './residual-risk-rating.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    ResidualRiskComponent,
    OverallInherentRiskRatingComponent,
    ResidualRiskRatingComponent
  ],
  imports: [
    CommonModule,
    ResidualRiskRatingRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule
  ],exports:[
    ResidualRiskComponent,
    OverallInherentRiskRatingComponent,
    ResidualRiskRatingComponent
  ]
})
export class ResidualRiskRatingModule { }
