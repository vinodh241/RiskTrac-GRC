import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KriMasterRoutingModule } from './kri-master-routing.module';
import { KriMasterComponent } from './kri-master.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [
    KriMasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    KriMasterRoutingModule,
    MatModule,
    ColorPickerModule,
    CoresharedModule
  ]
})
export class KriMasterModule { }
