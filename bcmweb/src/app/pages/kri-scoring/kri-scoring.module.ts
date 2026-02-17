import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/modules/mat/mat.module';
import {FileUploadModule} from "ng2-file-upload";  
import { KriScoringRoutingModule } from './kri-scoring-routing.module';
import { KriScoringComponent } from './kri-scoring.component';
import { KriService } from 'src/app/services/kri/kri.service';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';
import { KriMeasurementComponent } from '../dashboards/kri/kri-measurement/kri-measurement.component';


@NgModule({
  declarations: [
    KriScoringComponent,
    KriMeasurementComponent
  ],
  imports: [
    CoresharedModule,
    MatModule,
    CommonModule,
    KriScoringRoutingModule,
    FileUploadModule
  ],
  providers: [KriService]
})
export class KriScoringModule { }
