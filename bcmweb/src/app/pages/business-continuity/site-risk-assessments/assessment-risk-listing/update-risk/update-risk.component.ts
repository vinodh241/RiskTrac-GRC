import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommentsPopupComponent } from 'src/app/core-shared/comments-popup/comments-popup.component';
import { FileUploadComponent } from 'src/app/core-shared/file-upload/file-upload.component';
import { addIndex, dateToYMd } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-update-risk',
  templateUrl: './update-risk.component.html',
  styleUrls: ['./update-risk.component.scss']
})
export class UpdateRiskComponent {
  // Drop-down position - Auto-update  -- delcarations
  @ViewChild('autoCompleteActionItemOwner', { read: MatAutocompleteTrigger })
  autoCompleteActionItemOwner!: MatAutocompleteTrigger;

  displayedColumnsCC = ['Index', 'Description'];
  displayedColumnsAP = ['Index', 'ActionItem', 'StartDate', 'TargetDate', 'Owner']
  selectedImpactIDs: any;
  controlData: any = "";
  blockEdit: boolean = false;
  submitted: boolean = false;
  controlExists: boolean = false;
  selectedStrategy: number = 0;
  defineActionItemForm!: FormGroup;
  reviewForm!: FormGroup;
  filteredActionOwner: any = "";
  isActionOwnerExists: boolean = false;
  actionItemMode: string = "";
  actionSubmitted: boolean = false;
  validateProperties: any[] = ["OverallInherentRiskRating", "OverallResidualRiskRating", "RiskTreatmentStrategyID"];
  saveerror: any = "";
  controlMode: string = "Add";
  reviewed: boolean = false;
  riskOnwerName: any = '';
  minStartDateError: boolean = false;
  minEndDateError: boolean = false;
  maxDate: any;
  endDateError: boolean = false;
  riskIndex: Number = 0;
  isActionExsist: boolean = false;
  actionItemPrompt: boolean = false;

  // File Upload- Declaraations
  fileUploadData: object = {}

  constructor(
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public service: AssessmentRiskListing,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    public dialogRef: MatDialogRef<UpdateRiskComponent>,
    private translate: TranslateService
  ) {
    this.service.currentThreatRiskID = this.parent.clickedRisk.ThreatRiskID;
    this.service.currentScheduleRiskID = this.parent.clickedRisk.ScheduleRiskAssessmentID;
    this.service.getRiskData(this.parent.clickedRisk.ScheduleRiskAssessmentID, this.service.currentThreatRiskID);
    this.initializeForm();
    this.initializeReviewForm();
  }

  ngOnInit(): void {
    this.service.gotMasterRiskInfoData.subscribe((value: any) => {
      if (value) {
        this.resetUpdateRisk();
        this.initializeReviewForm();
        if (!this.getFormDisability() && (this.displayedColumnsCC.indexOf('Action') == -1) && (this.displayedColumnsAP.indexOf('Action') == -1)) {
          this.displayedColumnsCC.push('Action');
          this.displayedColumnsAP.push('Action');
        }
        if ((this.service.selectedRiskData.IsReviewed == null && [1, 2].includes(this.service.selectedRiskData?.StatusID)) || this.service.selectedRiskData.IsReviewed == 1) {
          this.reviewForm.get('decission')?.disable();
          this.reviewForm.get('comment')?.disable();
        } else {
          this.reviewForm.enable();
        }
        this.riskIndex = this.parent.ThreatRiskIDList.indexOf(Number(this.service.selectedRiskData.ThreatRiskID)) + 1;
        this.actionItemMode = "Add";
        this.filteredActionOwner = this.service.riskMasterList.ActionItemOwnerList || [];
        this.selectedImpactIDs = (this.service.selectedRiskData.RiskImpact || []).map((threat: any) => threat.ImpactID);
        this.riskOnwerName = this.service.selectedRiskData.RiskOwnerName;
        this.patchReviewForm();

        // Upload Evidence
        this.fileUploadData = {
          buttonName  : ' Upload',
          apiURL      : '/business-continuity-management/site-risk-assessments/upload-risk-evidence'
        }
        this.fileUploadData = Object.assign(this.fileUploadData, this.service.riskMasterList?.AttachmentConfiguration[0])
      }
    })
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  //  Drop-down position - Auto-update
  scrollEvent = (event: any): void => {
    if (this.autoCompleteActionItemOwner) this.autoCompleteActionItemOwner.updatePosition();
  };

  getFormDisability() {
    // 1-New    2-Draft    3-Responded with Approved   4-Responded with Return with comments    5-Returned With Comment    6-Approved    7-Publish Risk
    let riskData = this.service.selectedRiskData;
    // console.log('riskData: ', riskData);
    if (riskData && riskData.IsReviewer == true) {
      return [1, 2, 3, 4, 5, 6, 7].includes(riskData?.StatusID);
    } else {
      return (riskData?.IsReviewed == null && [3, 4].includes(riskData?.StatusID)) || (riskData?.IsReviewed == true && [6, 7].includes(riskData?.StatusID) || riskData?.IsReviewed == 0  || riskData.IsBCManager == true || riskData.IsRiskOwner != true);
    }
  }

  getControlEffectiveness() {
    if (this.service.TableCC.data?.length == 0) {
      this.service.selectedRiskData.ControlEffectivenessID = null;
      return true;
    } else if (this.service.TableCC.data?.length == 1) {
      if (this.service.TableCC.data[0].isEdit) {
        return true
      }
      return false;
    }
    return false;
  }

  getDateFormat(date: any) {
    return dateToYMd(date)
  }

  previousRisk() {
    const index = this.parent.ThreatRiskIDList.indexOf(Number(this.service.selectedRiskData.ThreatRiskID));
    this.service.currentThreatRiskID = this.parent.ThreatRiskIDList[index - 1];
    this.service.currentScheduleRiskID = this.parent.allRiskData.find((x: any) => x.ThreatRiskID == this.service.currentThreatRiskID).ScheduleRiskAssessmentID;
    this.service.getRiskData(this.service.currentScheduleRiskID, this.service.currentThreatRiskID);
    this.resetUpdateRisk();
  }

  nextRisk() {
    const index = this.parent.ThreatRiskIDList.indexOf(Number(this.service.selectedRiskData.ThreatRiskID));
    this.service.currentThreatRiskID = this.parent.ThreatRiskIDList[index + 1];
    this.service.currentScheduleRiskID = this.parent.allRiskData.find((x: any) => x.ThreatRiskID == this.service.currentThreatRiskID).ScheduleRiskAssessmentID;
    this.service.getRiskData(this.service.currentScheduleRiskID, this.service.currentThreatRiskID);
    this.resetUpdateRisk();
  }

  storeImpact(impactId: any) {
    if ((this.selectedImpactIDs || []).includes(impactId)) {
      const index = this.selectedImpactIDs.indexOf(impactId);
      this.selectedImpactIDs.splice(index, 1);
    } else {
      this.selectedImpactIDs.push(impactId)
    }
  }

  isImpactChecked(impactId: any) {
    if (this.selectedImpactIDs)
      return this.selectedImpactIDs.includes(impactId);
  }

  onChange(e: any) {
    this.controlData = e.target.value;
    this.controlExists = this.service.TableCC.data.some((x: any) => (x.Description.trim().toLowerCase() === this.controlData.trim().toLowerCase()) && (!x.isEdit))
  }

  editControl(control: any) {
    this.blockEdit = true;
    control.isEdit = true;
    this.controlMode = "Edit"
    this.controlData = control.Description;
  }

  deleteControl(control: any) {
    const index = this.service.TableCC.data.findIndex(item => item.Index === control.Index);
    if (index !== -1) {
      this.service.TableCC.data.splice(index, 1);
    }
    this.service.TableCC.data = addIndex(this.service.TableCC.data, false);
    this.service.TableCC._updateChangeSubscription();
  }

  saveControl(control: any) {
    if (this.controlExists)
      return
    this.blockEdit = false;
    control.isEdit = false;
    this.service.TableCC.data = this.service.TableCC.data.map((x: any) =>
      x.Index === control.Index ? { ...x, Description: this.controlData } : x
    );
    this.controlData = "";
  }

  cancel(control: any) {
    this.blockEdit = false;
    this.service.TableCC.data.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit" || control.ThreatLibraryControlsID) {
      this.service.TableCC._updateChangeSubscription();
    } else {
      const index = this.service.TableCC.data.indexOf(control.index);
      this.service.TableCC.data.splice(index, 1);
      this.service.TableCC._updateChangeSubscription();
    }
  }

  checkControlSave(data: any) {
    return data.some((x: any) => x.isEdit);
  }

  addControl() {
    this.controlData = "";
    this.controlMode = "Add";
    this.blockEdit = true;
    this.service.TableCC.data.push({ "Index": this.service.TableCC.data.length + 1, "ThreatLibraryControlsID": null, "Description": "", "isEdit": true });
    this.service.TableCC._updateChangeSubscription();
    this.scrollDown('currentCCID');
  }

  checkCCLenght() {
    return this.service.TableCC && this.service.TableCC.data.length > 0
  }

  setTreatmentStrategy(id: any) {
    this.selectedStrategy = id;
  }

  editAction(action: any) {
    this.blockEdit = true;
    this.actionItemMode = "Update";
    if (this.defineActionItemForm) {
      setTimeout(() => {
        this.defineActionItemForm.patchValue({
          index: action.Index,
          actionItemText: action.actionItem,
          startDate: action.startDate,
          targetDate: action.targetDate,
          actionItemOwnerId: action.actionItemOwnerID,
          actionItemOwnerName: action.actionItemOwner
        });
      }, 1000);
    }
  }

  initializeForm() {
    this.defineActionItemForm = this.fb.group({
      index: [""],
      actionItemText: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      targetDate: ["", [Validators.required]],
      actionItemOwnerId: ["", [Validators.required]],
      actionItemOwnerName: ["", [Validators.required]]
    });
  }

  initializeReviewForm() {
    this.reviewForm = this.fb.group({
      decission: ["", [Validators.required]],
      comment: ["", [Validators.required]]
    })
  }

  patchReviewForm() {
    if([5, 6, 7].includes(this.service.selectedRiskData.StatusID)) {
      this.reviewForm.patchValue({
        decission: this.service.selectedRiskData.StatusID == 5 ? 0 : (this.service.selectedRiskData.StatusID == 6 || this.service.selectedRiskData.StatusID == 7) ? 1 : null,
        comment: this.service.selectedRiskData.ThreatReviewComments && this.service.selectedRiskData.ThreatReviewComments[0]?.CommentBody
      });
    } else {
      this.reviewForm.reset();
    }
  }

  get f() {
    return this.defineActionItemForm?.controls;
  }

  get f1() {
    return this.reviewForm?.controls;
  }

  bindRRDes(e: any) {
    this.service.selectedRiskData.ResidualRiskDescription = e.target.value;
  }

  filterActionOwnerList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineActionItemForm.controls['actionItemOwnerId'].setValue("");
    this.filteredActionOwner = this.service.riskMasterList.ActionItemOwnerList.filter((owner: any) => owner.AdminName.toLowerCase().includes(searchTerm));
    this.isActionOwnerExists = false;
  }

  setActionOwnerID(owner: any) {
    this.actionItemPrompt = true;
    this.submitted = false;
    this.defineActionItemForm.controls['actionItemOwnerId'].setValue(owner.AdminGUID);
  }

  setStartDate() {
    this.submitted = false;
    this.actionItemPrompt = true;
    let formActionValue = this.defineActionItemForm.value;
    let formStartDate = this.utils.formatTimeZone(formActionValue.startDate) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    if (formStartDate < formatedToday) {
      this.minStartDateError = true;
    } else {
      this.minStartDateError = false;
    }
    if (!!formActionValue.targetDate) {
      if (formActionValue.targetDate?.getTime() < formActionValue.startDate?.getTime())
        this.endDateError = true;
      else
        this.endDateError = false;
    }
  }

  setEndDate() {
    this.submitted = false;
    this.actionItemPrompt = true;
    let formActionValue = this.defineActionItemForm.value;
    let formEndDate = this.utils.formatTimeZone(formActionValue.targetDate) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    if (formEndDate < formatedToday) {
      this.minEndDateError = true;
    } else {
      this.minEndDateError = false;
    }
    if (formActionValue.targetDate?.getTime() < formActionValue.startDate?.getTime())
      this.endDateError = true;
    else
      this.endDateError = false;
  }

  checkActionExsist(e: any) {
    this.submitted = false;
    this.actionItemPrompt = true;
    if (this.actionItemMode == "Update")
      this.isActionExsist = this.service.TableAP.data.some((x: any) => x.actionItem.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.Index !== this.defineActionItemForm.value.index));
    else
      this.isActionExsist = this.service.TableAP.data.some((x: any) => x.actionItem.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  addActionItem() {
    this.actionSubmitted = true;
    if (this.defineActionItemForm.invalid || this.endDateError || this.isActionExsist || this.minStartDateError || this.minEndDateError)
      return
    this.blockEdit = false;
    this.actionItemPrompt = false;
    let formActionValue = this.defineActionItemForm.value;
    if (this.actionItemMode == "Update") {
      this.service.TableAP.data = this.service.TableAP.data.map((x: any) =>
        x.Index === formActionValue.index ? { ...x, "actionItem": formActionValue.actionItemText, "startDate": formActionValue.startDate, "targetDate": formActionValue.targetDate, "actionItemOwnerID": formActionValue.actionItemOwnerId, "actionItemOwner": formActionValue.actionItemOwnerName } : x
      );
      this.updateNReset();
    } else {
      this.service.TableAP.data.push({ "Index": this.service.TableAP.data.length + 1, "actionItem": formActionValue.actionItemText, "actionID": null, "startDate": formActionValue.startDate, "targetDate": formActionValue.targetDate, "actionItemOwnerID": formActionValue.actionItemOwnerId, "actionItemOwner": formActionValue.actionItemOwnerName });
      this.updateNReset();
    }
    this.service.TableAP._updateChangeSubscription();
    this.scrollDown('ActionPlanID');
  }

  deleteAction(action: any) {
    const index = this.service.TableAP.data.findIndex(item => item.Index === action.Index);
    if (index !== -1) {
      this.service.TableAP.data.splice(index, 1);
    }
    this.service.TableAP.data = addIndex(this.service.TableAP.data, false);
    this.service.TableAP._updateChangeSubscription();
  }

  getTooltipData() {
    return (this.service.TableCC && this.service.TableCC.data?.length == 0)? `Please add the "Current Controls" if any exist, to further assess and select the "Effectiveness of Current Controls."`:'';
  }

  // file upload Method- starts
  openFileUploadPopup() {
    const dialog = this.dialog.open(FileUploadComponent, {
      disableClose: true,
      maxWidth: '50vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        moduleName: 'SRA',
        config    : this.fileUploadData,
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }
  // file upload Method- ends

  onSubmit() {
    this.submitted = true;
    if(this.service.selectedRiskData?.OverallResidualRiskRatingID > this.service.selectedRiskData?.OverallInherentRiskRatingID)
      return;
    if (this.validateProperties.some((x: any) => !this.service.selectedRiskData[x]) || this.blockEdit || this.isActionExsist || (this.service.selectedRiskData.RiskTreatmentStrategyID == 1 && this.actionItemPrompt))
      return;
    if (this.service.TableCC && this.service.TableCC.data.length > 0 && !this.service.selectedRiskData?.ControlEffectivenessID)
      return;
    if (this.service.selectedRiskData.RiskTreatmentStrategyID == 1 ? (this.service.TableAP.data && this.service.TableAP.data.length == 0) : this.service.selectedRiskData.RiskTolerateExplanation.length == 0)
      return;

    this.service.saveRisk(this.service.selectedRiskData, this.service.TableAP.data, this.service.selectedRiskData.RiskTolerateExplanation, this.service.TableCC.data).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.resetUpdateRisk();
        this.saveSuccess(this.translate.instant('sra.addEdit.siteRiskUpdatedSuccessfully'));
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
      this.scrollUp('updateScrollTop');
    });
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: this.translate.instant('common.success'),
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
        this.service.getRiskData(this.service.currentScheduleRiskID, this.service.currentThreatRiskID);
      }, timeout)
    });
  }

  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  scrollUp(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = 0;
    }, 100);
  }

  formatedDate(date?:any){
    return this.service.dateToStringWithTimeStamp(date);
  }

  onBCMSubmit() {
    this.reviewed = true;

    if (this.reviewForm.invalid)
      return;

    let data = {
      siteId: this.service.selectedRiskData.SiteID,
      scheduledRiskAssessmentId: this.service.selectedRiskData.ScheduleRiskAssessmentID,
      siteRiskAssessmentId: this.service.selectedRiskData.SiteRiskAssessmentID,
      reviewStatus: this.reviewForm.value.decission,
      comments: this.reviewForm.value.comment
    }

    this.service.bcmReview(data).subscribe((res: any) => {
      if (res.success == 1) {
        this.saveSuccess(this.translate.instant('sra.addEdit.reviewResponseSavedSuccessfully'));
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
    this.scrollUp('updateScrollTop');
  }

  showComments(comments: any): void {
    const info = this.dialog.open(CommentsPopupComponent, {
      disableClose: true,
      minWidth: "35vw",
      maxWidth: "60vw",
      minHeight: "60vh",
      maxHeight: "70vh",
      panelClass: "commentdark",
      data: {
        title: this.translate.instant('sra.addEdit.previousComments'),
        commentData: comments.length > 0 ? comments : []
      }
    });
  }

  resetUpdateRisk() {
    this.submitted = false;
    this.saveerror = '';
    this.reviewed = false;
    this.reviewForm.reset();
    this.updateNReset();
    if ((this.displayedColumnsCC.indexOf('Action') !== -1) && (this.displayedColumnsAP.indexOf('Action') !== -1)) {
      this.displayedColumnsCC.pop();
      this.displayedColumnsAP.pop();
    }
  }

  resetForm() {
    this.updateNReset();
    this.dialogRef.close(true);
  }

  updateNReset() {
    this.blockEdit = false;
    this.actionItemPrompt = false;
    this.defineActionItemForm.reset();
    this.initializeForm();
    this.filteredActionOwner = this.service.riskMasterList && this.service.riskMasterList.ActionItemOwnerList || [];
    this.actionItemMode = "Add";
    this.actionSubmitted = false;
    this.endDateError = false;
    if (!this.getFormDisability && (this.displayedColumnsCC.indexOf('Action') !== -1) && (this.displayedColumnsAP.indexOf('Action') !== -1)) {
      this.displayedColumnsCC.pop();
      this.displayedColumnsAP.pop();
    }
  }
}
