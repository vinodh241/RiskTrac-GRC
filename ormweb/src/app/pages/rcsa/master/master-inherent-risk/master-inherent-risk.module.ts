import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterInherentRiskRoutingModule } from './master-inherent-risk-routing.module';
import { MasterInherentRiskComponent } from './master-inherent-risk.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [MasterInherentRiskComponent],
  imports: [
    CommonModule,
    MasterInherentRiskRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    CoresharedModule
  ],
  exports:[MasterInherentRiskComponent]
})
export class MasterInherentRiskModule { }
