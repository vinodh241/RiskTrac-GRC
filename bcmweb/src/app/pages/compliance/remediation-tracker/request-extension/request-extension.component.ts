import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubmitReviewCommentsComponent } from 'src/app/core-shared/submit-review-comments/submit-review-comments.component';
import { formatTimeZone, stripHtml } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-request-extension',
  templateUrl: './request-extension.component.html',
  styleUrls: ['./request-extension.component.scss']
})

export class RequestExtensionComponent {

  requestForm!: FormGroup;
  startDate: any;
  endDate: any;
  startDate1: any;
  endDate1: any;
  actionPlan: any;
  source: any;
  minStartDate: any;
  targetDate: any;
  buttonName: any;
  maxTargetDate: any;
  minEndDate: any;
  parentEndDate: any;
  currDate: any;
  currentDate: any;
  maxDate: any;
  actionPlanName: any;
  disDate: any;
  submitted: boolean = false;
  dateError: boolean = false;
  dateErrormsg: boolean = false;
  expErrormsg: boolean = false;
  isReadOnly: boolean = false;
  targetDateError: boolean = false;
  saveerror = '';

  constructor(public dialogRef: MatDialogRef<RequestExtensionComponent>,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public utils: UtilsService,
    public service: RemediationTrackerService,
    private fb: FormBuilder
  ) {
    this.initialize();
  }

  ngOnInit() {
    this.actionPlan = this.parent.dataInfo;
    this.actionPlanName = stripHtml(this.actionPlan.IdentifiedActionPlan)
    this.source = this.parent.dataInfo.Source;
    this.startDate = formatTimeZone(this.parent.dataInfo.StartDate);
    this.endDate = formatTimeZone(this.parent.dataInfo.EndDate);
    this.startDate1 = formatTimeZone(this.parent.dataInfo.StartDate);
    this.parentEndDate = this.parent.dataInfo.EndDate
    this.maxTargetDate = formatTimeZone(new Date(this.parentEndDate))
    this.maxTargetDate = this.today(new Date(this.parentEndDate)) + "T00:00:00.000Z";
    this.currDate = formatTimeZone(new Date())
    this.currentDate = this.currDate + "T00:00:00.000Z";

    if (this.maxTargetDate <= this.currentDate) {
      let currentDate = new Date();
      // Get the next date
      let nextDate = new Date();
      nextDate.setDate(currentDate.getDate());

      // Format the next date as needed (e.g., YYYY-MM-DD)
      let formattedNextDate = nextDate.toISOString()
      this.disDate = formatTimeZone(formattedNextDate) + "T00:00:00.000Z"
    } else if (this.maxTargetDate >= this.currentDate) {
      this.disDate = this.maxTargetDate
    }

    if (this.parent.dataInfo.ExtendedTargetDate || this.parent.dataInfo.ExtentionExPlanation) {
      this.patchValue(this.parent.dataInfo);
    }
    this.buttonNames();
  }

  initialize() {
    this.requestForm = this.fb.group({
      explanation: ['', [Validators.required]],
      targetDate: ['', [Validators.required]]
    })
  }

  patchValue(dataInfo: any) {
    this.requestForm.patchValue({
      explanation: dataInfo.ExtentionExPlanation,
      targetDate: dataInfo.ExtendedTargetDate
    })
    if (this.parent.currentStatus == 6 || this.parent.currentStatus == 7 || this.parent.currentStatus == 8) {
      this.requestForm.get('explanation')?.disable();
      this.requestForm.get('targetDate')?.disable();
    }
  }

  get f() {
    return this.requestForm.controls;
  }

  updateSelecedTargetDate(event?: any) {
    this.minStartDate = formatTimeZone(new Date(this.startDate1));
    this.targetDate = new Date(event.value);
    let formActionValue = this.targetDate;
    let onlyCurrentDate = formatTimeZone(formActionValue);
    let StartDate = this.minStartDate + "T00:00:00.000Z";
    onlyCurrentDate = onlyCurrentDate + "T00:00:00.000Z";
    this.minEndDate = formatTimeZone(this.maxTargetDate);
    let EndDate = this.minEndDate + "T00:00:00.000Z";

    if (onlyCurrentDate < StartDate || EndDate > onlyCurrentDate) {
      this.targetDateError = true;
    } else {
      this.targetDateError = false
    }
    this.targetDate = onlyCurrentDate;
  }

  today(i: any) {
    let dd = i.getDate() + 1;
    let ddc = '';
    if (dd < 10) {
      ddc = '0' + dd;
    } else {
      ddc = '' + dd;
    }
    var mm = i.getMonth() + 1;
    let mmC = '';
    if (mm < 10) {
      mmC = '0' + mm;
    } else {
      mmC = '' + mm;
    }
    var yyyy = i.getFullYear();

    let todayDate = yyyy + '-' + mmC + '-' + ddc;

    return todayDate;
  }

  buttonNames() {
    if (this.parent.currentStatus == 2 || this.parent.currentStatus == 3) {
      this.buttonName = 'Submit Extension';
    } else if (this.parent.currentStatus == 6 || this.parent.currentStatus == 7 || this.parent.currentStatus == 8) {
      this.buttonName = 'Proceed';
    }
  }

  BtnEnableActionItem() {
    if (((this.parent.currentStatus == 3 && this.parent.bussOwner == true && this.parent.actionItemOwner == true)) && this.parent.escalation == false && this.parent.bcManager == false) {
      return true;
    } else if (((this.parent.currentStatus == 1) || (this.parent.currentStatus == 2) || (this.parent.currentStatus == 3)) && this.parent.bcManager == false && this.parent.bussOwner == false && this.parent.escalation == false) {
      return true;
    } else if ((this.parent.currentStatus == 3 && this.parent.actionItemOwner == true) && (this.parent.bussOwner == false || this.parent.bcManager == false || this.parent.escalation == false)) {
      return false;
    } else if (this.parent.currentStatus == 6 && this.parent.bussOwner == true) {
      return true;
    } else if (this.parent.currentStatus == 6 && (this.parent.bussOwner == false || this.parent.bcManager == false)) {
      return false;
    } else if (this.parent.currentStatus == 7 && this.parent.bcManager == true) {
      return true;
    } else if (this.parent.currentStatus == 8 && this.parent.escalation == true) {
      return true;
    } else if (this.parent.currentStatus == 7 && (this.parent.bussOwner == false || this.parent.bcManager == false)) {
      return false;
    } else {
      return false;
    }
  }

  openSubmitForReview() {
    let reviewData: any;
    if ((this.parent.currentStatus == 3 && this.parent.actionItemOwner == true) || (this.parent.currentStatus == 3 && this.parent.actionItemOwner == true && this.parent.bussOwner == true)) {
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        dropdownLable: "Review Decision for",
        modalTitle: `Action Item - ${this.actionPlan?.IdentifiedActionItem} : Submit Response for Review`,
        modalBodyTitle: "Please submit the action item extension for review.",
        commentLabel: "Comment",
        buttonLabel: "Submit Extension",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/request-action-item-extention",
        payload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          BCMModuleID: this.parent.dataInfo.BCMModuleID,
          Progress: this.parent.dataInfo.ProgressPercentage,
          ExtentionExplanation: this.requestForm.value.explanation,
          UserGUID: this.parent.dataInfo.ActionItemOwnerGUID,
          ExtendedTargetDate: this.targetDate ? this.targetDate : this.parent.dataInfo.ExtendedTargetDate,
          IsExtentionRequested: 1,
          NextWorkflowStatusID: 6,
          CurrentWorkflowStatusID: 3,
          previousEndDate: formatTimeZone(this.parent.dataInfo.EndDate)
        }
      }
    } else if (this.parent.currentStatus == 6 && this.parent.bussOwner == true) {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Approve", class: "greenRadio" }, { id: 2, value: "Return with comments", class: "redRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: `Submit Response for Review`,
        modalBodyTitle: "Please submit the action item extension request for review. Once approved.",
        commentLabel: "Comment",
        buttonLabel: "Submit Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/review-action-item-response",
        payload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          BCMModuleID: this.parent.dataInfo.BCMModuleID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus,
          previousEndDate: formatTimeZone(this.parent.dataInfo.EndDate),
          ExtentionRequestID: this.parent.dataInfo.ExtentionRequestID,
          IsEscalated: this.parent.dataInfo.IsEscalated,
          EscalationRequestID: this.parent.dataInfo.EscalationRequestID,
          IsExtentionRequested: this.parent.dataInfo.IsExtentionRequested
        }
      }
    } else if (this.parent.currentStatus == 7 && this.parent.bcManager == true) {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Approve", class: "greenRadio" }, { id: 2, value: "Return with comments", class: "redRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: `Submit Response for Review`,
        modalBodyTitle: "Please submit the action item extension request for review. Once approved.",
        commentLabel: "Comment",
        buttonLabel: "Submit Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/review-action-item-response",
        payload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          BCMModuleID: this.parent.dataInfo.BCMModuleID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus,
          previousEndDate: formatTimeZone(this.parent.dataInfo.EndDate),
          ExtentionRequestID: this.parent.dataInfo.ExtentionRequestID,
          IsEscalated: this.parent.dataInfo.IsEscalated,
          EscalationRequestID: this.parent.dataInfo.EscalationRequestID,
          IsExtentionRequested: this.parent.dataInfo.IsExtentionRequested
        }
      }
    } else if (this.parent.currentStatus == 8 && this.parent.escalation == true) {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Approve", class: "greenRadio" }, { id: 2, value: "Return with comments", class: "redRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: `Submit Response for Review`,
        modalBodyTitle: "Please submit the action item extension request for review. Once approved.",
        commentLabel: "Comment",
        buttonLabel: "Submit Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/review-action-item-response",
        payload: {
          ActionItemID: this.parent.dataInfo.ActionItemID,
          BCMModuleID: this.parent.dataInfo.BCMModuleID,
          NextWorkflowStatusID: this.parent.workflowStatus,
          CurrentWorkflowStatusID: this.parent.currentStatus,
          previousEndDate: formatTimeZone(this.parent.dataInfo.EndDate),
          ExtentionRequestID: this.parent.dataInfo.ExtentionRequestID,
          IsEscalated: this.parent.dataInfo.IsEscalated,
          EscalationRequestID: this.parent.dataInfo.EscalationRequestID,
          IsExtentionRequested: this.parent.dataInfo.IsExtentionRequested
        }
      }
    }

    const dialog = this.dialog.open(SubmitReviewCommentsComponent, {
      maxWidth: '100vw',
      width: '85vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: {
        data: reviewData,
        currentStep: this.parent.currentStep
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess("Submitted Successfully");
      }
    });
  }

  request() {
    this.submitted = true;

    if (this.requestForm.invalid)
      return;

    if (this.targetDateError == true)
      return;

    this.openSubmitForReview();
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
        this.service.getUpdateActionItemProgressInfo(this.parent.dataInfo.ActionItemID)
        this.dialogRef.close();
      }, timeout)
    });
  }

  close() {
    this.dialogRef.close();
  }

}
