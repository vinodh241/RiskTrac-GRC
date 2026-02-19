import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, dateToYMd, formatTimeType } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { IncidentReportService } from 'src/app/services/incident-report/incident-report.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UpdateActionItemListComponent } from './update-action-item-list/update-action-item-list.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { FileUploadComponent } from 'src/app/core-shared/file-upload/file-upload.component';

@Component({
  selector: 'app-report-new-incident',
  templateUrl: './report-new-incident.component.html',
  styleUrls: ['./report-new-incident.component.scss']
})
export class ReportNewIncidentComponent implements OnInit {
  // Dropdown Position - Auto update.
  @ViewChild('autoCompleteActionInput', { read: MatAutocompleteTrigger })
  autoCompleteActionInput!: MatAutocompleteTrigger;

  displayedColumnsAT: any[] = ['Index', 'Action', 'DateTime', 'Actions'];
  displayedColumnsAP: any[] = ['Index', 'ActionItem', 'StartDate', 'TargetDate', 'Owner', 'Actions'];

  saveerror: string = '';        // To store and show API/DB Errors

  mode: any = '';                // Popup mode New/Update
  incidentData: any = {};
  isIncidentSaved: boolean = false;

  submitted: boolean = false;
  submittedAT: boolean = false;
  defineIncidentForm!: FormGroup;

  endIncDateError: boolean = false;
  minStartDateError: boolean = false;
  minEndDateError: boolean = false;
  isIncidentTitleExists: boolean = false;
  filteredNatureList: any[] = [];
  isIncidentNatureExists: boolean = false;
  IncidentNatureIds: any[] = [];
  filteredLocationList: any[] = [];
  isIncidentLocationExists: boolean = false;
  IncidentLocationIds: any[] = [];
  isLocationData:boolean = false

  // Action Taken -- declarations
  actionTakenMode: string = 'Add';
  blockActionTaken: boolean = false;
  actionTakenExists: boolean = false;
  minStartDateAPError: boolean = false;
  minEndDateAPError: boolean = false;

  // Action Plan -- declarations
  blockAPEdit: boolean = false;
  submittedAP: boolean = false;
  endDateError: boolean = false;
  filteredActionOwner: any[] = [];
  siteAdminExistsAT: boolean = false;
  sourceActionOwner: any[] = [];
  actionItemMode: string = 'Add';
  isActionExsist: boolean = false;
  isActionOwnerExists: boolean = false;
  actionItemPrompt: boolean = false;
  maxAPDate: any;

  // Review Comments -- declarations
  reviewCommentsHistory: any[] = [];

  // Time Picker -- declarations
  endIncTimeError: boolean = false;

  // changes Saved or not -- declarations
  mainData: any = {};

  loginUserGUID: any = '';

  // ckeditor config -- declarations
  ckeConfig: any;
  disabledCkeConfig: any;
  intializeCKEditor: boolean = false;

  // Upload -- Declarations
  fileUploadData: object = {}

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private rest: RestService,
    public utils: UtilsService,
    public service: IncidentReportService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    private ckEditorService: CkEditorConfigService,
    public dialogRef: MatDialogRef<ReportNewIncidentComponent>
  ) {
    this.rest.openWait("Fetching Data ...");
    this.initializeIncidentForm();
    this.updateNReset();
  }

  ngOnInit(): void {
    this.loginUserGUID = localStorage.getItem('userguid');
    this.setTargetMaxDate();
    this.mode = this.parent.incidentMode;

    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));

    if (this.mode == "Add") {
      this.service.getIncidentCreateInfo();
    }
    else {
      this.incidentData = this.parent.selectedIncident
      this.service.getIncidentReportData(this.incidentData);
    }
    this.service.gotMasterIncidentReportDataNInfo$.subscribe((value: boolean) => {
      if (value) {
        this.filteredNatureList = this.service.incidentInfoData.IncidentNatureList || [];
        this.filteredLocationList = this.service.incidentInfoData.IncidentSiteLocations || [];
        this.sourceActionOwner = this.service.incidentInfoData.ActionItemOwnerList || [];
        if (this.mode == 'Edit') {
          this.isIncidentSaved = true;
          this.patchIncidentData();
          this.reviewCommentsHistory = this.service.incidentReportData.IncidentReviewComments || [];
        } else {
          this.defineIncidentForm.patchValue({
            incidentStatus: this.service.incidentInfoData.IncidentStatusList[0].IncidentStatus,
            incidentStatusId: this.service.incidentInfoData.IncidentStatusList[0].IncidentStatusID
          })
          this.service.TableAT = new MatTableDataSource();
          this.service.TableAP = new MatTableDataSource();
        }
        this.defineIncidentForm.get('incidentCode')!.disable();
        this.defineIncidentForm.get('incidentStatus')!.disable();
        this.rest.closeWait();
        this.service.gotMasterIncidentReportDataNInfo$.next(false);
        this.fileUploadData = {
          buttonName  : ' Upload',
          apiURL      : '/business-continuity-management/incident-reports/upload-incident-evidence'
        }
        this.fileUploadData = Object.assign(this.fileUploadData, this.service.incidentInfoData?.AttachmentConfiguration[0]);
      }
    });
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  // Dropdown Position - Auto update.
  scrollEvent = (event: any): void => {
    if (this.autoCompleteActionInput) this.autoCompleteActionInput.updatePosition();
  };

  // initialize Incident Form
  initializeIncidentForm(): void {
    this.defineIncidentForm = this.fb.group({
      incidentCode: ["", [Validators.required]],
      incidentStatus: ["", [Validators.required]],
      incidentStatusId: ["", [Validators.required]],
      incidentStartDate: ["", [Validators.required]],
      incidentStateTime: ["", [Validators.required]],
      incidentEndDate: ["", [Validators.required]],
      incidentEndTime: ["", [Validators.required]],
      incidentTitle: ["", [Validators.required]],
      incidentNatureId: ["", [Validators.required]],
      classification: ["", [Validators.required]],
      incidentLocationId: ["", [Validators.required]],
      description: ["", [Validators.required]],
      postIncidentEvaCon: ["", [Validators.required]],
      actionTaken: [""],
      actionPlan: this.fb.group({
        index: [""],
        actionItemText: [""],
        startDate: [""],
        targetDate: [""],
        actionItemOwnerId: [""],
        actionItemOwnerName: [""]
      })
    });
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 100);
  }

  get f() {
    return this.defineIncidentForm?.controls;
  }

  get f1() {
    return (this.defineIncidentForm?.get('actionPlan') as FormGroup)?.controls;
  }

  // Patch form with data
  patchIncidentData(): void {
    let selectedIncident = this.service.incidentReportData;
    this.service.TableAT = new MatTableDataSource((!!this.service.incidentReportData.ActionsTaken && this.service.incidentReportData.ActionsTaken?.length > 0) ? addIndex(this.service.incidentReportData.ActionsTaken, false) : []);
    this.service.TableAP = new MatTableDataSource((!!this.service.incidentReportData.ActionPlan && this.service.incidentReportData.ActionPlan?.length > 0) ? addIndex(this.service.incidentReportData.ActionPlan, false) : []);
    this.service.TableAT._updateChangeSubscription();
    this.service.TableAP._updateChangeSubscription();
    this.defineIncidentForm.patchValue({
      incidentCode: selectedIncident.IncidentCode,
      incidentStatus: selectedIncident.ActualStatus,
      incidentStatusId: selectedIncident.ActualStatusID,
      incidentStartDate: this.utils.formatTimeZone(selectedIncident.IncidentStartDateTime),
      incidentStateTime: formatTimeType(selectedIncident.IncidentStartDateTime),
      incidentEndDate: this.utils.formatTimeZone(selectedIncident.IncidentEndDateTime),
      incidentEndTime: formatTimeType(selectedIncident.IncidentEndDateTime),
      incidentTitle: selectedIncident.IncidentTitle,
      incidentNatureId: ((selectedIncident.IncidentNatureID).split(',').map((x: any) => Number(x))),
      classification: selectedIncident.ClassificationID,
      incidentLocationId: ((selectedIncident.IncidentLocationID).split(',')),
      description: selectedIncident.IncidentDescription,
      postIncidentEvaCon: selectedIncident.PostIncidentEvaluationConclusion,
    });
    this.storeDataNCheck();
    this.setActionItemOnwers();

    this.getViewAccess(this.parent.selectedIncident);
  }

  // Methods for Forms -- start
  getViewAccess(rowData: any) {
    if((this.service.isBCManager || (rowData.ReporterGUID != localStorage.getItem('userguid')) && [1].includes(rowData.ActualStatusID)) || [2, 3].includes(rowData.ActualStatusID)) {
      this.defineIncidentForm.disable();
      this.displayedColumnsAT.pop();
      this.displayedColumnsAP.pop();
    }
  }

  checkIncidentExist(e: any) {
    if (this.mode != 'Add')
      this.isIncidentTitleExists = (this.parent.allIncidents || []).some((x: any) => (x.IncidentTitle || '').toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.IncidentID !== this.incidentData.IncidentID));
    else
      this.isIncidentTitleExists = (this.parent.allIncidents || []).some((x: any) => (x.IncidentTitle || '').toLowerCase().trim() == (e.target.value).toLowerCase().trim());

    if (e.target.value == '')
      this.isIncidentTitleExists = false
  }

  getList(from: any) {
   let tooltip = ''
   switch (from) {
    case '1':
      tooltip = this.service.incidentInfoData?.IncidentNatureList.filter((i: any) => (this.defineIncidentForm.get('incidentNatureId')?.value || []).includes((i.IncidentNatureID.toString()))).map((x: any) => x.IncidentNature).join(', ');
      break;
    case '2':
      tooltip = this.service.incidentInfoData?.IncidentSiteLocations.filter((i: any) => (this.defineIncidentForm.get('incidentLocationId')?.value || []).includes((i.IncidentLocationID.toString()))).map((x: any) => x.IncidentLocation).join(', ');
      break;
    default:
      tooltip = '';
      break;
   }
   if (tooltip?.length > (from == '1' ? 40: 100)) return tooltip;
   else return ''
  }
    // -------------------------------------------------------------------------------------------------------
  // Set Incident date and time -- start
  setStartIncDate() {
    this.endIncDateError = false;
    let formIncidentValue = this.defineIncidentForm.value;
    let startDate = this.utils.formatTimeZone(new Date(formIncidentValue.incidentStartDate)) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    // if (startDate < formatedToday) {
    //   this.minStartDateError = true;
    // } else {
    //   this.minStartDateError = false;
    // }
    if (new Date(formIncidentValue.incidentEndDate)?.getTime() < new Date(formIncidentValue.incidentStartDate)?.getTime())
      this.endIncDateError = true;
    else
      this.endIncDateError = false;
    this.checkStartIncTimeValidation();
  }

  setEndIncDate() {
    this.endIncDateError = false;
    let formIncidentValue = this.defineIncidentForm.value;
    let endDate = this.utils.formatTimeZone(new Date(this.defineIncidentForm.value.incidentEndDate)) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    // if (endDate < formatedToday) {
    //   this.minEndDateError = true;
    // } else {
    //   this.minEndDateError = false;
    // }
    if (new Date(formIncidentValue.incidentEndDate)?.getTime() < new Date(formIncidentValue.incidentStartDate)?.getTime())
      this.endIncDateError = true;
    else
      this.endIncDateError = false;
    this.checkEndIncTimeValidation();
  }

  checkStartIncTimeValidation() {
    const startDate = new Date(this.defineIncidentForm.value.incidentStartDate);
    const endDate = new Date(this.defineIncidentForm.value.incidentEndDate);
    const startTime = this.defineIncidentForm.get('incidentStateTime')!.value;
    const endTime = this.defineIncidentForm.get('incidentEndTime')!.value;

    if (startDate && endDate && (startDate.getTime() === endDate.getTime()) && startTime && endTime && startTime >= endTime)
      this.endIncTimeError = true;
    else
      this.endIncTimeError = false
  }

  checkEndIncTimeValidation() {
    const startDate = new Date(this.defineIncidentForm.value.incidentStartDate);
    const endDate = new Date(this.defineIncidentForm.value.incidentEndDate);
    const startTime = this.defineIncidentForm.get('incidentStateTime')!.value;
    const endTime = this.defineIncidentForm.get('incidentEndTime')!.value;

    if (startDate && endDate && (startDate.getTime() === endDate.getTime()) && startTime && endTime && endTime <= startTime)
      this.endIncTimeError = true;
    else
      this.endIncTimeError = false
  }
  // Set Incident date and time -- end
    // -------------------------------------------------------------------------------------------------------
  // Action Taken Methods -- start

  deleteActionTaken(action: any) {
    const index = this.service.TableAT.data.findIndex(item => item.Index === action.Index);
    if (index !== -1) {
      this.service.TableAT.data.splice(index, 1);
    }
    this.service.TableAT.data = addIndex(this.service.TableAT.data, false);
    this.service.TableAT._updateChangeSubscription();
  }

  onActionChange(e: any) {
    if (e.target.value == '')
      this.actionTakenExists = false;
    else
      this.actionTakenExists = this.service.TableAT.data.some((x: any) => (x.Action.trim().toLowerCase() === e.target.value.trim().toLowerCase()) && (!x.isEdit))
  }

  saveActionTaken(action: any) {
    if (this.actionTakenExists || this.defineIncidentForm.get('actionTaken')?.value == '')
      return
    action.IsEdit = false;
    this.submittedAT = false;
    this.blockActionTaken = false;
    this.service.TableAT.data = (this.service.TableAT.data || []).map((x: any) =>
      x.Index === action.Index ? { ...x, Action: this.defineIncidentForm.get('actionTaken')?.value, ActionDateTime: this.service.getTakenDateFormat((new Date())), ActionDateTimeBackEnd: new Date() } : x
    );
    this.defineIncidentForm.get('actionTaken')?.reset();
  }

  cancelActionTaken(action: any) {
    this.blockActionTaken = false;
    this.actionTakenExists = false;
    this.submittedAT = false;
    this.service.TableAT.data.forEach((x: any) => {
      x.IsEdit = false;
    });
    if (this.actionTakenMode == "Edit" || action.ActionID) {
      this.service.TableAT._updateChangeSubscription();
    } else {
      const index = this.service.TableAT.data.indexOf(action.Index);
      this.service.TableAT.data.splice(index, 1);
      this.service.TableAT._updateChangeSubscription();
    }
  }

  checkActionTakenSave(tableATData: any) {
    return tableATData.some((x: any) => x.IsEdit);
  }

  addActionTaken() {
    this.defineIncidentForm.get('actionTaken')?.reset();
    this.actionTakenMode = "Add";
    this.blockActionTaken = true;
    this.submittedAT = false;
    this.service.TableAT.data.push({ "Index": this.service.TableAT.data.length + 1, "ActionID": null, "Action": "", "ActionDateTime": "", "ActionDateTimeBackEnd": "", "IsEdit": true });
    this.service.TableAT._updateChangeSubscription();
    this.scrollDown('actionTakenID');
  }
  // Action Taken Methods -- end
    // ----------------------------------------------------------------------------------------------------
  // Action Plan Methods -- start
  getDateFormat(date: any) {
    return dateToYMd(date)
  }

  editAction(action: any) {
    this.submittedAP = false;
    this.blockAPEdit = true;
    this.actionItemMode = "Update";
    if (this.defineIncidentForm.get('actionPlan')) {
      setTimeout(() => {
        this.defineIncidentForm.patchValue({
          actionPlan: {
            index: action.Index,
            actionItemText: action.ActionItem,
            startDate: action.StartDate,
            targetDate: action.TargetDate,
            actionItemOwnerId: action.ActionItemOwnerGUID,
            actionItemOwnerName: action.ActionItemOwner
          }
        });
      }, 500);
    }
  };

  deleteAction(action: any) {
    const index = this.service.TableAP.data.findIndex(item => item.Index === action.Index);
    if (index !== -1) {
      this.service.TableAP.data.splice(index, 1);
    }
    this.service.TableAP.data = addIndex(this.service.TableAP.data, false);
    this.service.TableAP._updateChangeSubscription();
    this.checkActionItemOwnersUpdated();
  };

  checkActionExsist(e: any) {
    this.submittedAP = false;
    this.actionItemPrompt = true;
    if (this.actionItemMode == "Update")
      this.isActionExsist = this.service.TableAP.data.some((x: any) => x.ActionItem.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.Index !== this.defineIncidentForm.controls['actionPlan'].value.index));
    else
      this.isActionExsist = this.service.TableAP.data.some((x: any) => x.ActionItem.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  setStartDate() {
    this.submittedAP = false;
    this.actionItemPrompt = true;
    let formActionValue = this.defineIncidentForm.controls['actionPlan'].value;

    // Validation check for max
    const newDate = new Date(formActionValue.startDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    newDate.setDate(newDate.getDate() - 1);

    this.maxAPDate = new Date(newDate);
    if (!!formActionValue.targetDate && (new Date(formActionValue.targetDate)?.getTime() > this.maxAPDate?.getTime()))
      this.defineIncidentForm.get('actionPlan.targetDate')!.setValue(this.maxAPDate);

    // Validation check for min
    let formStartDate = this.utils.formatTimeZone(formActionValue.startDate) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    if (formStartDate < formatedToday) {
      this.minStartDateAPError = true;
    } else {
      this.minStartDateAPError = false;
    }

    // Validation check for target date should be greater than start date
    if (!!formActionValue.targetDate) {
      if (new Date(formActionValue.targetDate)?.getTime() < new Date(formActionValue.startDate)?.getTime())
        this.endDateError = true;
      else
        this.endDateError = false;
    }
  }

  setEndDate() {
    this.submittedAP = false;
    this.actionItemPrompt = true;
    let formActionValue = this.defineIncidentForm.controls['actionPlan'].value;

    // Validation check for min
    let formEndDate = this.utils.formatTimeZone(formActionValue.targetDate) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    if (formEndDate < formatedToday) {
      this.minEndDateAPError = true;
    } else {
      this.minEndDateAPError = false;
    }
    if (new Date(formActionValue.targetDate)?.getTime() < new Date(formActionValue.startDate)?.getTime())
      this.endDateError = true;
    else
      this.endDateError = false;
  }

  setTargetMaxDate() {
    const newDate = new Date();
    newDate.setFullYear(newDate.getFullYear() + 1);
    newDate.setDate(newDate.getDate() - 1);
    this.maxAPDate = new Date(newDate); // max date for Target date inaction plan
  }

  filterActionOwnerList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineIncidentForm?.get('actionPlan')?.get('actionItemOwnerId')?.setValue('');
    this.filteredActionOwner = (this.sourceActionOwner || []).filter((owner: any) => owner.ActionItemOwnerName.toLowerCase().includes(searchTerm));
    this.isActionOwnerExists = false;
  }

  setActionItemOnwers() {
    const incidentLocations = (this.defineIncidentForm?.get('incidentLocationId')?.value).map((x: any) => +x);
    if (incidentLocations.length > 0) {
      const filteredSiteAdminListGUIDs = this.service.incidentInfoData.SiteAdminUsersList.filter((admin: any) => incidentLocations.includes(+admin.SiteID)).map((x: any) => x.SAUserGUID);
      this.filteredActionOwner = this.service.incidentInfoData.ActionItemOwnerList.filter((x: any) => !filteredSiteAdminListGUIDs.includes(x.ActionItemOwnerGUID));
      this.sourceActionOwner = JSON.parse(JSON.stringify(this.filteredActionOwner))
    } else {
      this.filteredActionOwner = [];
      this.sourceActionOwner = [];
    }

    // checking Site Admin Exists in Action Item List::
    this.siteAdminExistsAT = false
    const allActionItemOnwers = this.filteredActionOwner.map((x: any) => x.ActionItemOwnerGUID);
    this.siteAdminExistsAT = this.service.TableAP.data.filter((action: any) => !allActionItemOnwers.includes(action.ActionItemOwnerGUID))?.length > 0;
    if (this.siteAdminExistsAT)
      this.scrollIntoView('ActionPlanID');
  }

  openAdminExistsList() {
    const allActionItemOnwers = this.filteredActionOwner.map((x: any) => x.ActionItemOwnerGUID);

    const dialog = this.dialog.open(UpdateActionItemListComponent, {
      disableClose: true,
      minWidth: "35vw",
      maxWidth: "60vw",
      minHeight: "60vh",
      maxHeight: "70vh",
      panelClass: "commentdark",
      data: {
        modalTitle: "Information",
        actionItems: JSON.parse(JSON.stringify(this.service.TableAP.data.filter((action: any) => !allActionItemOnwers.includes(action.ActionItemOwnerGUID)))) || []
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result)
        this.service.getIncidentList();
    });
  }

  setActionOwnerID(owner: any, event: any) {
    if (event.isUserInput) {
      this.submittedAP = false;
      this.actionItemPrompt = true;
      this.defineIncidentForm?.get('actionPlan')?.get('actionItemOwnerId')?.setValue(owner.ActionItemOwnerGUID);
    }
  }

  setActionPlanValidator(set: boolean): void { // true for adding validators
    const actionPlanControls = (this.defineIncidentForm?.get('actionPlan') as FormGroup)?.controls;
    Object.keys(actionPlanControls).forEach(controlName => {
      if (controlName !== 'index' && set) {                                   // if adding required validators
        actionPlanControls[controlName].setValidators([Validators.required]);
        actionPlanControls[controlName].updateValueAndValidity();
      } else if (controlName !== 'index' && !set) {                             // else removing required Validators
        actionPlanControls[controlName]!.clearValidators();
        actionPlanControls[controlName].updateValueAndValidity();
      }
    });
  }

  addActionItem() {
    this.submittedAP = true;
    this.setActionPlanValidator(true);
    if (this.defineIncidentForm?.get('actionPlan')?.invalid || this.endDateError || this.isActionExsist || this.minStartDateAPError || this.minEndDateAPError)
      return
    this.actionItemPrompt = false;
    this.blockAPEdit = false;
    let formActionValue = this.defineIncidentForm?.get('actionPlan')?.value;
    if (this.actionItemMode == "Update") {
      this.service.TableAP.data = (this.service.TableAP.data || []).map((x: any) =>
        x.Index === formActionValue.index ? { ...x, "ActionItem": formActionValue.actionItemText, "StartDate": formActionValue.startDate, "TargetDate": formActionValue.targetDate, "ActionItemOwnerGUID": formActionValue.actionItemOwnerId, "ActionItemOwner": formActionValue.actionItemOwnerName } : x
      );
      this.updateNReset();
    } else {
      this.service.TableAP.data.push({ "Index": this.service.TableAP.data.length + 1, "ActionItem": formActionValue.actionItemText, "ActionID": null, "StartDate": formActionValue.startDate, "TargetDate": formActionValue.targetDate, "ActionItemOwnerGUID": formActionValue.actionItemOwnerId, "ActionItemOwner": formActionValue.actionItemOwnerName });
      this.updateNReset();
    }
    this.service.TableAP._updateChangeSubscription();
    this.setTargetMaxDate();
    this.scrollDown('ActionPlanID');
    this.checkActionItemOwnersUpdated();
  }

  updateNReset() {
    this.blockAPEdit = false;
    this.defineIncidentForm.controls['actionPlan'].reset();
    this.setActionPlanValidator(false);
    this.filteredActionOwner = this.sourceActionOwner || [];
    this.actionItemMode = "Add";
    this.submittedAP = false;
    this.endDateError = false;
    this.isActionExsist = false;
    this.actionItemPrompt = false;
    this.minEndDateAPError = false;
    this.minStartDateAPError = false;
    this.setTargetMaxDate();
  }
  // Action Plan Mehods -- end

  // Methods for Forms -- end
    // ------------------------------------------------------------------------------------------------------------
  // Compare Methods for previous and latest changes  -- starts
  storeDataNCheck() {
    this.mainData = {
      ...this.defineIncidentForm.value,
      ActionTaken: this.service.TableAT.data.map(item => ({ ...item })),
      ActionPlan: this.service.TableAP.data.map(item => ({ ...item })),
      IncidentEvidences: this.service.incidentUploadedAttachments.map(item => ({ ...item }))
    };
  }

  isFormValueChanged(initialFormValues: any, updatedFormValues: any): boolean {
    const excludedProperties = ['actionTaken', 'actionPlan', 'ActionTaken', 'ActionPlan', 'IncidentEvidences'];
    const includedProperties = ['ActionTaken', 'ActionPlan', 'IncidentEvidences'];

    for (const key in updatedFormValues) {
      if (updatedFormValues.hasOwnProperty(key) && !excludedProperties.includes(key)) {
        if (updatedFormValues[key] !== initialFormValues[key]) {
          return true;
        }
      } else if (updatedFormValues.hasOwnProperty(key) && includedProperties.includes(key)) {
        if(key == 'ActionTaken'){
          if (initialFormValues[key].length !== updatedFormValues[key].length) {
            return true;
          }
          initialFormValues[key].sort((a: any, b: any) => a.Index - b.Index);
          updatedFormValues[key].sort((a: any, b: any) => a.Index - b.Index);

          for (let i = 0; i < initialFormValues[key].length; i++) {
            const mainObj = initialFormValues[key][i];
            const changedObj = updatedFormValues[key][i];
            for (const key in changedObj) {
              if (mainObj.hasOwnProperty(key) && changedObj.hasOwnProperty(key)) {
                if (mainObj[key] !== changedObj[key]) {
                  return true;
                }
              } else {
                return true;
              }
            }
          }
        } else if(key == 'ActionPlan'){
          if (initialFormValues[key].length !== updatedFormValues[key].length) {
            return true;
          }
          initialFormValues[key].sort((a: any, b: any) => a.Index - b.Index);
          updatedFormValues[key].sort((a: any, b: any) => a.Index - b.Index);

          for (let i = 0; i < initialFormValues[key].length; i++) {
            const mainObj = initialFormValues[key][i];
            const changedObj = updatedFormValues[key][i];
            for (const key in changedObj) {
              if (mainObj.hasOwnProperty(key) && changedObj.hasOwnProperty(key)) {
                if (mainObj[key] !== changedObj[key]) {
                  return true;
                }
              } else {
                return true;
              }
            }
          }
        } else if(key == 'IncidentEvidences') {
          const initialEvidenceIds = initialFormValues[key].map((x: any) => Number(x.AttachmentID));
          const updatedEvidenceIds = updatedFormValues[key].map((x: any) => Number(x.AttachmentID));

          if (initialEvidenceIds.length !== updatedEvidenceIds.length || initialEvidenceIds.some((item: any) => !updatedEvidenceIds.includes(item)) || updatedEvidenceIds.some((item: any) => !initialEvidenceIds.includes(item)))
            return true;
        }
      }
    }
    return false;
  }
  // Compare Methods for previous and latest changes  -- ends
    // ------------------------------------------------------------------------------------------------------------
  // file upload Method- starts
  openFileUploadPopup() {
    const dialog = this.dialog.open(FileUploadComponent, {
      disableClose: true,
      maxWidth: '50vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        moduleName: 'Incident',
        config    : this.fileUploadData,
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }
  // file upload Method- ends
    // ------------------------------------------------------------------------------------------------------------
  // On Create button clicked
  checkValidations() {
    if (this.defineIncidentForm.invalid || this.defineIncidentForm?.get('actionPlan')?.invalid || this.service.TableAT.data?.length == 0 || this.blockAPEdit || this.endIncTimeError || this.endIncDateError || this.minStartDateError || this.minEndDateError || this.actionItemPrompt || this.checkActionTakenSave(this.service.TableAT.data)) return true
    return false;
  }

  checkActionItemOwnersUpdated() {
    const allActionItemOnwers = this.filteredActionOwner.map((x: any) => x.ActionItemOwnerGUID);
    this.siteAdminExistsAT = this.service.TableAP.data.filter((action: any) => !allActionItemOnwers.includes(action.ActionItemOwnerGUID))?.length > 0
  }

  createNewIncident(): void {
    this.submitted = true;
    this.submittedAT = true;
    this.submittedAP = true;

    if(this.siteAdminExistsAT)
      this.scrollIntoView('ActionPlanID');

    if (this.checkValidations() || this.siteAdminExistsAT)
      return

    this.service.createNewIncident(this.defineIncidentForm.value, this.defineIncidentForm.get('incidentCode')?.value, this.mode).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Incident Reported Successfully");
        this.storeDataNCheck();
        this.isIncidentSaved = true;
        this.mode = "Edit";
        this.incidentData = res.result.IncidentListDetails[0];
        this.service.getIncidentReportData(this.incidentData);
        this.saveerror = "";
        this.scrollUp('scrollToTop');
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      };
    });
  }

  saveForLater(): void {
    this.submitted = true;
    this.submittedAT = true;
    this.submittedAP = true;

    if(this.siteAdminExistsAT)
      this.scrollIntoView('ActionPlanID');

    if (this.checkValidations() || this.siteAdminExistsAT)
      return;

    let modifiedData = this.defineIncidentForm.value;
    modifiedData.ActionTaken = JSON.parse(JSON.stringify(this.service.TableAT.data));
    modifiedData.ActionPlan = JSON.parse(JSON.stringify(this.service.TableAP.data));
    modifiedData.IncidentEvidences = JSON.parse(JSON.stringify(this.service.incidentUploadedAttachments));

    if (!this.isFormValueChanged(this.mainData, modifiedData)) {
      this.popupInfo("Unsuccessful", "No changes to save");
      return;
    }

    this.service.createNewIncident(this.defineIncidentForm.value, this.defineIncidentForm.get('incidentCode')?.value, this.mode).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Incident Updated Successfully");
        this.storeDataNCheck();
        this.incidentData = res.result.IncidentListDetails[0];
        this.service.getIncidentReportData(this.incidentData);
        this.saveerror = '';
        this.scrollUp('scrollToTop');
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }

  submit() {
    let modifiedData = this.defineIncidentForm.value;
    modifiedData.ActionTaken = this.service.TableAT.data;
    modifiedData.ActionPlan = this.service.TableAP.data;
    modifiedData.IncidentEvidences = JSON.parse(JSON.stringify(this.service.incidentUploadedAttachments));

    if (!this.isFormValueChanged(this.mainData, modifiedData)) {
      this.service.openSubmitForReview('Submit For Review', this.incidentData);
    } else {
      this.popupInfo("Unsuccessful", "Please save data before submit")
    }
  }

  // Resetting the Popup Forms and Variables
  resetForm() {
    this.submitted = false;
    this.submittedAT = false;
    this.submittedAP = false;
    this.actionItemPrompt = false;
    this.defineIncidentForm.reset()
    this.service.gotMasterIncidentReportDataNInfo$.next(false);
    this.dialogRef.close(true);
    this.blockAPEdit = false;
    this.defineIncidentForm.controls['actionPlan'].reset();
    this.setActionPlanValidator(false);
    this.filteredActionOwner = this.service.incidentInfoData && this.service.incidentInfoData.ActionItemOwnerList || [];
    this.actionItemMode = "Add";
    this.endDateError = false;
    this.isActionExsist = false;
    this.minEndDateAPError = false;
    this.minStartDateAPError = false;
    this.isIncidentSaved = false;
    this.setTargetMaxDate();
    this.isActionOwnerExists = false;
    this.maxAPDate = '';
    this.service.incidentReportData = {};
    this.service.incidentUploadedAttachments = [];
  }

  // Common Methods below (Popup Info, Save Sucess, Auto Scroll) -- start
  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "5vh",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
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

  // Auto Scroll
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

  scrollIntoView(id: any) {
    setTimeout(() => {
      const itemToScrollTo = document.getElementById(id);
      if (itemToScrollTo) {
        itemToScrollTo.scrollIntoView({
          block: 'center',
        });
      }
    }, 100);
  }

  formatedDate(date?:any){
    return this.service.dateToStringWithTimeStamp(date);
  }

  onIncidentClick(){
    if(this.filteredLocationList.length == 0){
      this.isLocationData = true
    }else{
      this.isLocationData = false
    }
  }
}
