import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

@Component({
  selector: 'app-business-function-profile',
  templateUrl: './business-function-profile.component.html',
  styleUrls: ['./business-function-profile.component.scss']
})

export class BusinessFunctionProfileComponent {

  @ViewChild('autoCompleteCustomersInput', { read: MatAutocompleteTrigger })
  autoCompleteCustomersInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteProcessesInput', { read: MatAutocompleteTrigger })
  autoCompleteProcessesInput!: MatAutocompleteTrigger;
  @Input() businessFunctionFlag: any
  @Output() dataSaved = new EventEmitter<boolean>();
  @Output() allBusinessProfileData = new EventEmitter<any>();
  @Output() tabsEnableData = new EventEmitter<any>();
  criticalExists: boolean = false;
  blockEdit: boolean = false;
  blockEditBusiness: boolean = false
  submitted: boolean = false
  listingBCP: boolean = false;
  processExists: boolean = false;
  customerExists: boolean = false;
  intializeCKEditor: boolean = false;
  businessFunctionProfile!: FormGroup;
  profilingForm!: FormGroup;
  criticalData: any = [];
  displayedColumnsCC = ['Index', 'Description', 'Action'];
  displayedColumnsCCV = ['Index', 'Description'];
  displayedColumnsCBP = ['Index', 'Description', 'affiliation', 'Action']
  displayedColumnsCBPV = ['Index', 'Description', 'affiliation']
  questionControls: { id: number, control: FormControl }[] = [];
  businessFunction: any;
  allBusinessData: any;
  profilingQuestions: any
  statusData: any;
  affiliationDataStatus: any;
  selectedAffiliationId: any;
  affiliationStatus: any;
  affiliationStatusData: any;
  affliationName: any;
  allViewDetails: any;
  businessProcessList: any;
  filteredBusinessProcess: any;
  filteredCustomerDescription: any;
  customerList: any;
  businessActivities: any;
  isBCC: any;
  isBCM: any;
  isBO: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  profilingQuestionsView: any
  validationMsg: any;
  ProcessDet: any;
  currentStatus: any;
  // ckeditor config -- declarations
  ckeConfig: any;
  disabledCkeConfig: any;
  saveerror = "";
  wait: any;
  exportArr: any = [];
  isParam: any;

  constructor(
    public businessContinuityService: BusinessContinuityPlansService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private _document: any,
    public dialog: MatDialog,
    public authService: AuthService,
    public utils: UtilsService,
    private ckEditorService: CkEditorConfigService,
  ) {
    this.allViewDetails = {};
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("business-continuity-plan");

    this.isBCC = localStorage.getItem("IsBCCUser")
    this.isBCM = localStorage.getItem("IsBCManager")
    this.isBO = localStorage.getItem("IsBusinessOwner")

    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
  }

  ngOnInit() {
    this.isBCC = localStorage.getItem("IsBCCUser")
    this.isBCM = localStorage.getItem("IsBCManager")
    this.isBO = localStorage.getItem("IsBusinessOwner")
    this.businessContinuityService.getProcessBusinessDetails(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    // setTimeout(() => {
    this.businessContinuityService.processBusinessMaster.subscribe((value) => {
      if (value) {
        this.allBusinessData = this.businessContinuityService.processBusinessDetails?.BusinessContinuityQuestionsList[0] || []
        this.affiliationStatusData = this.businessContinuityService.processBusinessDetails?.BusinessContinuityQuestionsList[0].Affiliation || []
        this.profilingQuestions = addIndex(this.businessContinuityService.processBusinessDetails?.BusinessFunctionProfileDetails[0].ProfilingQuestions, false)
        this.profilingQuestionsView = this.businessContinuityService.processBusinessDetails?.BusinessFunctionProfileDetails[0].ProfilingQuestions || []
        this.allViewDetails = this.businessContinuityService.processBusinessDetails?.BusinessFunctionProfileDetails[0] || []
        this.businessProcessList = this.allBusinessData?.BusinessProcessesList || []
        this.customerList = this.allBusinessData?.TotalCustomersList || []
        this.businessActivities = this.allBusinessData?.CriticalBusinessActivities || []
        this.workFlowStatus = this.businessContinuityService.processBusinessDetails?.CurrentWorkflowStatus
        this.workFlowStatusID = this.businessContinuityService.processBusinessDetails?.CurrentWorkflowStatusID
        this.isParam = this.businessContinuityService.processBusinessDetails?.BusinessFunctionProfileDetails[0]?.IsSaved
        localStorage.setItem('BusinessOwnerName', (this.allViewDetails.BusinessOwnerName))
        localStorage.setItem('WorkFlowStatus', (this.workFlowStatus))
        localStorage.setItem('WorkFlowStatusID', (this.workFlowStatusID))
        let IsBCCValidUser = Number(localStorage.getItem("IsBCCValidUser"))
        this.currentStatus = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        if (!this.listingBCP) {
          this.initialze()
          this.createForm()
        }

        if (IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.listingBCP = false;

        } else {
          this.patchValueView(this.allViewDetails)
          this.listingBCP = true;
        }

        this.filteredBusinessProcess = this.businessProcessList;
        this.filteredCustomerDescription = this.customerList;
        this.dataSaved.emit(this.businessContinuityService.processBusinessDetails?.BusinessFunctionProfileDetails[0].IsSaved)
        this.tabsEnableData.emit(this.businessContinuityService.processBusinessDetails?.completeSavedData)
      }
      this.businessFunctionFlag = true
      if (this.allViewDetails?.BusinessDescription != null) {
        this.patchValue(this.allViewDetails)
      }
    })
    // },);
    window.addEventListener('scroll', this.scrollEvent, true);
    this.businessContinuityService.TableCB = new MatTableDataSource();
    this.businessContinuityService.TableCBP = new MatTableDataSource();
    this.businessContinuityService.TableCBV = new MatTableDataSource();
    this.businessContinuityService.TableCBPV = new MatTableDataSource();
    this.businessContinuityService.TableCBV = this.allViewDetails?.CriticalBusinessActivities
    this.businessContinuityService.TableCBPV = this.allViewDetails?.Customers
    this.businessFunctionFlag = true
  }

  // Drop-Down Position - Auto Update
  scrollEvent = (event: any): void => {
    if (this.autoCompleteProcessesInput) this.autoCompleteProcessesInput.updatePosition();
    if (this.autoCompleteCustomersInput) this.autoCompleteCustomersInput.updatePosition();
  };

  ngOnChanges() {
    this.isBCC = localStorage.getItem("IsBCCUser")
    this.isBCM = localStorage.getItem("IsBCManager")
    this.isBO = localStorage.getItem("IsBusinessOwner")

    this.createForm()
    this.initialze()
    if (this.allViewDetails?.BusinessDescription != null) {
      this.patchValue(this.allViewDetails)
    }
  }

  ngOnDestroy() {
    this.allViewDetails = {};
    this.businessContinuityService.processBusinessMaster.next(false);
  }

  createForm() {
    this.businessFunctionFlag = true
    const formGroup: { [key: string]: any } = {};
    this.profilingQuestions?.forEach((question: any) => {
      formGroup['ProfilingAnswer_' + question.ProfilingQuestionID] = new FormControl(question.ProfilingAnswer, Validators.required);
    });
    this.profilingForm = this.fb.group(formGroup);
  }

  initialze() {
    this.businessFunctionProfile = this.fb.group({
      description: ['', Validators.required],
      business: ['', Validators.required],
      profileQuestions: ['', Validators.required],
      affiliationDataStatus: [],
      caDescription: ['', Validators.required],
      cDescription: ['', Validators.required]
    });
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 500);
  }

  patchValue(data: any) {
    setTimeout(() => {
      this.businessFunctionProfile?.patchValue({
        description: (data?.BusinessDescription),
        business: (data?.BusinessServices),
      })
      this.profilingQuestions.forEach((question: any) => {
        this.profilingForm.patchValue({
          ['ProfilingAnswer_' + question.ProfilingQuestionID]: question.ProfilingAnswer
        });
      })
      this.businessContinuityService.TableCB = new MatTableDataSource(this.businessContinuityService.addIndex(data?.CriticalBusinessActivities, true))
      this.businessContinuityService.TableCBP = new MatTableDataSource(this.businessContinuityService.addIndex(data?.Customers, true))

    }, 1000);
    this.businessFunctionFlag = true
  }

  patchValueView(data: any) {
    setTimeout(() => {
      this.businessFunctionProfile?.patchValue({
        description: (data?.BusinessDescription),
        business: (data?.BusinessServices),
      })
      this.businessContinuityService.TableCB = new MatTableDataSource(this.businessContinuityService.addIndex(data?.CriticalBusinessActivities, true))
      this.businessContinuityService.TableCBP = new MatTableDataSource(this.businessContinuityService.addIndex(data?.Customers, true))

    }, 1000);
    this.businessFunctionFlag = true
  }

  isEnable() {
    if (this.isBCM) {
      return true
    } else if (this.isBCC) {
      return false
    } else if (this.isBO) {
      return true
    } else {
      return false
    }
  }

  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  saveProcess(critical: any) {
    this.businessFunctionFlag = true
    if (this.processExists)
      return
    this.blockEdit = false;
    critical.isEdit = false;
    this.businessContinuityService.TableCB.data = this.businessContinuityService.TableCB.data.map((x: any) =>
      x.Index === critical.Index ? { ...x, Description: this.criticalData[0].ActivityName, ActivityID: this.criticalData[0].ActivityID } : x
    );

    this.businessFunctionProfile.get('caDescription')?.reset();
    this.criticalData = "";
    this.affiliationStatus = "";
    this.businessFunctionFlag = true
  }

  checkCriticalSave(data: any) {
    this.businessFunctionFlag = true
    return data.some((x: any) => x.isEdit);
  }

  deleteProcess(Critical: any) {
    this.businessFunctionFlag = true
    const index = this.businessContinuityService.TableCB.data.findIndex(item => item.Index === Critical.Index);
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure you want to delete the Process?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        if (index !== -1) {
          this.businessContinuityService.TableCB.data.splice(index, 1);
        }
        this.businessContinuityService.TableCB.data = addIndex(this.businessContinuityService.TableCB.data, false);
        this.businessFunctionFlag = true
        this.businessContinuityService.TableCB._updateChangeSubscription();
      }
    }
    )
  }

  addCritical() {
    this.filteredBusinessProcess = this.businessProcessList;
    this.processExists = false
    this.criticalData = "";
    this.affiliationStatus = "";
    this.blockEdit = true;
    this.businessContinuityService.TableCB.data.push({ "Index": this.businessContinuityService.TableCB.data.length + 1, "Description": "", "isEdit": true, "ActivityID": null });
    this.businessContinuityService.TableCB._updateChangeSubscription();
    this.businessFunctionProfile.controls['caDescription'].setValue("");
  }

  onChange(e: any) {
    this.businessFunctionFlag = true
    this.criticalData = e.target.value;
    this.affiliationStatus = "";
    this.criticalExists = this.businessContinuityService.TableCB.data.some((x: any) => (x.Description.trim().toLowerCase() === this.criticalData.trim().toLowerCase()) && (!x.isEdit))
  }

  cancel(Critical: any) {
    this.businessFunctionFlag = true
    this.processExists = false
    this.blockEdit = false;
    this.businessContinuityService.TableCB.data.forEach((x: any) => {
      x.isEdit = false;
    });
    const index = this.businessContinuityService.TableCB.data.indexOf(Critical.index);
    this.businessContinuityService.TableCB.data.splice(index, 1);
    this.businessContinuityService.TableCB._updateChangeSubscription();
  }

  cancelCriticalBusiness(Critical: any) {
    this.customerExists = false
    this.businessFunctionFlag = true
    this.blockEditBusiness = false;
    this.businessContinuityService.TableCBP.data.forEach((x: any) => {
      x.isEdit = false;
    });
    const index = this.businessContinuityService.TableCBP.data.indexOf(Critical.index);
    this.businessContinuityService.TableCBP.data.splice(index, 1);
    this.businessContinuityService.TableCBP._updateChangeSubscription();
  }

  addCriticalBusiness() {
    this.businessFunctionFlag = true;
    this.criticalData = "";
    this.affiliationStatus = "";
    this.blockEditBusiness = true;
    this.filteredCustomerDescription = this.customerList;
    this.businessFunctionProfile?.controls['affiliationDataStatus']?.setValue('');
    this.businessFunctionProfile?.controls['cDescription']?.setValue('');
    this.businessContinuityService.TableCBP.data.push({
      "Index": this.businessContinuityService.TableCBP.data.length + 1,
      "Description": "",
      "affiliationDataStatus": "",
      "isEdit": true,
      "activityID": null
    });
    this.businessContinuityService.TableCBP._updateChangeSubscription();
  }

  saveCriticalBusiness(critical: any) {
    this.businessFunctionFlag = true
    if (this.criticalExists)
      return;
    this.blockEditBusiness = false;
    critical.isEdit = false;
    this.businessContinuityService.TableCBP.data = this.businessContinuityService.TableCBP.data.map((x: any) =>
      x.Index === critical.Index ? { ...x, Description: this.criticalData[0].CustomerName, affiliationDataStatus: this.affliationName, activityID: this.criticalData[0].CustomerID } : x
    );
    this.criticalData = "";
    this.affiliationStatus = "";
    this.businessFunctionFlag = true
    this.businessFunctionProfile.controls['cDescription'].setValue("");
  }

  deleteCriticalBusiness(Critical: any) {
    this.businessFunctionFlag = true
    const index = this.businessContinuityService.TableCBP.data.findIndex(item => item.Index === Critical.Index);
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure you want to delete the Customer?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        if (index !== -1) {
          this.businessContinuityService.TableCBP.data.splice(index, 1);
        }
        this.businessContinuityService.TableCBP.data = addIndex(this.businessContinuityService.TableCBP.data, false);
        this.businessContinuityService.TableCBP._updateChangeSubscription();
      }
    })
  }

  radiobuttonClick(affiliationId: number) {
    this.businessFunctionFlag = true
    this.affiliationStatus = affiliationId
    this.affliationName = this.affiliationStatusData.filter((ele: any) => ele.AffiliationID == affiliationId)[0].AffiliationName
  }

  onSubmit() {
    this.submitted = true
    let profilingQuestions = this.parseInputJSON(this.profilingForm.value)
    const updatedData = this.businessContinuityService.TableCBP.data.map((item: any) => {
      let IsInternal = false;

      if (item.Affiliate && item.Affiliate === "External") {
        IsInternal = false;
      } else if (item.Affiliate && item.Affiliate === "Internal") {
        IsInternal = true;
      } else if (item.affiliationDataStatus && item.affiliationDataStatus === "Internal") {
        IsInternal = true;
      } else if (item.affiliationDataStatus && item.affiliationDataStatus === "External") {
        IsInternal = false;
      }
      return {
        CustomerName: item.Description,
        IsInternal: IsInternal,
        CustomerID: item.CustomerID ? item.CustomerID : (item.activityID ? item.activityID : null)
      };
    });

    const business = this.businessContinuityService.TableCB.data.map(
      (item) => {
        return {
          ActivityName: item.Description,
          ActivityID: item.ActivityID ? item.ActivityID : null,
        };
      }
    );

    let data =
    {
      "BusinessFunctionProfileID": Number(this.allViewDetails.BusinessFunctionProfileID) ? Number(this.allViewDetails.BusinessFunctionProfileID) : null,
      "BusinessContinuityPlanID": Number(localStorage.getItem("BusinessContinuityPlanID")),
      "SectionID": 1,
      "BusinessFunctionID": Number(localStorage.getItem("BusinessFunctionID")),
      "BusinessDescription": this.businessFunctionProfile.value.description,
      "BusinessServices": this.businessFunctionProfile.value.business,
      "CriticalBusinessActivities": business,
      "Customers": updatedData,
      "ProfilingQuestions": {}
    }
    data.ProfilingQuestions = profilingQuestions

    this.businessContinuityService.addBusinessData(data).subscribe((res) => {
      if (res.success == 1) {
        let profileDetails = res.result.BusinessFunctionProfileDetails[0]
        this.saveSuccess('Business Function Profile saved successfully', profileDetails, res.result);
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
      error: console.log('err::', 'error');
    });
    this.businessFunctionFlag = true
  }

  saveSuccess(content: string, profileDetails: any, res: any): void {
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
      // setTimeout(() => {
      this.intializeCKEditor = false;
      confirm.close();
      this.tabsEnableData.emit(res?.CompleteSavedData)
      this.businessContinuityService.getProcessBusinessDetails(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")));
      this.initialze();
      // }, timeout);
      this.businessFunctionFlag = true
      localStorage.setItem('WorkFlowStatus', (this.workFlowStatus))
    });
  }

  parseInputJSON(input: any) {
    const profilingQuestions: any[] = [];
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const [prefix, suffix] = key.split('_');
        if (prefix === "ProfilingAnswer" && !isNaN(parseInt(suffix))) {
          const profilingQuestionID = parseInt(suffix);
          const profilingAnswer = input[key];
          profilingQuestions.push({ ProfilingQuestionID: profilingQuestionID, ProfilingAnswer: profilingAnswer });
        }
      }
    }
    return profilingQuestions;
  }

  get f() {
    return this.businessFunctionProfile.controls;
  }

  checkControlSave(data: any) {
    this.businessFunctionFlag = true
    return data.some((x: any) => x.isSaved);
  }

  filterBusinessProcesses(data: any) {
    this.criticalData = [];
    let searchTerm = data.target.value;

    this.ProcessDet = this.businessFunctionProfile.value.caDescription.trim().toLowerCase()

    this.processExists = this.businessContinuityService.TableCB.data.some(
      (x: any) => x.Description.trim().toLowerCase() === this.ProcessDet
    );

    let filteredList = this.businessProcessList.filter((process: any) => {
      return process.ActivityName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    this.filteredBusinessProcess = filteredList.filter((process: any) => {
      return !this.businessActivities.some((activity: any) => activity.ActivityID === process.ActivityID);
    });

    if (this.filteredBusinessProcess.length > 0) {
      this.criticalData = this.filteredBusinessProcess;
    } else {
      let recentData = this.criticalData
        .filter((process: any) => process.ActivityID === null)
        .slice(this.criticalData.length - 1);

      this.criticalData.push({
        "ActivityID": null,
        "ActivityName": searchTerm
      });

    }
  }

  setBusinessProcess(process: any) {
    this.criticalData = []
    this.criticalData.push(process)
    this.ProcessDet = this.businessFunctionProfile.value.caDescription.trim().toLowerCase()
    this.processExists = this.businessContinuityService.TableCB.data.some(
      (x: any) => x.Description.trim().toLowerCase() === this.ProcessDet
    );

    this.businessFunctionProfile.controls['caDescription'].setValue(
      process.ActivityName
    );
  }

  filterCustomerDescription(data: any) {
    this.criticalData = []
    let searchTerm = data.target.value;

    let CustomerDup = this.businessFunctionProfile.value.cDescription.trim().toLowerCase()
    this.customerExists = this.businessContinuityService.TableCBP.data.some(
      (x: any) => x.Description.trim().toLowerCase() === CustomerDup
    );

    this.filteredCustomerDescription = this.customerList.filter(
      (process: any) => process.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filteredCustomerDescription.length > 0) {
      this.criticalData = this.filteredCustomerDescription;
    } else {

      let recentData = this.criticalData
        .filter((process: any) => process.CustomerName === null)
        .slice(this.criticalData.length - 1);

      this.criticalData.push({
        "CustomerID": null,
        "CustomerName": searchTerm
      });

    }
  }

  setCustomerDescription(data: any) {
    this.criticalData = []
    this.criticalData.push(data)
    let CustomerDup = this.businessFunctionProfile.value.cDescription.trim().toLowerCase()
    this.customerExists = this.businessContinuityService.TableCBP.data.some(
      (x: any) => x.Description.trim().toLowerCase() === CustomerDup
    );

    this.businessFunctionProfile.controls['cDescription'].setValue(
      data.CustomerName
    );
  }

  get formControls() {
    return this.profilingForm.controls;
  }

  isAnyControlInvalid(): boolean {
    for (const controlName in this.profilingForm.value) {
      const control = this.profilingForm.get(controlName);
      if (control && (control.value === null || (typeof control.value === 'string' && control.value.trim() === ''))) {
        return true;
      }
    }
    return false;
  }

  isBusControlInvalid(): boolean {
    const description = this.businessFunctionProfile.get("description")?.value || '';
    const business = this.businessFunctionProfile.get("business")?.value || '';
    const tableCBDataLength = this.businessContinuityService.TableCB?.data.length || 0;
    const tableCBPDataLength = this.businessContinuityService.TableCBP?.data.length || 0;

    const isDescriptionEmpty = this.stripHtml(description).trim() === '';
    const isBusinessEmpty = business === '';
    const isTableCBEmpty = tableCBDataLength === 0;
    const isTableCBPEmpty = tableCBPDataLength === 0;

    return isDescriptionEmpty || isBusinessEmpty || isTableCBEmpty || isTableCBPEmpty;
  }

  isSaveEnable(): boolean {
    if (!this.isBusControlInvalid() && !this.isAnyControlInvalid() && !this.blockEdit && !this.blockEditBusiness) {
      return false
    }
    return true
  }

  isSaveDisable() {
    const actionItems = this.businessFunctionProfile?.value;
    if (actionItems) {
      if ((actionItems.caDescription.trim()?.length > 0) && !this.processExists) {
        return true;
      }
    }
    return false;
  }

  isSaveCustDisable() {
    const actionItems = this.businessFunctionProfile?.value;
    if (actionItems) {
      if ((actionItems.cDescription.trim()?.length > 0) && (actionItems.affiliationDataStatus == 1 || actionItems.affiliationDataStatus == 2) && !this.customerExists) {
        return true;
      }
    }
    return false;
  }

}
