import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/modules/mat/mat.module';
import {FileUploadModule} from "ng2-file-upload";  
import { KriService } from 'src/app/services/kri/kri.service';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';
import { KriMeasurementReviewComponent } from './kri-measurement-review.component';
import { KriMesurementReviewRoutingModule } from './kri-measurement-review-routing.module';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    KriMeasurementReviewComponent
  ],
  imports: [
    CoresharedModule,
    MatModule,
    CommonModule,
    FileUploadModule,
    KriMesurementReviewRoutingModule,
    MatSidenavModule
  ],
  providers: [KriService]
})
export class kriMeasurementReviewModule { }