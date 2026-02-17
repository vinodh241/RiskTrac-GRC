import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriMasterRoutingModule } from './kri-master-routing.module';
import { KriMasterComponent } from './kri-master.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { ColorPickerModule } from 'ngx-color-picker';


@NgModule({
  declarations: [
    KriMasterComponent
  ],
  imports: [
    CommonModule,
    KriMasterRoutingModule,
    MatModule,
    ColorPickerModule
  ]
})
export class KriMasterModule { }
