import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dateToString } from 'src/app/includes/utilities/commonFunctions';
import { SubmitReviewService } from 'src/app/services/common-module/submit-review/submit-review.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-submit-review-comments',
  templateUrl: './submit-review-comments.component.html',
  styleUrls: ['./submit-review-comments.component.scss']
})
export class SubmitReviewCommentsComponent {
  saveerror: any = "";
  reviewComments: any = "";
  submitted: boolean = false;
  reviewCommentsHistory: any;
  status: any;
  reviewDecision: any;
  currentStep: any;
  dropdownValue: any;

  constructor(
    public utils: UtilsService,
    public service: SubmitReviewService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<SubmitReviewCommentsComponent>
  ) {
    this.service.getComments(parent.data.getCommentsURL, parent.data.commentsPayload);
  }

  ngOnInit(): void {
    this.dropdownValue = this.parent.BIA;
    this.currentStep = this.parent.currentStep;
    this.service.gotReviewComments.subscribe((value: any) => {
      if (value) {
        this.reviewCommentsHistory = this.service.masterComments?.commentList;
      }
    });
  }

  submitReviewComments() {
    this.submitted = true;
    if (!this.reviewComments)
      return;

    let payloadData = Object.assign({}, this.parent.data.payload, { reviewComment: this.reviewComments })
    if (this.parent.data.isDecision.required) {
      if(this.checkValueExists(this.status)){
        return;
      }
      // status is used for approve/reject in all modules this commponent is common commponent
      payloadData = Object.assign(payloadData, {status: (this.status == 2? 0 : this.status)});
    }
    if (this.parent.data.isDropdown?.required) {
      if(this.checkValueExists(this.dropdownValue)){
        return;
      }
      // status is used for approve/reject in all modules this commponent is common commponent
      payloadData = Object.assign(payloadData, {dropdownValue: (this.dropdownValue)});
    }

    this.service.submitCommentResponse(this.parent.data.submitReviewURL, payloadData).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }

  getDateFormat(date: any) {
    return dateToString(date, true, true, false, '-');
  }

  checkValueExists(status: any) {
    if (!!status)
      return false;
    else
      return true;
  }
}
