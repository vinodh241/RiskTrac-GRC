import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dateToString } from 'src/app/includes/utilities/commonFunctions';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-review-comments-history',
  templateUrl: './review-comments-history.component.html',
  styleUrls: ['./review-comments-history.component.scss']
})

export class ReviewCommentsHistoryComponent implements OnInit{
  @Output("sucessScrollUP") sucessScrollUP: EventEmitter<any> = new EventEmitter();

  reviewCommentsHistory : any[] = [];
  reviewOptions         : any[] = [
    { id: 1, value: 1, className: 'greenRadio', option: 'Approved'},
    { id: 2, value: 2, className: 'redRadio mt-2', option: 'Return with comment'}
  ];
  reviewerDescision: any = '';
  reviewerComments : any = '';

  saveerror: string  = '';
  submitted: boolean = false;

  submitPD: boolean = false;
  formdisability: boolean = false;

  constructor(
    private dialog: MatDialog,
    public utils: UtilsService,
    public service: BcmsTestingService,
    @Inject(DOCUMENT) private _document: any,
  ) {};

  ngOnInit(): void {
    this.service.gotParticipantReportData$.subscribe((value: any) => {
      if (value) {
        this.reviewCommentsHistory = this.service.reviewCommentsHistory;
        this.submitPD = false;
        if(((this.service.testParticipantDetails.BusinessOwnerGUID == this.service.loggedUser) && [5, 6].includes(this.service.testParticipantDetails.TestWorkflowStatusID))) {
          this.submitPD = true;
        }
        if((this.service.isBCManager && [9, 10].includes(this.service.testParticipantDetails.TestWorkflowStatusID))) {
          this.submitPD = true;
        }
      };
    });

    this.service.gotObserverReportData$.subscribe((value: any) => {
      if (value) {
        this.reviewCommentsHistory = this.service.reviewCommentsHistory;
        this.submitPD = false;
      };
    });

    this.service.gotTestReportData$.subscribe((value: any) => {
      if (value) {
        this.reviewCommentsHistory = this.service.reviewCommentsHistory;
        this.submitPD = false;
      };
    });
  };


  submitParticipantDescision() {
    this.submitted = true;
    if (!this.reviewerDescision || !this.reviewerComments)
      return;

    let payload = {
      "testAssessmentId": this.service.testDetails.TestAssessmentID,
      "testParticipantId": this.service.testParticipantDetails.TestParticipantID,
      "scheduledTestId": this.service.testParticipantDetails.ScheduledTestID,
      "templateId": 1,
      "reviewStatus": this.reviewerDescision == 2 ? 0 : 1,		//1:approve ,0:reject
      "reviewComment": this.reviewerComments
    }

    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Would you like to proceed?',
      },
    });
    confirm.afterClosed().subscribe((result: any) => {
      if (result) {
        this.service.submitParticipantResponse(payload).subscribe((res: any) => {
          next:
          if (res.success == 1) {
            this.saveSuccess('Provided Review Decision');
            this.service.processParticipantReportData(res);
            this.submitPD = false;
            this.sucessScrollUP.emit();
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
        });
      }
    });
  }

  getDateFormat(date: any) {
    return dateToString(date, true, true, false, '-');
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }
}
