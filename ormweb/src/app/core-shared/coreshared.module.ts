import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { EvidenceFileComponent } from './file-upload/evidence-files/evidence-file.component';
import { MatSelectSearchDirective } from './directives/mat-select-search.directive';
import { KriThresholdSuffixPipe } from './pipes/kri-threshold-suffix.pipe';

@NgModule({
  declarations: [
    FileUploadComponent,
    EvidenceFileComponent,
    MatSelectSearchDirective,
    KriThresholdSuffixPipe
  ],
  imports: [
    CommonModule,
    MatModule,
    FileUploadModule
  ],
  exports: [
    FileUploadComponent,
    EvidenceFileComponent,
    MatSelectSearchDirective,
    KriThresholdSuffixPipe
  ]
})
export class CoresharedModule { }
