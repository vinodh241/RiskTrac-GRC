import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRcsaRoutingModule } from './master-rcsa-routing.module';
import { MasterRcsaComponent } from './master-rcsa.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';



@NgModule({
  declarations: [MasterRcsaComponent],
  imports: [
    CommonModule,
    MasterRcsaRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    CoresharedModule
  ],
  exports: [
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MasterRcsaComponent
  ]
})
export class MasterRcsaModule { }