import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitReviewComponent } from './submit-review/submit-review.component';
import { MatModule } from '../modules/mat/mat.module';
import { CommentsPopupComponent } from './comments-popup/comments-popup.component';
import { ConsolidatedReportComponent } from './consolidated-report/consolidated-report.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SubmitReviewCommentsComponent } from './submit-review-comments/submit-review-comments.component';
import { MatSelectSearchDirective } from './directives/mat-select-search.directive';

@NgModule({
  declarations: [
    SubmitReviewComponent,
    CommentsPopupComponent,
    ConsolidatedReportComponent,
    FileUploadComponent,
    SubmitReviewCommentsComponent,
    MatSelectSearchDirective,
  ],
  imports: [
    CommonModule,
    MatModule,
    FileUploadModule
  ],
  exports: [
    SubmitReviewComponent,
    FileUploadComponent,
    MatSelectSearchDirective,
  ]
})
export class CoreSharedModule { }
