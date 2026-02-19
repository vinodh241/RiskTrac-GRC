import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { addIndex, dateToYMd } from 'src/app/includes/utilities/commonFunctions';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss']
})
export class TestReportComponent {
  // Dropdown Position - Auto update.
  @ViewChild('autoCompleteActionInput', { read: MatAutocompleteTrigger })
  autoCompleteActionInput!: MatAutocompleteTrigger;

  BCMSTest        : any;
  testReportData  : any = {};
  orginalData     = {} as { [key: string]: any };
  modifiedData    = {} as { [key: string]: any };

  submitted             : boolean = false;
  reportDataForm!       : FormGroup;
  completionPercentForm!: FormGroup;
  initiateForm          : boolean = false;
  rangeErrorCP          : boolean = false;

  testWorkflowStatusID    : any;

  actionItemOnwersList    : any[]   = [];
  displayedColumnsAI      = ['Index', 'TestObservation', 'ActionItem', 'ActionItemOwner', 'TargetDate', 'Action'];
  observationExists       : boolean = false;
  actionItemExists        : boolean = false;
  filteredActionItemOnwers: any[]   = [];
  minEndDateError         : boolean = false;
  actionItemMode          : string  = 'Add';
  blockActionEdit         : boolean = false;
  actionItemSubmit        : boolean = false;

  // ckeditor config -- declarations
  ckeConfig           : any;
  disabledCkeConfig   : any;
  ckeConfigRC         : any;
  disabledCkeConfigRC : any;
  intializeCKEditor   : boolean = false;
  intializeCPF        : boolean = false;

  saveerror: any;          // DB Error Variable

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private utils: UtilsService,
    public authService: AuthService,
    public service: BcmsTestingService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private ckEditorService: CkEditorConfigService,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("bcms-testing");
  };

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['testAssessmentId']) {
        let payload = {testAssessmentId: params['testAssessmentId']}
        this.service.getTestReportData(payload);
      };
    });

    this.service.gotBCMSTestDetails$.subscribe((value: any) => {
      if (value) {
        this.BCMSTest = this.service.testDetails;
      };
    });

    this.service.gotTestReportData$.subscribe((value: any) => {
      if (value) {
        this.testReportData = this.service.testReportMaster;
        this.testWorkflowStatusID = Number(this.testReportData?.OverAllReportData[0]?.TestWorkflowStatusID)
        this.actionItemOnwersList = JSON.parse(JSON.stringify(this.testReportData.ActionItemOwnersList));
        this.filteredActionItemOnwers = JSON.parse(JSON.stringify(this.testReportData.ActionItemOwnersList));
        this.initializeForm();
      };
    });
    window.addEventListener('scroll', this.scrollEvent, true);
  };

  // Dropdown Position - Auto update.
  scrollEvent = (event: any): void => {
    if (this.autoCompleteActionInput) this.autoCompleteActionInput.updatePosition();
  };

  initializeForm() {
    this.initiateForm = false;

    this.reportDataForm = this.fb.group({
      testLimitPlanned: [this.testReportData.OverAllReportData[0].PlannedTestLimitations || '', [Validators.required]],
      testLimitPosttest: [this.testReportData.OverAllReportData[0].PostAnalysisTestLimitation || '', [Validators.required]],
      plannedFinancialImpact: [this.testReportData.OverAllReportData[0].PlannedFinancialImpact || '', [Validators.required]],
      postAnalysisFinancialImpact: [this.testReportData.OverAllReportData[0].PostAnalysisFinancialImpact || '', [Validators.required]],
      plannedCustomerImpact: [this.testReportData.OverAllReportData[0].PlannedCustomerImpact || '', [Validators.required]],
      postAnalysisCustomerImpact: [this.testReportData.OverAllReportData[0].PostAnalysisCustomerImpact || '', [Validators.required]],
      plannedOtherImpact: [this.testReportData.OverAllReportData[0].PlannedOtherImpact || ''],
      postAnalysisOtherImpact: [this.testReportData.OverAllReportData[0].PostAnalysisOtherImpact || ''],
      disruptionScenarios: this.fb.array([]),
      testingComponents: this.fb.array([]),
      testResults: this.fb.array([]),
      rootCauseAnalysis: [this.testReportData.OverAllReportData[0].RootCauseAnalysis || '', [Validators.required]],
      actionItems: this.fb.group({
        testObservation: [''],
        actionItem: [''],
        actionItemOwner: [''],
        actionItemOwnerGUID: [''],
        targetDate: [null],
      })
    });
    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
    this.ckeConfig.width = '30vw';
    this.ckeConfigRC = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfigRC = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
    this.ckeConfigRC.width = '60vw';
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 500);
    this.initiateForm = true;

    this.setDisruptionScenarios();
    this.setTestingComponents();
    this.setTestResults();
    this.orginalData = {};
    this.orginalData = this.reportDataForm.value;
    this.orginalData['TestObsAction'] = this.service.TableTO.data;

    this.displayedColumnsAI      = ['Index', 'TestObservation', 'ActionItem', 'ActionItemOwner', 'TargetDate', 'Action'];
    if(this.testReportData.OverAllReportData[0].TestWorkflowStatusID == 18) {
      this.reportDataForm.disable();
      this.displayedColumnsAI.pop();
    }

    this.initializeCPInput();
  }

  initializeCPInput() {
    if (this.testResultsControls?.length == 1) {
      let percentage = +this.testReportData?.OverAllReportData[0]?.TestResult[1]?.percentage?.replace('%', '') || 0;
      this.completionPercentForm = this.fb.group({
        completionPercent: [ percentage == 0 ? null : percentage,[Validators.min(1), Validators.max(99), Validators.pattern(/^\d+(\.\d+)?$/)]]
      });

      this.intializeCPF = true;
      setTimeout(() => {
        this.patchCPInput();
      }, 500);
      this.orginalData['completionPercent'] = this.completionPercentForm.get('completionPercent')?.value;
      return;
    }
    this.intializeCPF = false;
    this.orginalData['completionPercent'] = null;
  }

  patchCPInput() {
    let partialPercentage = Number(this.testReportData?.OverAllReportData[0]?.TestResult[1]?.percentage?.replace('%', ''))
    this.completionPercentForm.get('completionPercent')?.patchValue(
      (partialPercentage == 0)? null : partialPercentage || null
    );
  }

  get f() {
    return this.reportDataForm?.controls;
  }

  get f1() {
    return this.completionPercentForm?.controls;
  }

  ngOnDestroy() {
    this.reportDataForm = new FormGroup({});
    this.intializeCPF   = false;
  }

  setDisruptionScenarios() {
    const control = <FormArray>this.reportDataForm.get('disruptionScenarios');
    this.testReportData.DisruptionScenarios.forEach((scenario: any, index: any) => {
      control.push(this.createDisruptionScenarioFormGroup(scenario, index));
    });
  }

  createDisruptionScenarioFormGroup(scenario: any, i: any): FormGroup {
    return this.fb.group({
      testAssessmentID: [scenario.TestAssessmentID || ''],
      disruptionScenariosID: [scenario.DisruptionScenariosID || null],
      disruptionScenarios: [scenario.DisruptionScenarios || ''],
      reportedBy: [scenario.ReportedBy || ''],
      isTested: [scenario.IsTested || null, Validators.required],
      continuityProcess: [scenario.ContinuityProcess || '', Validators.required]
    });
  }

  get disruptionScenariosControls() {
    return (this.reportDataForm.get('disruptionScenarios') as FormArray).controls;
  }

  isDisruptionScenariosInvalid(): boolean {
    return this.disruptionScenariosControls.some(scenario => {
      const isTestedControl = scenario.get('isTested');
      const continuityProcessControl = scenario.get('continuityProcess');
      return (isTestedControl?.errors && (isTestedControl.touched || this.submitted)) ||
        (continuityProcessControl?.errors && (continuityProcessControl.touched || this.submitted));
    });
  }

  setTestingComponents() {
    const control = <FormArray>this.reportDataForm.get('testingComponents');
    this.testReportData.TestingComponents.forEach((component: any) => {
      control.push(this.createTestingComponentsFormGroup(component));
    });
  }

  createTestingComponentsFormGroup(component: any): FormGroup {
    return this.fb.group({
      component: [component.Component || ''],
      componentID: [component.ComponentID || null],
      isTestUnderTaken: [component.IsTestUnderTaken || null, Validators.required],
      options: [component.Options || ''],
      reportedBy: [component.ReportedBy || null],
      testAssessmentID: [component.TestAssessmentID || null],
      testingComponentReportID: [component.TestingComponentReportID || null]
    });
  }

  get testingComponentsControls() {
    return (this.reportDataForm.get('testingComponents') as FormArray).controls;
  }

  testingComponentsInvalid(): boolean {
    return this.testingComponentsControls.some(testComponent => {
      const isTestUnderTakenControl = testComponent.get('isTestUnderTaken');
      return (isTestUnderTakenControl?.errors && (isTestUnderTakenControl.touched || this.submitted));
    });
  }

  setTestResults() {
    const control = <FormArray>this.reportDataForm.get('testResults');
    this.testReportData.BussinessFunctionsList.forEach((busFun: any) => {
      control.push(this.createBusinessFunFormGroup(busFun));
    });
  }

  limitNumber() {
    if (this.testResultsControls?.length == 1 && (this.reportDataForm.get('testResults')!.value[0].result == '2')) {
      if (this.completionPercentForm.get('completionPercent')!.value > 100)
        this.rangeErrorCP = true;
      else
        this.rangeErrorCP = false;
    } else {
      this.completionPercentForm.get('completionPercent')?.reset();
    }
  }

  businessFunctionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isTested = control.get('recoveryProcedures')?.value;
      const additionalInformation = control.get('additionalInformation')?.value;

      if (isTested == 0 && !additionalInformation) {
        return { requiredAI: true };
      }
      return null;
    };
  }

  createBusinessFunFormGroup(busFun: any): FormGroup {
    const businessFunGroup = this.fb.group({
      additionalInformation: [busFun.AdditionalInformation || ''],
      businessFunctionID: [busFun.BusinessFunctionID || null],
      businessFunctionsName: [busFun.BusinessFunctionsName || ''],
      participantID: [busFun.ParticipantID || null],
      participantOptionID: [busFun.ParticipantOptionID || null],
      recoveryProcedures: [busFun.RecoveryProcedures || null, Validators.required],
      result: [busFun.Result || '', Validators.required],
      scheduleAssessmentID: [busFun.ScheduleAssessmentID || null],
      testAssessmentID: [busFun.TestAssessmentID || null]
    });

    businessFunGroup.setValidators(this.businessFunctionsValidator());
    return businessFunGroup;
  }

  get testResultsControls() {
    return (this.reportDataForm.get('testResults') as FormArray).controls;
  }

  testResultsInvalid(): boolean {
    return this.testResultsControls.some(test => {
      const recoveryProceduresControl = test.get('recoveryProcedures');
      const resultControl = test.get('result');
      const additionalInformationControl = test.get('additionalInformation');
      return (recoveryProceduresControl?.errors && (recoveryProceduresControl.touched || this.submitted)) ||
        (resultControl?.errors && (resultControl.touched || this.submitted)) || (additionalInformationControl?.errors && (additionalInformationControl.touched || this.submitted));
    });
  }

  addActionItem() {
    this.blockActionEdit = true;
    this.actionItemMode = "Add";
    this.actionItemSubmit = false;
    this.service.TableTO.data.push({ "Index": this.service.TableTO.data.length + 1, "TestActionPlanID": null, "TestObservation": "", "ActionItem": "", "ActionItemOwner": "", "ActionItemOwnerGUID": null, "TargetDate": null, "FormatedDate": "", "isEdit": true });
    this.service.TableTO._updateChangeSubscription();
    this.scrollDown('actionItemDiv')
  }

  onTestObservationChange() {
    let observation = this.reportDataForm.get('actionItems.testObservation')!.value;
    this.observationExists = this.service.TableTO.data.some((x: any) => (x.TestObservation.trim().toLowerCase() === observation.trim().toLowerCase()) && (!x.isEdit))
  }

  onActionItemChange() {
    let actionItem = this.reportDataForm.get('actionItems.actionItem')!.value;
    this.actionItemExists = this.service.TableTO.data.some((x: any) => (x.ActionItem.trim().toLowerCase() === actionItem.trim().toLowerCase()) && (!x.isEdit))
  }

  filterActionOwnerList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.reportDataForm.get('actionItems.actionItemOwnerGUID')!.setValue('');
    this.filteredActionItemOnwers = this.testReportData.ActionItemOwnersList.filter((action: any) => action.ActionItemOwnerGUID.toLowerCase().includes(searchTerm));
  }

  setActionItemGUID(action: any) {
    this.reportDataForm.get('actionItems.actionItemOwnerGUID')!.setValue(action.ActionItemOwnerGUID);
  }

  setTargetDate() {
    let formActionValue = this.reportDataForm.get('actionItems')!.value;
    let formEndDate = this.utils.formatTimeZone(formActionValue.targetDate) || '';
    let todaysDate = new Date();
    let formattedToday = this.utils.formatTimeZone(todaysDate) || '';
    if (formEndDate < formattedToday) {
      this.minEndDateError = true;
    } else {
      this.minEndDateError = false;
    }
  }

  editActionItem(action: any) {
    this.actionItemMode = "Edit"
    this.blockActionEdit = true;
    this.actionItemSubmit = false;
    action.isEdit = true;
    setTimeout(() => {
      this.reportDataForm.get('actionItems')?.patchValue({
        testObservation: action.TestObservation,
        actionItem: action.ActionItem,
        actionItemOwner: action.ActionItemOwner,
        actionItemOwnerGUID: action.ActionItemOwnerGUID,
        targetDate: action.TargetDate,
      });
    }, 100);
  }

  deleteActionItem(action: any) {
    const index = this.service.TableTO.data.findIndex(item => item.Index === action.Index);
    if (index !== -1) {
      this.service.TableTO.data.splice(index, 1);
    }
    this.service.TableTO.data = addIndex(this.service.TableTO.data, false);
    this.service.TableTO._updateChangeSubscription();
  }

  getSaveActionDisable() {
    const actionItems = this.reportDataForm.get('actionItems')?.value;
    if (actionItems) {
      const { testObservation, actionItem, actionItemOwner, actionItemOwnerGUID, targetDate } = actionItems;
      if ((testObservation?.length > 0) && (actionItem?.length > 0) &&
          (actionItemOwner?.length > 0) && (actionItemOwnerGUID?.length > 0) && (targetDate !== null)) {
        return true;
      }
    }
    return false;
  }

  checkTestObservationSave(tableTOData: any) {
    return tableTOData.some((x: any) => x.isEdit);
  }

  saveActionitem(action: any) {
    if (this.observationExists || this.actionItemExists || this.minEndDateError)
      return
    this.actionItemSubmit = false;
    this.blockActionEdit = false;
    action.isEdit = false;
    this.filteredActionItemOnwers = JSON.parse(JSON.stringify(this.testReportData.ActionItemOwnersList));
    const actionItem = this.reportDataForm.get('actionItems')?.value;
    this.service.TableTO.data = this.service.TableTO.data.map((x: any) =>
      x.Index === action.Index ? { ...x, TestObservation: actionItem.testObservation, ActionItem: actionItem.actionItem, ActionItemOwner: actionItem.actionItemOwner, ActionItemOwnerGUID: actionItem.actionItemOwnerGUID, TargetDate: this.utils.formatTimeZone(actionItem.targetDate), FormatedDate: dateToYMd(actionItem.targetDate) } : x
    );
    this.reportDataForm.get('actionItems')?.reset();
  }

  cancelActionItem(action: any) {
    this.blockActionEdit    = false;
    this.observationExists  = false;
    this.actionItemExists   = false;
    this.actionItemSubmit   = false;
    this.minEndDateError    = false;
    this.reportDataForm.get('actionItems')?.reset();
    this.filteredActionItemOnwers = JSON.parse(JSON.stringify(this.testReportData.ActionItemOwnersList));
    this.service.TableTO.data.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.actionItemMode == "Edit" || action.actionItemID) {
      this.service.TableTO._updateChangeSubscription();
    } else {
      const index = this.service.TableTO.data.indexOf(action.index);
      this.service.TableTO.data.splice(index, 1);
      this.service.TableTO._updateChangeSubscription();
    }
    this.actionItemMode = "Add";
  }

  saveReportData(from?: any) {
    this.submitted = true;
    this.actionItemSubmit = true;
    if (this.reportDataForm.invalid || this.checkTestObservationSave(this.service.TableTO.data) || this.service.TableTO.data.length == 0 || (this.testResultsControls?.length == 1 && this.reportDataForm.value.testResults[0].result == '2' && ['0%', '0', '', null].includes(this.completionPercentForm.get('completionPercent')!.value)) || this.rangeErrorCP)
      return;

    this.modifiedData = this.reportDataForm.value;
    this.modifiedData['completionPercent'] = this.intializeCPF? this.completionPercentForm.get('completionPercent')?.value : null;
    this.modifiedData['TestObsAction'] = this.service.TableTO.data;
    if (!this.isFormValueChanged(this.orginalData, this.modifiedData) || this.reportDataForm.invalid) {
      this.popupInfo("Unsuccessful", "No changes to save");
      return;
    }

    this.service.saveTestReport(this.reportDataForm.value, this.testResultsControls?.length == 1? this.completionPercentForm.get('completionPercent')?.value : null, this.service.TableTO.data).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Report Saved Successfully");
        this.service.processTestReportData(res);
        if (from == 1) this.scrollIntoView('scrollMiddle');
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }

  isFormValueChanged(initialFormValues: any, updatedFormValues: any): boolean {
    const excludedProperties = ['actionItems', 'disruptionScenarios', 'testResults', 'testingComponents', 'TestObsAction'];
    const includedProperties = ['disruptionScenarios', 'testResults', 'testingComponents', 'TestObsAction'];

    for (const key in updatedFormValues) {
      if (updatedFormValues.hasOwnProperty(key) && !excludedProperties.includes(key)) {
        if (updatedFormValues[key] !== initialFormValues[key]) {
          return true;
        }
      } else if (updatedFormValues.hasOwnProperty(key) && includedProperties.includes(key)) {
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
      }
    }
    return false;
  }

  publishReportData() {
    this.modifiedData = this.reportDataForm.value;
    this.modifiedData['completionPercent'] = this.intializeCPF? this.completionPercentForm.get('completionPercent')?.value : null;
    this.modifiedData['TestObsAction'] = this.service.TableTO.data;
    if (this.isFormValueChanged(this.orginalData, this.modifiedData) || this.reportDataForm.invalid) {
      this.popupInfo("Unsuccessful", "Please save report data before publish");
      return;
    }
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content: 'Are you sure, you want to publish the BCMS Test?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.service.publishTestReport().subscribe((res: any) => {
          next:
          if (res.success == 1) {
            this.saveSuccess("Test Assessment Published Successfully");
            this.service.processTestReportData(res);
            this.scrollUp('TopTestData');
            this.saveerror = '';
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
        })
      }
    });
  }

  downloadDraftPDF(testDetails: any) {
    this.service.getDraftPDFData(testDetails).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.service.downloadTestReportPDF(res.result);
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    })
  }

  navigateToTestBCMData(): void {
    this.route.navigate(['bcms-testing/bcms-assessment-details'], { queryParams: { 'BCMSTestID':  this.service.testDetails.TestAssessmentID} });
  };

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
}
