import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-action-item',
  templateUrl: './update-action-item.component.html',
  styleUrls: ['./update-action-item.component.scss']
})

export class UpdateActionItemComponent {

  @ViewChild('matAutocompleteAIOwner', { read: MatAutocompleteTrigger })
  matAutocompleteAIOwner!: MatAutocompleteTrigger;
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
  endDateError: boolean = false;
  endDateErrorValid: boolean = false;
  startDateError: boolean = false;
  dateError: boolean = false;
  endDateError1: boolean = false;
  submitted: boolean = false;
  currency = environment.currency;

  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public remediationService: RemediationTrackerService,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<UpdateActionItemComponent>,
    private fb: FormBuilder
  ) {
    this.remediationService.getUpdateActionItemInfo()
    this.initialze();
  }

  ngOnInit(): void {
    this.rowData = this.parent
    this.remediationService.actionUpdateInfoSubj.subscribe((value) => {
      if (value) {
        this.actionItemOwnerList = this.remediationService.actionUpdateInfoObj.ActionItemOwnerList;
        this.moduleName = this.remediationService.actionUpdateInfoObj.DetailsActionItemsList[0].ActionItemModule;
        this.sourceName = this.remediationService.actionUpdateInfoObj.DetailsActionItemsList[0].ActionItemSource;
        this.criticalityList = this.remediationService.actionUpdateInfoObj.CriticalityList;
        this.budgetRequiredList = this.remediationService.actionUpdateInfoObj.BudgetRequiredList;
      }
    });
    this.initialze();
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  // Drop-Down Position - Auto Update
  scrollEvent = (event: any): void => {
    if (this.matAutocompleteAIOwner) this.matAutocompleteAIOwner.updatePosition();
  }

  initialze() {
    this.addActionItemDetails = this.fb.group({
      actionItems: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      actionOwner: [''],
      budget: [''],
      criticality: [''],
      budgetCost: ['']
    });
  }

  updateSelecedStartDate(event?: any) {
    this.selectedStartDate = new Date(event.value);
    this.minStartDate = this.selectedStartDate;
    let currentDate = this.formatTimeZone(new Date()); // Get today's date
    this.date = new Date(event.value);
    let formActionValue = this.addActionItemDetails.value;
    let onlyCurrentDate = this.formatTimeZone(formActionValue.startDate);
    currentDate = currentDate + "T00:00:00.000Z";
    onlyCurrentDate = onlyCurrentDate + "T00:00:00.000Z";

    if (onlyCurrentDate < currentDate) {
      this.dateError = true;
    } else {
      this.dateError = false;
    }
    if (formActionValue.endDate && formActionValue.endDate instanceof Date) {
      if (formActionValue.endDate.getTime() < formActionValue.startDate.getTime()) {
        this.endDateError = true;
        this.scrollDown("ScrollID");
      } else {
        this.endDateError = false;
      }
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

    if (onlyCurrentDate1 < currentDate1) {
      this.endDateError1 = true;
    } else {
      this.endDateError1 = false;
    }
    if (formActionValue.endDate && formActionValue.endDate instanceof Date) {
      if (formActionValue.endDate.getTime() < formActionValue.startDate.getTime()) {

        this.endDateError = true;
        this.scrollDown("ScrollID")
      } else if (formActionValue.endDate.getTime() == formActionValue.startDate.getTime()) {
        this.endDateError = false;
        this.endDateErrorValid = true;
        this.scrollDown("ScrollID")
      } else {
        this.endDateError = false
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

    this.actionItemFilteredList = this.actionItemModuleList.filter((user: any) =>
      user.ActionItemModule.toLowerCase().includes(searchTerm)
    );
  }

  moduleData(id: any) {
    this.filterSourceData = this.actionItemSourceList.filter((ele: any) => id == ele.ActionItemModuleID)[0].Sources
    this.filterModule = this.actionItemModuleList.filter((ele: any) => ele.ActionItemModuleID == id)[0].ActionItemModuleID
  }

  sourceListData(id: any) {
    const searchTerm = id.target?.value.toLowerCase();
    this.filterSourceData = this.filterSourceData.filter((user: any) =>
      user.ActionItemSource.toLowerCase().includes(searchTerm)
    );
  }

  ownerListData(id: any) {
    const searchTerm = id.target?.value.toLowerCase();

    this.actionItemOwnerFiltered = this.actionItemOwnerList.filter((user: any) =>
      user.ActionItemOwner.toLowerCase().includes(searchTerm)
    );
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
        this.remediationService.getRemediationInfoData();
      }, timeout);
    });
  }

  ownerData(data: any) {
    this.filterGUID = this.actionItemOwnerList.filter((user: any) => user.ActionItemOwner == data)[0].ActionItemOwnerGUID
  }

  sourceData(data: any) {
    this.filterSource = this.filterSourceData.filter((user: any) => user.ActionItemSource == data)[0].ActionItemSourceID
  }

  updateRisk() {
    let payload = {
      "ActionItemID": this.rowData.ActionItemID,
      "ActionItemName": this.addActionItemDetails.value.actionItems,
      "ActionItemModuleID": this.rowData.ActionItemModule,
      "ActionItemSourceID": this.rowData.ActionItemSource,
      "StartDate": this.formatTimeZone(this.addActionItemDetails.value.startDate),
      "newTargetDate": this.formatTimeZone(this.addActionItemDetails.value.endDate),
      "ActionItemOwnerGUID": this.filterGUID,
      "isBudgetRequired": this.addActionItemDetails.value.budget,
      "budgetedAmount": this.addActionItemDetails.value.budgetCost,
      "criticalityId": this.addActionItemDetails.value.criticality,
    };
  }

}
