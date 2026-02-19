import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-action-items',
  templateUrl: './new-action-items.component.html',
  styleUrls: ['./new-action-items.component.scss']
})

export class NewActionItemsComponent {

  // Drop-Down Position - Auto Update Delcarations
  @ViewChild('autoCompleteModuleInput', { read: MatAutocompleteTrigger })
  autoCompleteModuleInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSourceInput', { read: MatAutocompleteTrigger })
  autoCompleteSourceInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteRiskInput', { read: MatAutocompleteTrigger })
  autoCompleteRiskInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteActionInput', { read: MatAutocompleteTrigger })
  autoCompleteActionInput!: MatAutocompleteTrigger;
  addActionItemDetails!: FormGroup;
  minStartDate: any;
  maxEndDate: any;
  selectedStartDate: any;
  selectedEndDate: any;
  mindate: any
  date: any;
  filteredSiteList: any;
  actionItemModuleList: any
  actionItemFilteredList: any;
  actionItemSourceList: any;
  filterSourceData: any;
  actionItemSourceFilteredList: any;
  actionItemOwnerList: any;
  actionItemOwnerFiltered: any;
  filterGUID: any;
  filterSource: any;
  filterModule: any;
  rowData: any;
  moduleName: any;
  sourceName: any;
  criticalityList: any;
  budgetRequiredList: any;
  filterRiskData: any;
  filterRisk: any;
  scheduleRiskID: any;
  WorkflowButton: any;
  idModule: any;
  sourceID: any;
  currDate: any;
  currentDate: any;
  ckeConfig: any;
  disabledCkeConfig: any;
  isOwnerExists: boolean = false;
  endDateError: boolean = false;
  endDateErrorValid: boolean = false;
  startDateError: boolean = false
  intializeCKEditor: boolean = false;
  isRequired: boolean = false
  sourceError: boolean = false
  riskError: boolean = false
  riskDropDown: boolean = false
  dateError: boolean = false
  endDateError1: boolean = false
  submitted: boolean = false
  filteredActionItemOwner: any[] = [];
  actionItemOwnersBasedOnSource: any[] = [];
  currency: any;

  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public remediationService: RemediationTrackerService,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<NewActionItemsComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ckEditorService: CkEditorConfigService
  ) {
    this.remediationService.getRemediationInfoData()
    this.initialze();
    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.ckeConfig.height = '25vh';
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
    this.disabledCkeConfig.height = '25vh';
  }

  ngOnInit(): void {
    this.rowData = this.parent
    this.scheduleRiskID = this.rowData?.data.ScheduleRiskAssessmentID
    this.remediationService.gotremediationInfo.subscribe((value) => {
      if (value) {
        this.actionItemModuleList = this.remediationService.remediationInfoObj?.ActionItemModuleList || [];
        this.actionItemSourceList = this.remediationService.remediationInfoObj?.ActionItemSourceList || [];
        this.actionItemOwnerList = this.remediationService.remediationInfoObj?.ActionItemOwnerList || [];
        this.criticalityList = this.remediationService.remediationInfoObj?.CriticalityList || [];
        this.budgetRequiredList = this.remediationService.remediationInfoObj?.BudgetRequiredList || [];
        this.currency = (this.remediationService.remediationInfoObj?.CurrencyType.length > 0) ? this.remediationService.remediationInfoObj?.CurrencyType[0].Currency : '';
        if (this.parent?.mode == "edit") {
          this.setValidatorNDisable();
          this.initialze()
          this.patchValue(this.rowData?.data)
        }
      }
    });
    this.initialze();
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  // Drop-Down Position - Auto Update
  scrollEvent = (event: any): void => {
    if (this.autoCompleteModuleInput) this.autoCompleteModuleInput.updatePosition();
    if (this.autoCompleteSourceInput) this.autoCompleteSourceInput.updatePosition();
    if (this.autoCompleteRiskInput) this.autoCompleteRiskInput.updatePosition();
    if (this.autoCompleteActionInput) this.autoCompleteActionInput.updatePosition();
  };

  initialze() {
    this.addActionItemDetails = this.fb.group({
      actionPlan: ['', Validators.required],
      actionItems: ['', Validators.required],
      module: ['', Validators.required],
      moduleId: [''],
      source: ['', Validators.required],
      risk: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      actionOwner: ['', Validators.required],
      actionOwnerId: ['', Validators.required],
      budget: ['', Validators.required],
      criticality: ['', Validators.required],
      budgetCost: ['', Validators.min(0)]
    });
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 100);
  }

  patchValue(data: any) {
    let startDate = this.formatTimeZone(data.StartDate);
    let patchStartDate = startDate + "T00:00:00.000Z";

    let endDate = this.formatTimeZone(data.EndDate);
    let patchEndDate = endDate + "T00:00:00.000Z";

    if (data.IsBudgetRequired == 1) {
      this.isRequired = true
    }

    let siteBusinessOwner = data?.SiteBusinessOwner;
    this.actionItemOwnersBasedOnSource = this.actionItemOwnerList.filter((ele: any) => (ele.ActionItemOwnerGUID != siteBusinessOwner));
    this.filteredActionItemOwner = JSON.parse(JSON.stringify(this.actionItemOwnersBasedOnSource || []));

    setTimeout(() => {
      this.addActionItemDetails.patchValue({
        actionPlan: data.ActionItemDescription,
        actionItems: data.ActionItemName,
        module: data.ActionItemModule,
        source: data.SourceCode,
        risk: data.RiskTitle,
        startDate: patchStartDate,
        endDate: patchEndDate,
        actionOwner: data.ActionItemOwner,
        actionOwnerId: data.ActionItemOwnerGUID,
        budget: data.IsBudgetRequired,
        criticality: data.CriticalityID,
        budgetCost: data.BudgetedCost
      });
      this.cdr.detectChanges();
    }, 1000);
    this.setValidatorNDisable();
  }

  updateSelecedStartDate(event?: any) {
    this.selectedStartDate = new Date(event.value);
    this.minStartDate = this.selectedStartDate;
    let currentDate = this.formatTimeZone(new Date()); // Get today's date
    this.date = new Date(event.value);
    let formActionValue = this.addActionItemDetails.value;
    let onlyCurrentDate = this.formatTimeZone(formActionValue.startDate);
    let endDate = this.formatTimeZone(formActionValue.endDate);
    currentDate = currentDate + "T00:00:00.000Z";
    onlyCurrentDate = onlyCurrentDate + "T00:00:00.000Z";
    endDate = endDate + "T00:00:00.000Z";

    if (onlyCurrentDate < currentDate) {
      this.dateError = true;
      this.endDateError = false;
      this.startDateError = false;
    } else {
      this.dateError = false;
      this.endDateError = false;
    }

    if (onlyCurrentDate > endDate) {
      this.endDateError = true;
      this.startDateError = false;
    } else {
      this.endDateError = false;
    }

    if (onlyCurrentDate == endDate) {
      this.endDateErrorValid = true;
      this.startDateError = false;
    } else {
      this.endDateErrorValid = false;
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

  updateSelectedEndDate(event?: any) {
    let formActionValue = this.addActionItemDetails.value;
    let currentDate1 = this.formatTimeZone(formActionValue.startDate); // Get today's date
    let onlyCurrentDate1 = this.formatTimeZone(formActionValue.endDate);
    currentDate1 = currentDate1 + "T00:00:00.000Z";
    onlyCurrentDate1 = onlyCurrentDate1 + "T00:00:00.000Z";

    if (formActionValue.endDate && formActionValue.endDate instanceof Date) {
      if (onlyCurrentDate1 < currentDate1) {
        this.endDateErrorValid = false
        this.endDateError = true;
        this.startDateError = false
        this.scrollDown("ScrollID")
      } else if (onlyCurrentDate1 == currentDate1) {
        this.endDateError = false;
        this.endDateErrorValid = true;
        this.startDateError = false
        this.scrollDown("ScrollID")
      } else {
        this.endDateError = false
        this.startDateError = false
        this.endDateErrorValid = false
      }
    }
  }

  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    if (el)
      el.scrollTop = el.scrollHeight;
  }

  get f() {
    return this.addActionItemDetails.controls;
  }

  moduleListData(id: any) {
    const searchTerm = id.target?.value.toLowerCase();

    this.actionItemModuleList = this.remediationService.remediationInfoObj.ActionItemModuleList.filter((user: any) =>
      user.ActionItemModule.toLowerCase().includes(searchTerm)
    );
    this.addActionItemDetails.controls['moduleId'].setValue("");
  }

  moduleData(id: any, event: any) {
    if (event.isUserInput) {
      this.idModule = id
      this.addActionItemDetails.controls['moduleId'].setValue(id);

      this.filterSourceData = this.remediationService.remediationInfoObj?.ActionItemSourceList?.filter((ele: any) => id == ele.ActionItemModuleID)[0].Sources
      this.filterModule = this.actionItemModuleList.filter((ele: any) => ele.ActionItemModuleID == id)[0].ActionItemModuleID
      if (id == 5) {
        this.riskDropDown = true
      } else {
        this.riskDropDown = false
      }
      this.addActionItemDetails.controls['source']?.setValue("");
    }
  }

  sourceListData(id: any) {
    this.filterSourceData = this.actionItemSourceList?.filter((ele: any) => ele.ActionItemModuleID == this.rowData?.data?.BCMModuleID)[0]?.Sources
    this.filterSourceData = this.remediationService.remediationInfoObj?.ActionItemSourceList?.filter((ele: any) => this.idModule == ele.ActionItemModuleID)[0].Sources
    const searchTerm = id.target?.value.toLowerCase();
    this.filterSourceData = this.filterSourceData.filter((user: any) =>
      user.SourceCode.toLowerCase().includes(searchTerm)
    );
    this.addActionItemDetails.controls['SourceID']?.setValue("");
  }

  sourceData(data: any, event: any) {
    if (event.isUserInput) {
      this.sourceID = data
      this.filterRiskData = (this.filterSourceData.filter((user: any) => user.SourceID == data)[0].SourceDetails)
      this.filterSource = data

      if (this.filterModule == 8 || this.filterModule == 9) {//BCMS Testing & Inc
        let siteBOs = ((this.filterRiskData[0]?.SiteBusinessOwner) || '').split(', ');
        this.actionItemOwnersBasedOnSource = this.actionItemOwnerList.filter((ele: any) => !(siteBOs.includes(ele.ActionItemOwnerGUID)))
        this.filteredActionItemOwner = JSON.parse(JSON.stringify(this.actionItemOwnersBasedOnSource || []))
        this.addActionItemDetails.controls['actionOwnerId']?.setValue("");
        this.addActionItemDetails.controls['actionOwner']?.setValue("");
        this.filterGUID = '';
      }
      this.addActionItemDetails.controls['risk']?.setValue("");
    }
  }

  ownerListData(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredActionItemOwner = (this.actionItemOwnersBasedOnSource || []).filter((user: any) => user.ActionItemOwner.toLowerCase().includes(searchTerm));
    this.addActionItemDetails.controls['actionOwnerId']?.setValue("");
    this.filterGUID = '';
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '5vh',
      panelClass: 'success',
      data: {
        title: 'Success',
        content: content,
      },
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
        this.remediationService.getRemediationListData();
      }, timeout);
    });
  }

  ownerData(data: any, event: any) {
    if (event.isUserInput) {
      this.isOwnerExists = false;
      this.addActionItemDetails.controls['actionOwnerId'].setValue(data);
      this.filterGUID = data
    }
  }

  riskListData(id: any) {
    this.filterSourceData = this.actionItemSourceList?.filter((ele: any) => ele.ActionItemModuleID == this.rowData?.data?.BCMModuleID)[0]?.Sources
    this.filterRiskData = (this.filterSourceData.filter((user: any) => user.SourceID == this.sourceID)[0].SourceDetails)

    this.filterRiskData = (this.filterSourceData.filter((user: any) => user.SourceID == this.rowData?.data?.SourceID)[0]?.SourceDetails)
    const searchTerm = id.target?.value.toLowerCase();

    this.filterRiskData = this.filterRiskData.filter((user: any) =>
      user.RiskTitle?.toLowerCase().includes(searchTerm)
    );
  }

  riskData(data: any, event: any) {
    if (event.isUserInput) {
      this.filterRisk = data
      if (this.filterModule == 5) {
        let siteAdminHeads = ((this.filterRiskData[0]?.AdminHeadID) || '').split(', ');
        this.actionItemOwnersBasedOnSource = this.actionItemOwnerList.filter((ele: any) => !(siteAdminHeads.includes(ele.ActionItemOwnerGUID)))
        this.filteredActionItemOwner = JSON.parse(JSON.stringify(this.actionItemOwnersBasedOnSource || []));
        this.addActionItemDetails.controls['actionOwnerId']?.setValue("");
        this.addActionItemDetails.controls['actionOwner']?.setValue("");
        this.filterGUID = '';
      }
      this.riskError = false
    }
  }

  isSourceSelected() {
    return (this.filterModule == 5) ? Number(this.filterRisk) : (this.sourceID) ? Number(this.sourceID) : Number(this.rowData?.data.ActionItemSourceID);
  }

  riskErrorValid() {
    if ((this.addActionItemDetails.value?.risk == null || this.addActionItemDetails.value?.risk.length == 0 || this.addActionItemDetails.value?.risk.length == "") && this.submitted) {
      this.riskError = true
      return "Select Risk"
    } else {
      this.riskError = false
      return ""
    }
  }

  checkDerivedActionItemOwner() {
    if (this.addActionItemDetails.get('actionOwnerId')?.value.length == 0 && this.addActionItemDetails.get('actionOwner')?.value.length > 0) {
      this.isOwnerExists = true;
      return;
    }
    this.isOwnerExists = false;
  }

  updateRisk() {
    this.submitted = true
    this.checkDerivedActionItemOwner();
    if (this.filterSourceData?.length == 0) {
      this.sourceError = true
    } else {
      this.sourceError = true
    }

    if (this.addActionItemDetails.value?.actionPlan?.length == 0 || this.addActionItemDetails.value?.actionPlan == null) {
      return
    }

    if (this.dateError == true || this.endDateError == true || this.endDateErrorValid == true || this.startDateError == true) {
      this.submitted = false
      return
    }

    if (this.isRequired == true && (this.addActionItemDetails.value?.budgetCost == null || this.addActionItemDetails.value?.budgetCost.length <= 0)) {
      return
    }

    if (this.isOwnerExists || this.addActionItemDetails.get('actionOwnerId')?.value?.length == 0 || this.addActionItemDetails.get('actionOwner')?.value?.length == 0) {
      return;
    }

    if (this.parent?.mode != 'edit') {
      if (this.filterModule == 5 && (this.addActionItemDetails.value?.risk == null || this.addActionItemDetails.value?.risk.length == 0 || this.addActionItemDetails.value?.risk.length == "")) {
        this.riskError = true
        return
      }
      this.riskError = false
    }
    let startParentDate = this.formatTimeZone(this.rowData?.data.StartDate);
    let parentStartDate = startParentDate + "T00:00:00.000Z";

    let endParentDate = this.formatTimeZone(this.rowData?.data.EndDate);
    let parentEndDate = endParentDate + "T00:00:00.000Z";

    this.currDate = this.formatTimeZone(new Date())
    this.currentDate = this.currDate + "T00:00:00.000Z";

    let startDate = this.formatTimeZone(this.addActionItemDetails.value.startDate);
    let patchStartDate = startDate + "T00:00:00.000Z";

    let endDate = this.formatTimeZone(this.addActionItemDetails.value.endDate);
    let patchEndDate = endDate + "T00:00:00.000Z";

    let payload = {
      "ActionItemID": Number(this.rowData?.data.ActionItemID) ? Number(this.rowData?.data.ActionItemID) : null,
      "ActionItemName": this.rowData?.data.ActionItemName ? this.rowData?.data.ActionItemName : this.addActionItemDetails.value.actionItems,
      "ActionItemPlan": (this.addActionItemDetails.value.actionPlan),
      "ActionItemModuleID": this.filterModule ? this.filterModule : this.rowData?.data.BCMModuleID,
      "ActionItemSourceID": (this.filterModule == 5) ? Number(this.filterRisk) : (this.sourceID) ? Number(this.sourceID) : Number(this.rowData?.data.ActionItemSourceID),
      "StartDate": patchStartDate,
      "EndDate": patchEndDate,
      "ActionItemOwnerGUID": (this.filterGUID) ? (this.filterGUID) : (this.rowData?.data.ActionItemOwnerGUID),
      "IsBudgetRequired": this.addActionItemDetails.value.budget,
      "BudgetedCost": (this.addActionItemDetails.value.budgetCost)?.toString(),
      "CriticalityID": this.addActionItemDetails.value.criticality,
      "Mode": this.parent?.mode == 'edit' ? 'edit' : 'add'
    };

    if (this.addActionItemDetails.invalid && this.parent?.mode != 'edit') {
      return
    }
    if (this.parent?.mode != 'edit' || ((patchStartDate >= this.currentDate) && (patchEndDate > patchStartDate))) {

      this.remediationService.saveActionItem(payload).subscribe((res) => {
        if (res.success == 1) {
          this.isRequired = false
          this.saveSuccess(this.parent?.mode == 'edit' ? 'Action Plan updated successfully ' : 'Action Plan added successfully');
          this.dialogRef.close();
        } else {
          if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
            this.utils.relogin(this._document);
        }
        error: console.log('err::', 'error');
      });


    }
    if (this.parent?.mode == 'edit') {

      if (this.addActionItemDetails.get('endDate')?.touched && (patchEndDate <= this.currentDate && !this.addActionItemDetails.invalid)) {
        this.startDateError = true;
        this.submitted = false;
        this.scrollDown("ScrollID")
        return
      } else if (!this.addActionItemDetails.get('endDate')?.touched && (parentEndDate <= this.currentDate && !this.addActionItemDetails.invalid)) {
        this.startDateError = true;
        this.submitted = false;
      }
      else if (!this.addActionItemDetails.get('startDate')?.touched && (parentStartDate < this.currentDate && !this.addActionItemDetails.invalid)) {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
          id: 'ConfirmDialogComponent',
          disableClose: true,
          minWidth: '300px',
          panelClass: 'dark',
          data: {
            title: 'Confirmation',
            content:
              'Start Date is less than today’s date. Do you want to proceed?',
          },
        });
        confirm.afterClosed().subscribe((result) => {
          if (result) {
            this.remediationService.saveActionItem(payload).subscribe((res) => {
              if (res.success == 1) {
                this.isRequired = false
                this.saveSuccess(this.parent?.mode == 'edit' ? 'Action Plan updated successfully ' : 'Action Plan added successfully');
                this.dialogRef.close();
              } else {
                if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
                  this.utils.relogin(this._document);
              }
              error: console.log('err::', 'error');
            });
          }
        })

      } else if (this.addActionItemDetails.get('startDate')?.touched && (patchStartDate < this.currentDate && !this.addActionItemDetails.invalid)) {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
          id: 'ConfirmDialogComponent',
          disableClose: true,
          minWidth: '300px',
          panelClass: 'dark',
          data: {
            title: 'Confirmation',
            content:
              'Start Date is less than today’s date. Do you want to proceed?',
          },
        });
        confirm.afterClosed().subscribe((result) => {
          if (result) {
            this.remediationService.saveActionItem(payload).subscribe((res) => {
              if (res.success == 1) {
                this.isRequired = false
                this.saveSuccess(this.parent?.mode == 'edit' ? 'Action Plan updated successfully ' : 'Action Plan added successfully');
                this.dialogRef.close();
              } else {
                if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
                  this.utils.relogin(this._document);
              }
              error: console.log('err::', 'error');
            });
          }
        })

      } else {
        this.startDateError = false;
      }
      if (this.startDateError == true) {
        return
      }

      if (this.addActionItemDetails.invalid) {
        return
      }
    }
  }

  setValidatorNDisable() {
    this.addActionItemDetails.get('module')!.disable();
    this.addActionItemDetails.get('source')!.disable();
    this.addActionItemDetails.get('risk')!.disable();
    this.addActionItemDetails.get('actionItems')!.disable();
  }

  budgetReq(id: any) {
    if (id == 0) {
      this.isRequired = false
    } else if (id == 1) {
      this.isRequired = true
    }
  }

  getErrorMessage() {
    const sourceNameErrors = this.addActionItemDetails.get('source')?.errors;
    const sourceNameTouched = this.addActionItemDetails.get('source')?.touched;

    if (this.submitted && this.filterSourceData?.length === 0) {
      return 'No Source available for selected Module.';
    } else if (
      ((this.submitted || sourceNameTouched) && sourceNameErrors) || (this.submitted && this.filterSourceData?.length && this.addActionItemDetails.get('source')?.value == '')) {
      return 'Select Source';
    } else {
      return null;
    }
  }

}
