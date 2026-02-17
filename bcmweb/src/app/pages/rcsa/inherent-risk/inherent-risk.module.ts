import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InherentRiskRoutingModule } from './inherent-risk-routing.module';
import { NewInherentRiskComponent } from './new-inherent-risk/new-inherent-risk.component';
import { InherentRiskComponent } from './inherent-risk.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from "ng2-file-upload";  

@NgModule({
  declarations: [
    NewInherentRiskComponent,
    InherentRiskComponent
  ],
  imports: [
    CommonModule,
    InherentRiskRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    FileUploadModule
  ],
  exports: [
    NewInherentRiskComponent,
    InherentRiskComponent]
})
export class InherentRiskModule { }
