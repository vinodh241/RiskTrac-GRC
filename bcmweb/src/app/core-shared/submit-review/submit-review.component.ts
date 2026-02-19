import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { dateToString } from 'src/app/includes/utilities/commonFunctions';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { SubmitReviewService } from 'src/app/services/common-module/submit-review/submit-review.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.scss']
})
export class SubmitReviewComponent {
  saveerror: any = "";
  reviewComments: any = "";
  submitted: boolean = false;
  reviewCommentsHistory: any;
  status: any;
  reviewDecision: any;


  constructor(
    private dialog: MatDialog,
    public utils: UtilsService,
    public service: SubmitReviewService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<SubmitReviewComponent>
  ) {
    this.service.getComments(parent.getCommentsURL, parent.commentsPayload);
  }

  ngOnInit(): void {
    this.service.gotReviewComments.subscribe((value: any) => {
      if (value) {
        this.reviewCommentsHistory = this.service.masterComments?.actionTrailList[0]?.CommentsHistory;
      }
    });
  }

  submitReviewComments() {
    this.submitted = true;
    if (!this.reviewComments)
      return;

    let payloadData = Object.assign({}, this.parent.payload, { reviewComment: this.reviewComments })
    if (this.parent.isDecision.required) {
      if(this.checkValueExists(this.status)){
        return;
      }
      // status is used for approve/reject in all modules this commponent is common commponent
      payloadData = Object.assign(payloadData, {status: (this.status == 2? 0 : this.status)});
    }

    if (this.parent.confirmationRequired || false) {
      const confirm = this.dialog.open(ConfirmDialogComponent, {
        id: 'ConfirmDialogComponent',
        disableClose: true,
        minWidth: '300px',
        panelClass: 'dark',
        data: {
          title: 'Confirmation',
          content: 'Would you like to proceed?',
        },
      });
      confirm.afterClosed().subscribe((result: any) => {
        if (result) {
          this.submitCommentResMethod(payloadData);
        }
      });
    } else {
      this.submitCommentResMethod(payloadData);
    }
  }

  submitCommentResMethod(payloadData: any) {
    this.service.submitCommentResponse(this.parent.submitReviewURL, payloadData).subscribe((res: any) => {
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
