import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRcsaRoutingModule } from './master-rcsa-routing.module';
import { MasterRcsaComponent } from './master-rcsa.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';


@NgModule({
  declarations: [MasterRcsaComponent],
  imports: [
    CommonModule,
    MasterRcsaRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  exports:[MasterRcsaComponent]
})
export class MasterRcsaModule { }