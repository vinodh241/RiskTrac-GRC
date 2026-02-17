import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterControlEnvironmentRoutingModule } from './master-control-environment-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { MasterControlEnvironmentComponent } from './master-control-environment.component';


@NgModule({
  declarations: [MasterControlEnvironmentComponent],
  imports: [
    CommonModule,
    MasterControlEnvironmentRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  exports: [MasterControlEnvironmentComponent]
})
export class MasterControlEnvironmentModule { }
