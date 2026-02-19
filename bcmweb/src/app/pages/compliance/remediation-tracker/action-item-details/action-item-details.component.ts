import { Component, Inject } from '@angular/core';
import { UploadSupportingComponent } from './action-item-progress/upload-supporting/upload-supporting.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RequestExtensionComponent } from '../request-extension/request-extension.component';
import { SubmitReviewCommentsComponent } from 'src/app/core-shared/submit-review-comments/submit-review-comments.component';
import * as saveAs from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { dateToString, stripHtml } from 'src/app/includes/utilities/commonFunctions';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-action-item-details',
  templateUrl: './action-item-details.component.html',
  styleUrls: ['./action-item-details.component.scss']
})

export class ActionItemDetailsComponent {

  actionItemForm!: FormGroup;
  actionPlan: any;
  commentHistory: any;
  startDate: any;
  endDate: any;
  source: any;
  infoData: any;
  latestComm: any;
  budgetStatus: any;
  critical: any;
  data: any;
  workflowStatus: any;
  currentStatus: any;
  buttonName: any;
  workflowStatusBC: any;
  bcManager: any;
  businessOwner: any;
  escalation: any;
  buttonExt: any;
  uploadedFileData: any;
  actionItemComm: any;
  actionItemOwner: any;
  isRejected: any;
  reSubmit: any;
  outputRes: any;
  actionPlanData: any;
  ckeConfig: any;
  disabledCkeConfig: any;
  submitted: boolean = false;
  isCheckbox: boolean = true;
  ismarkEnable: boolean = false;
  numErr: boolean = false;
  isSupp: boolean = false;
  fileDataLength: boolean = false;
  isDelIcon: boolean = false;
  saveerror = "";
  displayedColumns = ['Index', 'OriginalFileName', 'CreatedDate', 'Action'];
  currency = environment.currency;
  enableActionItem : boolean = false;
  RiskDetails : any
  BudgetList: any[] = [
    {
      'BudgetId': 0,
      'Budget': "No"
    },
    {
      'BudgetId': 1,
      'Budget': "Yes"
    }]

  CriticalList: any[] = [
    {
      'CriticalityID': 1,
      'CriticalityName': "Low"
    },
    {
      'CriticalityID': 2,
      'CriticalityName': "Medium"
    },
    {
      'CriticalityID': 3,
      'CriticalityName': "High"
    },
  ]

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<ActionItemDetailsComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public utils: UtilsService,
    private fb: FormBuilder,
    public service: RemediationTrackerService,
    private ckEditorService: CkEditorConfigService
  ) {
    this.service.getUpdateActionItemProgressInfo(this.parent.ActionItemID);
    this.initialize();
    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
  }

  ngOnInit() {
    this.infoData = this.parent;
    console.log('✌️this.infoData --->', this.infoData);

    this.service.actionprogSubj.subscribe((value) => {
      if (value) {
        this.actionPlan       = this.service.actionprogObj?.detailActionLists[0] || [];
        this.source           = this.service.actionprogObj?.detailActionLists[0]?.Source;
        this.startDate        = this.formatTimeZone(this.service.actionprogObj.detailActionLists[0]?.StartDate);
        this.endDate          = this.formatTimeZone(this.service.actionprogObj.detailActionLists[0]?.EndDate);
        this.commentHistory   = this.service.actionprogObj?.commentsList || [];
        this.latestComm       = this.service.actionprogObj?.commentsList[0];
        this.critical         = this.service.actionprogObj.detailActionLists[0]?.CriticalityID;
        this.budgetStatus     = this.service.actionprogObj.detailActionLists[0]?.IsBudgetRequired;
        this.workflowStatusBC = (this.actionPlan?.NextWorkFlowStatusIDToDBList != null) ? this.actionPlan?.NextWorkFlowStatusIDToDBList[0]?.ToWorkflowStatusID : [];
        this.workflowStatus   = (this.actionPlan?.NextWorkFlowStatusIDToDBList != null) ? this.actionPlan?.NextWorkFlowStatusIDToDBList[1]?.ToWorkflowStatusID : [];
        // this.workflowStatusBC = this.actionPlan?.NextWorkFlowStatusIDToDBList[0]?.ToWorkflowStatusID;
        // this.workflowStatus = this.actionPlan?.NextWorkFlowStatusIDToDBList[1]?.ToWorkflowStatusID;
        this.currentStatus    = this.service.actionprogObj.detailActionLists[0]?.CurrentWorkFlowStatusIDToDB;
        this.actionItemOwner  = this.service.actionprogObj.IsActionItemOwnerUser[0]?.IsActionItemOwner;
        this.bcManager        = this.service.actionprogObj.IsBCManager[0]?.IsBCManager;
        this.businessOwner    = this.service.actionprogObj.IsSiteBusinessOwner[0]?.IsSiteBusinessOwner;
        this.escalation       = this.service.actionprogObj.IsBCMSteeringCommitee[0]?.IsBCMSteeringCommitee;
        this.actionItemComm   = this.service.actionprogObj?.ActionItemOwnerComments?.CommentBody || [];
        this.isRejected       = this.service.actionprogObj.detailActionLists[0]?.IsRejected;
        this.actionPlanData   = this.service.actionprogObj?.detailActionLists[0]?.IdentifiedActionPlan || [];
        this.RiskDetails      = this.service.actionprogObj?.detailActionLists[0]?.RiskDetails || "";

        if (this.service.actionprogObj?.attachmentList?.length) {
          this.fileDataLength = true;
          this.uploadedFileData = this.service.actionprogObj.attachmentList;
        } else {
          this.fileDataLength = false;
          this.uploadedFileData = null;
        }
        if (this.actionPlan?.ProgressPercentage || this.isRejected == 1 || this.actionItemComm) {
          this.patchValue();
        } else {
          if (this.actionItemOwner == true) {
            this.initialize();
          }
        }
        this.buttonNames();
        this.buttonNameForExt();

        // condition for supporting document
        if (((this.currentStatus == 2 && this.actionItemOwner == true && this.businessOwner == true) || (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted != 1 && this.actionItemOwner == true && this.businessOwner == true))
          && this.escalation == false && this.bcManager == false) {
          this.isSupp = false;
        } else if ((this.currentStatus == 2 && this.actionItemOwner == true) || (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted != 1 && this.actionItemOwner == true)
          && this.escalation == false && this.bcManager == false && this.businessOwner == false) {
          this.isSupp = false;
        } else {
          this.isSupp = true;
        }
        // condition for delete button
        if (!this.actionItemOwner == true) {
          this.isDelIcon = true;
        } else if (this.actionItemOwner == true && this.businessOwner == true && ((this.currentStatus != 2 && this.currentStatus != 3) || (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 1))) {
          this.isDelIcon = true;
        } else if (this.actionItemOwner == true && ((this.currentStatus != 2 && this.currentStatus != 3) || (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 1))) {
          this.isDelIcon = true;
        }
        else {
          this.isDelIcon = false;
        }
      }
      const currentDate = new Date();
      if (new Date(this.infoData.StartDate) > currentDate && [2,3].includes(this.infoData.StatusID)) {
        this.enableActionItem = true;
        this.actionItemForm.disable();
      } else {
        this.enableActionItem = false;
        this.actionItemForm.enable();
      }
      if(this.isSupp){
        this.actionItemForm.get('comment')?.disable();
        this.actionItemForm.get('quantity')?.disable();
        this.actionItemForm.get('mark')?.disable();
      }
    })
  }

  initialize() {
    this.actionItemForm = this.fb.group({
      comment: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      mark: [Boolean]
    })

    this.actionItemForm.controls['mark'].setValue(false);
  }

  patchValue() {
    this.actionItemForm.patchValue({
      comment: this.actionItemComm,
      quantity: this.actionPlan.ProgressPercentage,
      mark: this.actionPlan.IsMarkCompleted

    })
    this.actionItemForm.get('comment')?.enable();
    this.actionItemForm.get('quantity')?.enable();

    if (this.actionItemComm.length > 1 && this.actionPlan.IsMarkCompleted == 1) {
      this.reSubmit = 1
    }

    if ((this.currentStatus == 3 && this.actionItemOwner == true && this.actionPlan.IsMarkCompleted == 1 && this.isRejected == 0) || (this.currentStatus == 3 && this.bcManager == true)
      || this.currentStatus == 4 || this.currentStatus == 5 || this.currentStatus == 6 || this.currentStatus == 7 || this.currentStatus == 8 || this.currentStatus == 9) {
      this.actionItemForm.get('comment')?.disable();
      this.actionItemForm.get('quantity')?.disable();
      this.actionItemForm.get('mark')?.disable();
    } else if (((this.currentStatus == 3 || this.currentStatus == 2) && this.actionItemOwner == true && this.businessOwner == true) && this.bcManager == false && this.escalation == false) {
      this.actionItemForm.get('comment')?.enable();
      this.actionItemForm.get('quantity')?.enable();
    } else if (((this.currentStatus == 3 || this.currentStatus == 2) && this.actionItemOwner == true) && this.businessOwner == true && this.bcManager == false && this.escalation == false) {
      this.actionItemForm.get('comment')?.enable();
      this.actionItemForm.get('quantity')?.enable();
    } else if ((this.currentStatus == 2 || this.currentStatus == 3) && (this.businessOwner == true || this.businessOwner == true || this.escalation == true)) {
      this.actionItemForm.get('comment')?.disable();
      this.actionItemForm.get('quantity')?.disable();
      this.actionItemForm.get('mark')?.disable();
    } else if (this.currentStatus == 1 && (this.actionItemOwner == true || this.businessOwner == true || this.businessOwner == true || this.escalation == true)) {
      this.actionItemForm.get('comment')?.disable();
      this.actionItemForm.get('quantity')?.disable();
      this.actionItemForm.get('mark')?.disable();
    }

  }

  //to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
  formatTimeZone(dateval: any) {
    let date = null;
    if (dateval instanceof Date) {
      const d = dateval.getDate();
      let dd = '';
      if (d < 10) {
        dd = '0' + d;
      } else {
        dd = '' + d;
      }
      let m = dateval.getMonth() + 1;
      let mm = '';
      if (m < 10) {
        mm = '0' + m;
      } else {
        mm = '' + m;
      }
      const y = dateval.getFullYear();
      const Timeval = "00:00:00.000Z"
      let val = y + '-' + mm + '-' + dd;
      date = val
    } else if (typeof dateval === 'string' || dateval instanceof String) {
      const dateval2 = dateval.split('T')[0];
      const Timeval = "00:00:00.000Z"
      date = dateval2;
    } else {
      return null;
    }
    return date;
  }

  enablemark() {
    if (this.actionItemForm.get('quantity')?.value > 100) {
      this.numErr = true;
    } else {
      this.numErr = false;
    }
  }

  isChecked() {
    if (this.actionItemForm.get('mark')?.value == false) {
      const confirm = this.dialog.open(ConfirmDialogComponent, {
        id: 'ConfirmDialogComponent',
        disableClose: true,
        minWidth: '300px',
        panelClass: 'dark',
        data: {
          title: 'Confirmation',
          content:
            "Once the action item is mark completed and saved,\nEdit functionality won't be allowed. \n\nWould you like to proceed?",
        },
      });
      confirm.afterClosed().subscribe((result) => {
        if (result) {
        } else {
          this.actionItemForm.controls['mark'].setValue(false);
        }
      })
    } else { }
  }

  get f() {
    return this.actionItemForm.controls;
  }

  upload() {
    const dialog = this.dialog.open(UploadSupportingComponent, {
      disableClose: true,
      panelClass: ['bussfun', 'full-screen-modal'],
      data: {
        "actionPlan": this.actionPlan,
        "fileTypeList": this.service.actionprogObj?.fileTypeList,
        "Progress": (this.actionItemForm.value.quantity).toString(),
        "Comment": this.actionItemForm.value.comment,
        "IsMarkedComplete": (this.actionItemForm.value.mark == false || this.actionItemForm.value.mark == undefined) ? 0 : 1
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.outputRes = result;
        this.patchValueData(this.outputRes)
      }
    });
  }

  patchValueData(infoData: any) {
    setTimeout(() => {
      this.actionItemForm.patchValue({
        comment: infoData.updatedComment,
        quantity: infoData.updatedProgress,
        mark: infoData.IsMarkedComplete
      })
    }, 1000)
  }

  requestExtension() {
    const dialog = this.dialog.open(RequestExtensionComponent, {
      disableClose: true,
      panelClass: ['bussfun', 'full-screen-modal'],
      data: {
        dataInfo: this.actionPlan,
        comment: this.latestComm,
        currentStatus: this.currentStatus,
        workflowStatus: this.workflowStatus,
        bussOwner: this.businessOwner,
        bcManager: this.bcManager,
        escalation: this.escalation,
        actionItemOwner: this.actionItemOwner,
        currentStep: this.actionPlan?.CurrentWorkFlowStatusToDB
      }
    });
    dialog.afterClosed().subscribe((result) => { });
  }

  buttonNames() {
    if (this.currentStatus == 1 || this.currentStatus == 2 || (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 0) || this.currentStatus == 9 || this.currentStatus == 6 || this.currentStatus == 7 || this.currentStatus == 8) {
      this.buttonName = 'Update'

    } else if ((this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 1)) {
      this.buttonName = 'Submit'

    } else if ((this.currentStatus == 3 && this.isRejected == 1)) {
      this.buttonName = 'Update'

    } else if ((this.currentStatus == 4 && this.businessOwner == true) || (this.currentStatus == 5 && this.bcManager == true)) {
      this.buttonName = 'Review'

    } else if ((this.currentStatus == 4 && this.bcManager == false) || (this.currentStatus == 5 && this.businessOwner == false)) {
      this.buttonName = 'Update'

    } else if ((this.currentStatus == 4 && this.bcManager == true)) {
      this.buttonName = 'Update'

    } else if ((this.currentStatus == 5 && this.businessOwner == true)) {
      this.buttonName = 'Review'
    }
  }

  buttonNameForExt() {
    if (((this.currentStatus == 2 || this.currentStatus == 3) && (this.actionItemOwner == true && this.businessOwner == true)) || (this.currentStatus == 2 || this.currentStatus == 3) && this.actionItemOwner == true) {
      this.buttonExt = 'Request Extension';
    } else if ((this.currentStatus == 6 || this.currentStatus == 7 || this.currentStatus == 8) && this.actionItemOwner == true) {
      this.buttonExt = 'View Extension';
    } else if (this.currentStatus == 6 && this.businessOwner == true) {
      this.buttonExt = 'Review Extension';
    } else if ((this.currentStatus == 7 || this.currentStatus == 8) && this.businessOwner == true) {
      this.buttonExt = 'View Extension';
    } else if (this.currentStatus == 6 && (this.bcManager == true || this.escalation == true)) {
      this.buttonExt = 'View Extension';
    } else if (this.currentStatus == 7 && this.bcManager == true) {
      this.buttonExt = 'Review Extension';
    } else if (this.currentStatus == 7 && this.escalation == true) {
      this.buttonExt = 'View Extension';
    } else if (this.currentStatus == 8 && this.bcManager == true) {
      this.buttonExt = 'View Extension';
    } else if (this.currentStatus == 8 && this.escalation == true) {
      this.buttonExt = 'Review Escalation';
    }
  }

  BtnEnableActionItem() {
    if ((this.currentStatus == 2 || this.currentStatus == 3) && this.businessOwner == false && this.bcManager == false && this.escalation == false) {
      return true;
    } else if ((this.currentStatus == 3 && this.actionItemOwner == true && this.businessOwner == true && this.isRejected == 1) && this.bcManager == false && this.escalation == false) {
      return true;
    } else if ((this.currentStatus == 3 && this.actionItemOwner == true && this.isRejected == 1) && this.bcManager == false && this.escalation == false && this.businessOwner == false) {
      return true;
    } else if ((this.currentStatus == 2 && this.actionItemOwner == true && this.businessOwner == true) && this.bcManager == false && this.escalation == false) {
      return true;
    } else if ((this.currentStatus == 3 && this.actionItemOwner == true && this.businessOwner == true) && this.bcManager == false && this.escalation == false) {
      return true;
    } else if (this.currentStatus == 4 && this.businessOwner == true) {
      return true;
    } else if (this.currentStatus == 4 && (this.businessOwner == false || this.bcManager == false)) {
      return false;
    } else if (this.currentStatus == 5 && this.bcManager == true) {
      return true;
    } else if (this.currentStatus == 5 && (this.businessOwner == false || this.bcManager == false)) {
      return false;
    } else if (this.currentStatus == 9 && (this.businessOwner == false || this.bcManager == false)) {
      return false;
    } else {
      return false;
    }
  }

  isBtnEnable() {
    if ((this.currentStatus == 3 && this.actionItemOwner == true && this.businessOwner == true && this.actionPlan.IsMarkCompleted == 0) && this.bcManager == false && this.escalation == false) {
      return true;
    } else if ((this.currentStatus == 3 && this.actionItemOwner == true && this.actionPlan.IsMarkCompleted == 0) && this.businessOwner == false && this.bcManager == false && this.escalation == false) {
      return true;
    } else if ((this.currentStatus == 3 && this.actionItemOwner == true && this.actionPlan.IsMarkCompleted == 1) && this.businessOwner == false && this.bcManager == false && this.escalation == false) {
      return false;
    } else if (this.currentStatus == 2 || this.currentStatus == 4 || this.currentStatus == 5) {
      return false;
    } else if (this.currentStatus == 6 && this.businessOwner == true) {
      return true;
    } else if ((this.currentStatus == 6 || this.currentStatus == 7) && (this.businessOwner == false || this.bcManager == false)) {
      return true;
    } else if ((this.currentStatus == 7 && this.bcManager == true) || this.currentStatus == 7 && this.businessOwner == true) {
      return true;
    } else if (this.currentStatus == 8 && (this.businessOwner == true || this.bcManager == true)) {
      return true;
    } else if (this.currentStatus == 8 && this.escalation == true) {
      return true;
    } else if (this.currentStatus == 3 && this.escalation == true && this.actionPlan.IsEscalated == 1) {
      return false;
    } else {
      return false;
    }
  }

  openSubmitForReview() {
    let reviewData: any;
    if (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 1) {
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        dropdownLable: "Review Decision for",
        modalTitle: `Action Item - ${this.actionPlan?.IdentifiedActionItem} : Submit Response for Review`,
        modalBodyTitle: "Please submit the action item for review.",
        commentLabel: "Comment",
        buttonLabel: "Submit for Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.ActionItemID,
          NextWorkflowStatusID: 4,
          CurrentWorkflowStatusID: 3
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/submit-action-item-response",
        payload: {
          ActionItemID: this.parent.ActionItemID,
          BCMModuleID: this.parent.BCMModuleID,
          UserGUID: this.parent.ActionItemOwnerGUID,
          NextWorkflowStatusID: 4,
          CurrentWorkflowStatusID: 3,
          ReSubmit: this.reSubmit ? this.reSubmit : 0
        }
      }
    } else if ((this.currentStatus == 4 && this.businessOwner == true)) {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Approve", class: "greenRadio" }, { id: 2, value: "Return with comments", class: "redRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: `Submit Response for Review`,
        modalBodyTitle: "Please submit the action item responses for review. Once approved, the action item will be closed and the action items will become live.",
        commentLabel: "Comment",
        buttonLabel: "Submit for Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.ActionItemID,
          NextWorkflowStatusID: this.workflowStatusBC,
          CurrentWorkflowStatusID: this.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/review-action-item-response",
        payload: {
          ActionItemID: this.parent.ActionItemID,
          BCMModuleID: this.parent.BCMModuleID,
          NextWorkflowStatusID: this.workflowStatusBC,
          CurrentWorkflowStatusID: this.currentStatus
        }
      }
    } else if ((this.currentStatus == 5 && this.bcManager == true)) {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Approve", class: "greenRadio" }, { id: 2, value: "Return with comments", class: "redRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: `Submit Response for Review`,
        modalBodyTitle: "Please submit the action item responses for review. Once approved, the action item will be closed and the action items will become live.",
        commentLabel: "Comment",
        buttonLabel: "Submit Review",
        getCommentsURL: "/business-continuity-management/remediation-tracker/get-action-items-comments",
        commentsPayload: {
          ActionItemID: this.parent.ActionItemID,
          NextWorkflowStatusID: this.workflowStatusBC,
          CurrentWorkflowStatusID: this.currentStatus
        },
        submitReviewURL: "/business-continuity-management/remediation-tracker/review-action-item-response",
        payload: {
          ActionItemID: this.parent.ActionItemID,
          BCMModuleID: this.parent.BCMModuleID,
          NextWorkflowStatusID: this.workflowStatusBC,
          CurrentWorkflowStatusID: this.currentStatus
        }
      }
    }

    const dialog = this.dialog.open(SubmitReviewCommentsComponent, {
      maxWidth: '100vw',
      width: '85vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: {
        data: reviewData,
        currentStep: this.actionPlan?.CurrentWorkFlowStatusToDB
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess("Submitted Successfully");
      }
    });
  }

  downloadFile(fileData: any) {
    let data = {
      "FileContentID": Number(fileData.FileContentID),
      "ActionItemID": Number(fileData.ActionItemID),
      "AttachmentID": Number(fileData.AttachmentID)
    };
    this.service.downloadFile(data).subscribe({
      next: (res) => {
        if (res.success == 1) {
          const TYPED_ARRAY = new Uint8Array(res.result.DownloadActionItemAttachment[0].FileContent.data);
          const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ''));
          const fileMetaType = res.result.DownloadActionItemAttachment[0].AttachmentType;
          const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
          const blob = new Blob([blobData], { type: fileMetaType });
          saveAs(blob, res.result.DownloadActionItemAttachment[0].AttachmentName);
          this.saveSuccessPatch("File downloaded successfully..", 0);
        } else {
          if (res.error && res.error.errorCode === "TOKEN_EXPIRED") {
            this.utils.relogin(this._document);
          } else {
            this.saveerror = res.error.errorMessage;
          }
        }
      },
      error: (err) => {
        console.error("Error during file download:", err);
      }
    });
  }

  convertBase64ToBlobData(base64Data: any, contentType: string) {
    contentType = contentType || '';
    let sliceSize = 1024;
    let byteCharacters = window.atob(decodeURIComponent(base64Data));
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      let begin = sliceIndex * sliceSize;
      let end = Math.min(begin + sliceSize, bytesLength);

      let bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  deleteFile(fileData: any) {
    let data = {
      "FileContentID": Number(fileData.FileContentID),
      "ActionItemID": Number(fileData.ActionItemID),
      "AttachmentID": Number(fileData.AttachmentID)
    }
    let patchdata = {
      "updatedProgress": (this.actionItemForm.value.quantity).toString(),
      "updatedComment": this.actionItemForm.value.comment,
      "IsMarkedComplete": (this.actionItemForm.value.mark == false || this.actionItemForm.value.mark == undefined) ? 0 : 1
    }
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure you want to delete the attachment?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteFile(data).subscribe(res => {
          if (res.success == 1) {
            this.saveSuccessData("File deleted successfully..", patchdata);
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
          error:
          console.log("err::", "error");
        })
      }
    });
  }

  saveSuccessData(content: string, patchData: any): void {
    console.log('patchData: ', patchData);
    const timeout = 3000; // 3 Seconds
    const confirmDialog = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirmDialog.afterOpened().subscribe(() => {
      console.log("confirm");
      confirmDialog.close();

      setTimeout(() => {
        if (patchData !== 0) {
          // if (this.submitted === true) {
          //   // this.service.getRemediationListData();
          //   // this.dialogRef.close();
          //   this.patchValueData(patchData);
          // } else {
            this.service.getUpdateActionItemProgressInfo(this.parent.ActionItemID);
            this.service.actionprogSubj.subscribe((value) => {
              if (value) {
                this.uploadedFileData = this.service.actionprogObj.attachmentList;
                this.patchValueData(patchData);
              }})
          // }
        }
      }, timeout);
    });
  }


  update() {
    this.submitted = true;
    if ((this.currentStatus == 2 || this.currentStatus == 3) && this.actionPlan.IsMarkCompleted == 0) {
      if (this.actionItemForm.invalid)
        return;

      if (this.numErr == true)
        return;

      this.data = {
        "ActionItemID": this.parent.ActionItemID,
        "BCMModuleID": this.parent.BCMModuleID,
        "Progress": (this.actionItemForm.value.quantity).toString(),
        "Comment": this.actionItemForm.value.comment,
        "UserGUID": this.parent.ActionItemOwnerGUID,
        "IsMarkedComplete": (this.actionItemForm.value.mark == false || this.actionItemForm.value.mark == undefined) ? 0 : 1
      }

      this.service.updateProcessAction(this.data).subscribe(res => {
        if (res.success == 1) {
          this.saveSuccess("Action item updated successfully");
          this.service.processRemediationListData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
      })
    } else {
      this.openSubmitForReview()
    }
  }

  saveSuccess(content: string): void {
    const timeout = 2000; // 3 Seconds
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
        if ((this.currentStatus == 2 || this.currentStatus == 3) && this.actionPlan.IsMarkCompleted == 0) {
          this.service.getUpdateActionItemProgressInfo(this.parent.ActionItemID)
        } else if (this.currentStatus == 3 && this.actionPlan.IsMarkCompleted == 1) {
          this.dialog.closeAll();
          location.reload();
        } else {
          this.service.getUpdateActionItemProgressInfo(this.parent.ActionItemID)
        }
      }, timeout)
    });
  }

   close() {
    this.dialog.closeAll();
    this.service.getRemediationListData();
    this.ngOnDestroy()
  }

  ngOnDestroy() {
    this.service.actionprogSubj.next(false);
    this.actionPlanData = [];
    this.commentHistory = [];
    this.uploadedFileData = null
  }

  getDateFormat(date: any) {
    return dateToString(date, true, true, false, '-');
  }

  saveSuccessPatch(content: string, patchData: any): void {
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
        if (patchData != 0) {
          if (this.submitted == true) {
            this.service.getRemediationListData()
            this.dialogRef.close();
            this.patchValueData(patchData)
          } else {
            this.service.getUpdateActionItemProgressInfo(this.parent.ActionItemID)
            this.patchValueData(patchData)
          }
        }
      }, timeout)
    });
  }

  getItemName() {
    return this.actionPlan?.IdentifiedActionItem
  }

  stripSite(value: any, len: number) {
    return value ? stripHtml(value).substring(0, len) : '';
  }

  getColor(progress: any) {
    if (progress <= 25) {
      return 'color-class-1';
    } else if (progress <= 50) {
      return 'color-class-2';
    } else if (progress <= 75) {
      return 'color-class-3';
    } else {
      return 'color-class-4';
    }
  }

}
