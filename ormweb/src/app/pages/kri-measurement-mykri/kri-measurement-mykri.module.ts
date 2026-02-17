import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/modules/mat/mat.module';
import {FileUploadModule} from "ng2-file-upload";  
import { KriService } from 'src/app/services/kri/kri.service';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';
import { KriMeasurementMykriComponent } from './kri-measurement-mykri.component';
import { KriMesurementMykriRoutingModule } from './kri-measurement-mykri-routing.module';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    KriMeasurementMykriComponent
  ],
  imports: [
    CoresharedModule,
    MatModule,
    CommonModule,
    FileUploadModule,
    KriMesurementMykriRoutingModule,
    MatSidenavModule
  ],
  providers: [KriService]
})
export class kriMeasurementMykriModule { }