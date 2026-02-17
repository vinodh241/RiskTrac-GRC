import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterResidualRiskRatingRoutingModule } from './master-residual-risk-rating-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { MasterResidualRiskRatingComponent } from './master-residual-risk-rating.component';


@NgModule({
  declarations: [MasterResidualRiskRatingComponent],
  imports: [
    CommonModule,
    MasterResidualRiskRatingRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  exports:[MasterResidualRiskRatingComponent]
})
export class MasterResidualRiskRatingModule { }
