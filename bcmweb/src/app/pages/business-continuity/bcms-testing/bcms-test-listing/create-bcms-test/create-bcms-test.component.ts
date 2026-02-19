import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, formatTimeType } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { extentedTitle } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-create-bcms-test',
  templateUrl: './create-bcms-test.component.html',
  styleUrls: ['./create-bcms-test.component.scss']
})
export class CreateBcmsTestComponent implements OnInit, OnDestroy{
  // Dropdown Position - Auto update -- declarations
  @ViewChild('autoCompleteSpecificSiteInput', { read: MatAutocompleteTrigger })
  autoCompleteSpecificSiteInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteBusinessFunInput', { read: MatAutocompleteTrigger })
  autoCompleteBusinessFunInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCustomSiteInput', { read: MatAutocompleteTrigger })
  autoCompleteCustomSiteInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteTestObsInput', { read: MatAutocompleteTrigger })
  autoCompleteTestObsInput!: MatAutocompleteTrigger;

  displayedColumnsDS = ['Index', 'DisruptionScenarioName', 'Action'];
  displayedColumnsBA = ['Index', 'ApplicationName', 'Action'];

  testExists          : boolean = false;

  submitted           : boolean = false;
  submittedPG         : boolean = false;
  submittedDS         : boolean = false;
  submittedBA         : boolean = false;
  defineBCMSTestForm! : FormGroup;

  isTestObsExists     : boolean = false;
  filteredTestObsList : any[]   = [];

  disruptionMode      : any     = ''
  blockEdit           : boolean = false;
  disruptionSceExists : boolean = false;

  businessAppMode     : any     = '';
  blockEditBA         : boolean = false;
  uniqueBussinessApp  : any[]   = [];
  linkedBussinessApp  : any[]   = [];
  businessAppUpdated  : boolean = false;
  notificationTimeout : any     = null;

  filteredBusiness: any[] = [];
  selectedBusiness: any[] = [];

  filteredSites: any[] = [];
  selectedSites: any[] = [];

  filteredSpecificSites : any[] = [];
  isSpecificSiteExists  : boolean = false;

  // Business Applications saved data based on Participant Options
  businessAppParticipants: any[] = [
    {
      participantId: 1,
      businessApplications: []
    },
    {
      participantId: 2,
      businessApplications: []
    },
    {
      participantId: 3,
      businessApplications: []
    },
    {
      participantId: 4,
      businessApplications: []
    }
  ];

  // start/end::date/time -- Declaration
  minDate           : any     = new Date();
  endTestDateError  : boolean = false;
  endTestTimeError  : boolean = false;
  minStartDateError : boolean = false;
  minEndDateError   : boolean = false;
  timeDiffError     : string  = '';

  // DB error -- Declaration
  saveerror   : any = '';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public utils: UtilsService,
    public service: BcmsTestingService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    private dialogRef: MatDialogRef<CreateBcmsTestComponent>,
    private cdr: ChangeDetectorRef
  ) {
    this.service.getBCMSAddTestInfo();
    this.initializeForm();
  }

  ngOnInit(): void {
    this.service.gotMasterInfo$.subscribe((value: any) => {
      this.resetForm();
      if (value) {
        this.filteredSites = this.service.infoMaster.SitesList || [];
        this.filteredSpecificSites = this.service.infoMaster.SitesList || [];
        this.filteredTestObsList = this.service.infoMaster.TestObserversList || [];
        this.filteredBusiness = this.service.infoMaster.BusinessFunctionsList || [];
        if (this.parent.testMode == 'Update') {
          this.patchTestDetails();
        }
      }
    });
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  // Dropdown Position - Auto update.
  scrollEvent = (event: any): void => {
    if (this.autoCompleteSpecificSiteInput) this.autoCompleteSpecificSiteInput.updatePosition();
    if (this.autoCompleteBusinessFunInput) this.autoCompleteBusinessFunInput.updatePosition();
    if (this.autoCompleteCustomSiteInput) this.autoCompleteCustomSiteInput.updatePosition();
    if (this.autoCompleteTestObsInput) this.autoCompleteTestObsInput.updatePosition();
  };

  ngOnDestroy() {
    this.service.gotMasterInfo$.next(false);
    this.saveerror = '';
  }

  showBANotification() {
    if (this.parent.testData?.TestAssessmentStatusID == 1 || this.parent.testData?.TestAssessmentStatusID == undefined) {
      this.businessAppUpdated = true;
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      this.notificationTimeout = setTimeout(() => {
        this.businessAppUpdated = false;
        this.notificationTimeout = null;
      }, 3000);
    }
  }

  checkTestExists(e: any) {
    if (this.parent.testData)
      this.testExists = this.parent.allTests.some((x: any) => x.TestName.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.TestAssessmentID !== this.parent.testData.TestAssessmentID));
    else
      this.testExists = this.parent.allTests.some((x: any) => x.TestName.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  // Test Observer -- Methods - starts
  filterTestObserverList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineBCMSTestForm.controls['testObserverGUID'].setValue("");
    this.filteredTestObsList = this.service.infoMaster.TestObserversList.filter((obs: any) => obs.TestObserverName.toLowerCase().includes(searchTerm));
    this.isTestObsExists = false;
  }

  setTestObsGUID(obs: any) {
    this.defineBCMSTestForm.controls['testObserverGUID'].setValue(obs.TestObserverGUID);
  }
  // Test Observer -- Methods - end
    //-------------------------------------------------------------------------------------------------------------
  // Participant-Sites List -- Methods - starts
  filterSitesList(event:any){
    const searchTerm = event.target.value.toLowerCase();
    this.defineBCMSTestForm.controls['participantGroup.customSites']?.setValue("");
    if(this.selectedSites.length == 0){
      this.filteredSites = this.service.infoMaster.SitesList.filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
    }else{
      let remainingSites = this.service.infoMaster.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
      this.filteredSites = remainingSites.filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
    }
  }

  setSelectedSite(site:any){
    this.blockEditBA = false;
    this.defineBCMSTestForm.controls['participantGroup.customSites']?.setValue(site);
    this.defineBCMSTestForm.get('participantGroup.customSites')?.reset();
    this.selectedSites.push(site);
    this.filteredSites = this.service.infoMaster.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
    this.setBusinessApplications(4);
    this.updateStoredBusinessApp();
  }

  removeSelectedSites(site:any){
    this.showBANotification();
    const index = this.selectedSites.findIndex((item: any) => item.SiteID === site.SiteID);
    if (index !== -1){
      this.selectedSites.splice(index, 1);
      this.filteredSites = this.service.infoMaster.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
    }
    this.blockEditBA = false;
    this.defineBCMSTestForm.get('bussinessApplications.applicationId')?.untouched;
    if (this.selectedSites?.length == 0) {
      this.defineBCMSTestForm.controls['bussinessApplications'].reset();
    }
    const selectedSiteIDs = this.selectedSites.map(site => Number(site.SiteID));
    this.businessAppParticipants[3].businessApplications = this.businessAppParticipants[3].businessApplications.filter((app: any) =>
        app.connectedSiteIDs.some((siteID: any) => selectedSiteIDs.includes(Number(siteID)))
    );

    this.service.TableBApplicationTest = new MatTableDataSource(addIndex([], false));
    this.setBusinessApplications(4);
  }
  // Participant-Sites List -- Methods - end
    //-------------------------------------------------------------------------------------------------------------
  // Specific Sites List -- Methods - starts
  filterSpecificSites(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineBCMSTestForm.get('participantGroup.specificSiteId')?.reset();
    this.filteredSpecificSites = (this.service.infoMaster.SitesList || []).filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
    this.isSpecificSiteExists = false;
  }

  setSpecificSiteID(site: any, event?: any) {
    this.showBANotification();
    this.defineBCMSTestForm.controls['bussinessApplications'].reset();
    this.blockEditBA = false;
    if (event.isUserInput)
      this.defineBCMSTestForm.get('participantGroup.specificSiteId')!.patchValue(site.SiteID);
    this.service.TableBApplicationTest = new MatTableDataSource(addIndex([], false));
    this.businessAppParticipants[1].businessApplications = [];
  }
  // Specific Sites List -- Methods - ends
    //---------------------------------------------------------------------------------------------------------------
  // Participant-Business List -- Methods - starts
  filterBusinessList(event:any){
    const searchTerm = event.target.value.toLowerCase();
    this.defineBCMSTestForm.controls['participantGroup.bussinessFun']?.setValue("");
    if(this.selectedBusiness.length == 0){
      this.filteredBusiness = this.service.infoMaster.BusinessFunctionsList.filter((business: any) => business.BusinessFunctionsName.toLowerCase().includes(searchTerm));
    }else{
      let remainingBusinessFunc = this.service.infoMaster.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
      this.filteredBusiness = remainingBusinessFunc.filter((business: any) => business.BusinessFunctionsName.toLowerCase().includes(searchTerm));
    }
  }

  removeSelectedBusiness(business: any): void {
    this.showBANotification();
    const index = this.selectedBusiness.indexOf(business);
    if (index !== -1){
      this.selectedBusiness.splice(index, 1);
      this.filteredBusiness = this.service.infoMaster.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
    }

    this.defineBCMSTestForm.get('bussinessApplications.applicationId')?.untouched;
    this.blockEditBA = false;
    if (this.selectedBusiness?.length == 0) {
      this.defineBCMSTestForm.controls['bussinessApplications'].reset();
    }

    const selectedBFIDs = this.selectedBusiness.map(b => Number(b.BusinessFunctionsID));
    this.businessAppParticipants[2].businessApplications = this.businessAppParticipants[2].businessApplications.filter((app: any) =>
      selectedBFIDs.includes(Number(app.connectedBusinessFunctionID))
    );
    // this.businessAppParticipants[2].businessApplications = this.businessAppParticipants[2].businessApplications.filter((x: any) => Number(x.connectedBusinessFunctionID) != Number(business.BusinessFunctionsID));
    this.service.TableBApplicationTest = new MatTableDataSource(addIndex([], false));
    this.setBusinessApplications(3);
  }

  setSelectedBusiness(business: any): void {
    if (this.blockEdit)
      this.blockEditBA = false;
    this.defineBCMSTestForm.controls['participantGroup.bussinessFun']?.setValue(business);
    this.defineBCMSTestForm.get('participantGroup.bussinessFun')?.reset();
    this.selectedBusiness.push(business);
    this.filteredBusiness = this.service.infoMaster.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
    this.updateStoredBusinessApp();
  }
  // Participant-Business List -- Methods - end
    //-------------------------------------------------------------------------------------------------------------
  // Form Initialization/Updation & validations of Form starts
  get f() {
    return this.defineBCMSTestForm?.controls;
  }

  get f1() {
    return (this.defineBCMSTestForm?.get('participantGroup') as FormGroup)?.controls;
  }

  initializeForm(): void {
    this.defineBCMSTestForm = this.fb.group({
      testTitle         : ["", [Validators.required]],
      plannedStartDate  : ["", [Validators.required]],
      plannedStartTime  : ["", [Validators.required]],
      plannedEndDate    : ["", [Validators.required]],
      plannedEndTime    : ["", [Validators.required]],
      testType          : ["", [Validators.required]],
      testScenarioTitle : ["", [Validators.required, Validators.maxLength(200)]],
      testScenarioDes   : ["", [Validators.required]],
      testObserver      : ["", [Validators.required]],
      testObserverGUID  : ["", [Validators.required]],
      participantGroup  : this.fb.group({
        participants    : [null, [Validators.required]],
        specificSite    : [""],
        specificSiteId  : [""],
        bussinessFun    : [[]],
        customSites     : [[]],
      }),
      plannedTestLimit    : ["", [Validators.required]],
      plannedFinancialImp : ["", [Validators.required]],
      PlannedCustomerImp  : ["", [Validators.required]],
      PlannedOtherImp     : [""],
      scenario: [""],
      bussinessApplications: this.fb.group({
        applicationId: [null],
      })
    });
    this.setValidatorNDisable();
  }

  patchTestDetails(): void {
    let selectedTest = this.parent.testData;
    this.service.TabledisruptionScenarios = new MatTableDataSource(addIndex(selectedTest?.DisruptionScenarios, false));
    this.service.TabledisruptionScenarios._updateChangeSubscription();

      this.defineBCMSTestForm.patchValue({
        testTitle               : selectedTest.TestName,
        plannedStartDate        : this.utils.formatTimeZone(selectedTest.ScheduledDate),
        plannedStartTime        : formatTimeType(selectedTest.ScheduledDate),
        plannedEndDate          : this.utils.formatTimeZone(selectedTest.EndDate),
        plannedEndTime          : formatTimeType(selectedTest.EndDate),
        testType                : selectedTest.TestTypeID,
        testScenarioTitle       : selectedTest.TestingScenario,
        testObserver            : selectedTest.TestObserver,
        testObserverGUID        : selectedTest.TestObserverGUID,
        testScenarioDes         : selectedTest.TestScenarioDescription,
        plannedTestLimit        : selectedTest.PlannedTestLimitations,
        plannedFinancialImp     : selectedTest.PlannedFinancialImpact,
        PlannedCustomerImp      : selectedTest.PlannedCustomerImpact,
        PlannedOtherImp         : selectedTest.PlannedOtherImpact
      });
      if (selectedTest.ParticipantOptionID == '1') {
        this.selectParticipantsOption(1);
      }
      if (selectedTest.ParticipantOptionID == 2) {
        this.selectParticipantsOption(2);
        this.defineBCMSTestForm.get('participantGroup.specificSite')!.patchValue(selectedTest.Sites[0].SiteName);
        this.defineBCMSTestForm.get('participantGroup.specificSiteId')!.patchValue(selectedTest.Sites[0].SiteID);
        this.cdr.detectChanges();
        this.getBusinessAppDisablity();
      }
      if (selectedTest.ParticipantOptionID == 3) {
        this.selectedBusiness = [];
        Array.prototype.push.apply(this.selectedBusiness, selectedTest.BusinessFunctions);
        this.filteredBusiness = this.service.infoMaster.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
        this.selectParticipantsOption(3);
        this.getBusinessAppDisablity();
      }
      if (selectedTest.ParticipantOptionID == 4) {
        this.selectedSites = [];
        Array.prototype.push.apply(this.selectedSites, selectedTest.Sites);
        this.filteredSites = this.service.infoMaster.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
        this.selectParticipantsOption(4);
        this.getBusinessAppDisablity();
      }

      selectedTest.CoveredBusinessApplication = selectedTest.CoveredBusinessApplication.map((x: any) => {
        let businessApp = this.service.infoMaster.BusinessApplicationsList.find((app: any) => Number(app.BusinessApplicationID) == x.BusinessApplicationID)
        x.connectedBusinessFunctionID = businessApp.AssociatedBussinessFunction[0].BusinessFunctionsID;
        x.connectedSiteIDs = businessApp.AssociatedSites.map((site: any) => Number(site.SiteID));
        return x;
      });

      this.businessAppParticipants[Number(selectedTest.ParticipantOptionID) - 1].businessApplications = [...JSON.parse(JSON.stringify(selectedTest.CoveredBusinessApplication))];
      this.service.TableBApplicationTest = new MatTableDataSource(addIndex(selectedTest.CoveredBusinessApplication, true));
      this.service.TableBApplicationTest._updateChangeSubscription();
      this.setBusinessApplications(selectedTest.ParticipantOptionID);

      if (selectedTest.TestAssessmentStatusID != 1) {
        this.defineBCMSTestForm.disable();
        this.displayedColumnsBA.pop();
        this.displayedColumnsDS.pop();
      }
  }

  setValidatorNDisable() {
    this.defineBCMSTestForm.get('participantGroup.specificSite')?.disable();
    this.defineBCMSTestForm.get('participantGroup.bussinessFun')?.disable();
    this.defineBCMSTestForm.get('participantGroup.customSites')?.disable();
  }

  selectParticipantsOption(participantId: any) {
    this.showBANotification();
    this.submittedPG = false;
    this.blockEditBA = false;
    this.getBusinessAppDisablity();
    this.setValidatorNDisable()
    this.defineBCMSTestForm.controls['bussinessApplications'].reset();
    this.defineBCMSTestForm.get('participantGroup.participants')!.setValue(participantId);

    if (participantId == 2) {
      this.defineBCMSTestForm.get('participantGroup.specificSite')?.enable();
    }
    if (participantId == 3) {
      this.defineBCMSTestForm.get('participantGroup.bussinessFun')?.enable();
    }
    if (participantId == 4) {
      this.defineBCMSTestForm.get('participantGroup.customSites')?.enable();
    }
    this.defineBCMSTestForm.get('participantGroup')!.updateValueAndValidity();
    this.service.TableBApplicationTest = new MatTableDataSource(addIndex([], false));
  }

  clearApplications() {
    this.uniqueBussinessApp = [];
    this.linkedBussinessApp = [];
  }

  setBusinessApplications(participantId: any, event?: any) {
    this.getBusinessAppDisablity();
    let allBusinessApplications = JSON.parse(JSON.stringify(this.service.infoMaster.BusinessApplicationsList));

    if (participantId == 1) {
      this.clearApplications();
      let businessApplication = JSON.parse(JSON.stringify(this.businessAppParticipants[Number(participantId) -1].businessApplications));
      this.service.TableBApplicationTest = new MatTableDataSource(addIndex(businessApplication, false));

      this.uniqueBussinessApp = JSON.parse(JSON.stringify(allBusinessApplications));
      this.linkedBussinessApp = allBusinessApplications.filter((x: any) => !this.service.TableBApplicationTest.data.map(y => y.BusinessApplicationID).includes(x.BusinessApplicationID));
    } else if (participantId == 2 && this.defineBCMSTestForm.get('participantGroup.specificSiteId')?.value && (event?.isUserInput === undefined || event?.isUserInput)) {
      this.clearApplications();
      let businessApplication = JSON.parse(JSON.stringify(this.businessAppParticipants[Number(participantId) -1].businessApplications));
      this.service.TableBApplicationTest = new MatTableDataSource(addIndex(businessApplication, false));

      allBusinessApplications = allBusinessApplications.filter((x: any) => x.AssociatedSites.map((y: any) => Number(y.SiteID)).includes(this.defineBCMSTestForm.get('participantGroup.specificSiteId')?.value));
      this.uniqueBussinessApp = JSON.parse(JSON.stringify(allBusinessApplications));
      this.linkedBussinessApp = allBusinessApplications.filter((x: any) => !this.service.TableBApplicationTest.data.map(y => Number(y.BusinessApplicationID)).includes(Number(x.BusinessApplicationID)));
    } else if (participantId == 3 && (this.selectedBusiness.length > 0) && (event?.isUserInput || event?.isUserInput === undefined)) {
      this.clearApplications();
      let businessApplication = JSON.parse(JSON.stringify(this.businessAppParticipants[Number(participantId) -1].businessApplications));
      this.service.TableBApplicationTest = new MatTableDataSource(addIndex(businessApplication, false));

      allBusinessApplications = allBusinessApplications.filter((x: any) => {
        return x.AssociatedBussinessFunction.some((y: any) => this.selectedBusiness.map((z: any) => Number(z.BusinessFunctionsID)).includes(Number(y.BusinessFunctionsID)))
      });
      this.uniqueBussinessApp = JSON.parse(JSON.stringify(allBusinessApplications));
      this.linkedBussinessApp = allBusinessApplications.filter((x: any) => !this.service.TableBApplicationTest.data.map(y => Number(y.BusinessApplicationID)).includes(Number(x.BusinessApplicationID)));
    } else if (participantId == 4 && (this.selectedSites.length > 0) && (event?.isUserInput || event?.isUserInput === undefined)) {
      this.clearApplications();
      let businessApplication = JSON.parse(JSON.stringify(this.businessAppParticipants[Number(participantId) -1].businessApplications));
      this.service.TableBApplicationTest = new MatTableDataSource(addIndex(businessApplication, false));

      allBusinessApplications = allBusinessApplications.filter((x: any) => {
        return x.AssociatedSites.some((y: any) => this.selectedSites.map((z: any) => Number(z.SiteID)).includes(Number(y.SiteID)))
      });
      this.uniqueBussinessApp = JSON.parse(JSON.stringify(allBusinessApplications));
      this.linkedBussinessApp = allBusinessApplications.filter((x: any) => !this.service.TableBApplicationTest.data.map(y => Number(y.BusinessApplicationID)).includes(Number(x.BusinessApplicationID)));
    }
  }
  // Form Initialization/Updation & validations of Form end
    //-------------------------------------------------------------------------------------------------------------
  // Disruption Scenario Methods - starts
  onChange(event: any) {
    this.disruptionSceExists = this.service.TabledisruptionScenarios.data.some((x: any) => (x.DisruptionScenarioName.trim().toLowerCase() === event.target.value.trim().toLowerCase()) && (!x.isEdit))
  }

  deleteScenario(scenario: any) {
    const index = this.service.TabledisruptionScenarios.data.findIndex(item => item.Index === scenario.Index);
    if (index !== -1)
      this.service.TabledisruptionScenarios.data.splice(index, 1);
    this.service.TabledisruptionScenarios.data = addIndex(this.service.TabledisruptionScenarios.data, false);
    this.service.TabledisruptionScenarios._updateChangeSubscription();
  }

  saveScenario(scenario: any) {
    this.submittedDS = false;
    if (this.disruptionSceExists)
      return
    this.blockEdit = false;
    scenario.isEdit = false;
    this.service.TabledisruptionScenarios.data = this.service.TabledisruptionScenarios.data.map((x: any) =>
      x.Index === scenario.Index ? { ...x, DisruptionScenarioName: this.defineBCMSTestForm.get('scenario')?.value } : x
    );
    this.clearScenarioValidators();
  }

  cancelScenario(scenario: any) {
    this.submittedDS = false;
    this.blockEdit = false;
    this.disruptionSceExists = false;
    this.service.TabledisruptionScenarios.data.forEach((x: any) => { x.isEdit = false });
    if (this.disruptionMode == "Edit" || scenario.DisruptionScenarioID) {
      this.service.TabledisruptionScenarios._updateChangeSubscription();
    } else {
      const index = this.service.TabledisruptionScenarios.data.indexOf(scenario.index);
      this.service.TabledisruptionScenarios.data.splice(index, 1);
      this.service.TabledisruptionScenarios._updateChangeSubscription();
    }
    this.disruptionMode = "";
    this.clearScenarioValidators();
  }

  clearScenarioValidators() {
    this.defineBCMSTestForm.get('scenario')?.reset();
    this.defineBCMSTestForm.get('scenario')!.clearValidators();
    this.defineBCMSTestForm.get('scenario')!.setErrors(null);
    this.defineBCMSTestForm.get('scenario')!.updateValueAndValidity();
  }

  checkDSSave(data: any) {
    return data.some((x: any) => x.isEdit);
  }

  addDisruptionSce() {
    this.submittedDS = false;
    this.blockEdit = true;
    this.disruptionMode = "Add";
    this.defineBCMSTestForm.get('scenario')?.reset();
    this.defineBCMSTestForm.get('scenario')!.setValidators([Validators.required]);
    this.service.TabledisruptionScenarios.data.push({ "Index": this.service.TabledisruptionScenarios.data.length + 1, "DisruptionScenarioID": null, "DisruptionScenarioName": "", "isEdit": true });
    this.service.TabledisruptionScenarios._updateChangeSubscription();
    this.scrollDown('disruptionSceScroll');
  }
  // Disruption Scenario Methods - ends
    //-------------------------------------------------------------------------------------------------------------
  // Set BCMS Testing date and time -- start
  checkStartTestDateValidation() {
    this.endTestDateError = false;
    let formTestValue = this.defineBCMSTestForm.value;
    let startDate = this.utils.formatTimeZone(new Date(formTestValue.plannedStartDate)) || '';
    console.log("Start Date : ", startDate);
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    console.log("formated Date : ", formatedToday);
    
    if (startDate < formatedToday)
      this.minStartDateError = true;
    else
      this.minStartDateError = false;

    if (!!formTestValue.plannedEndDate && new Date(formTestValue.plannedEndDate)?.getTime() < new Date(formTestValue.plannedStartDate)?.getTime())
      this.endTestDateError = true;
    else
      this.endTestDateError = false;
    this.checkStartTestTimeValidation();
  }

  checkEndTestDateValidation() {
    this.endTestDateError = false;
    let formTestValue = this.defineBCMSTestForm.value;
    let endDate = this.utils.formatTimeZone(new Date(formTestValue.plannedEndDate)) || '';
    let formatedToday = this.utils.formatTimeZone(new Date()) || '';
    if (endDate < formatedToday)
      this.minEndDateError = true;
    else
      this.minEndDateError = false;

    if (new Date(formTestValue.plannedEndDate)?.getTime() < new Date(formTestValue.plannedStartDate)?.getTime())
      this.endTestDateError = true;
    else
      this.endTestDateError = false;
    this.checkEndTestTimeValidation();
  }

  checkStartTestTimeValidation() {
    const startDate = new Date(this.defineBCMSTestForm.value.plannedStartDate);
    const endDate = new Date(this.defineBCMSTestForm.value.plannedEndDate);
    const startTime = this.defineBCMSTestForm.get('plannedStartTime')!.value;
    const endTime = this.defineBCMSTestForm.get('plannedEndTime')!.value;

    if (startDate && endDate && (startDate.getTime() === endDate.getTime()) && startTime && endTime && startTime >= endTime)
      this.endTestTimeError = true;
    else
      this.endTestTimeError = false

    // this.checkTimeDiffValidation();
  }

  checkEndTestTimeValidation() {
    const startDate = new Date(this.defineBCMSTestForm.value.plannedStartDate);
    const endDate = new Date(this.defineBCMSTestForm.value.plannedEndDate);
    const startTime = this.defineBCMSTestForm.get('plannedStartTime')!.value;
    const endTime = this.defineBCMSTestForm.get('plannedEndTime')!.value;

    if (startDate && endDate && (startDate.getTime() === endDate.getTime()) && startTime && endTime && endTime <= startTime)
      this.endTestTimeError = true;
    else
      this.endTestTimeError = false

    // this.checkTimeDiffValidation();
  }

  // checkTimeDiffValidation() {
  //   let formTestValue = this.defineBCMSTestForm.value;
  //   console.log("BCMS Test form Date and Time : ", formTestValue);
  //   // if(formTestValue.plannedStartDate && formTestValue.plannedEndDate && formTestValue.plannedStartTime && formTestValue.plannedEndTime) {
  //   //   this.service.calculateTimeDuration(formTestValue).subscribe((res: any) => {
  //   //     next:
  //   //     if (res.success == 1) {
  //   //       this.timeDiffError = '';
  //   //     } else {
  //   //       if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
  //   //         this.utils.relogin(this._document);
  //   //       else
  //   //         this.timeDiffError = res.error.errorMessage;
  //   //     }
  //   //   });
  //   // }
  // }

  // Set BCMS Testing date and time -- end
    //-------------------------------------------------------------------------------------------------------------
  // Bussiness Applications Methods - starts
  updateStoredBusinessApp() {
    const participantIndex = this.businessAppParticipants.findIndex((participant :any) => participant.participantId == this.defineBCMSTestForm.get('participantGroup.participants')?.value);
    if (participantIndex !== -1) {
      this.businessAppParticipants[participantIndex].businessApplications = [...this.service.TableBApplicationTest.data]
      this.service.TableBApplicationTest._updateChangeSubscription();
    };
  };

  addBusinessApp() {
    this.submittedBA = false;
    this.blockEditBA = true;
    this.service.TableBApplicationTest.data.push({ "Index": this.service.TableBApplicationTest.data.length + 1, "BusinessApplicationID": null, "BusinessApplicationName": "", "connectedBusinessFunctionID": null, "connectedSiteIDs": [], "isEdit": true });
    this.service.TableBApplicationTest._updateChangeSubscription();
    this.scrollDown('busineesAppScroll');
  }

  deleteBusinessApp(app: any) {
    const index = this.service.TableBApplicationTest.data.findIndex(item => item.Index === app.Index);
    if (index !== -1)
      this.service.TableBApplicationTest.data.splice(index, 1);
    this.service.TableBApplicationTest.data = addIndex(this.service.TableBApplicationTest.data, false);
    this.service.TableBApplicationTest._updateChangeSubscription();
    let businessAppIds = this.service.TableBApplicationTest.data.map((x: any) => Number(x.BusinessApplicationID)) || [];
    this.linkedBussinessApp = this.uniqueBussinessApp.filter((x: any) => {
      return !businessAppIds.includes(Number(x.BusinessApplicationID))
    });
    this.updateStoredBusinessApp();
  }

  saveBusinessApp(app: any) {
    this.submittedBA = false;
    this.blockEditBA = false;
    app.isEdit = false;
    this.service.TableBApplicationTest.data = this.service.TableBApplicationTest.data.map((x: any) =>
      x.Index === app.Index ? {
        ...x,
        BusinessApplicationID: this.defineBCMSTestForm.controls['bussinessApplications'].value.applicationId,
        BusinessApplicationName: this.linkedBussinessApp.find((x: any) => x.BusinessApplicationID == this.defineBCMSTestForm.controls['bussinessApplications'].value.applicationId).BusinessApplicationName,
        connectedBusinessFunctionID: Number(this.linkedBussinessApp.find((x: any) => x.BusinessApplicationID == this.defineBCMSTestForm.controls['bussinessApplications'].value.applicationId).AssociatedBussinessFunction[0].BusinessFunctionsID),
        connectedSiteIDs: (this.linkedBussinessApp.find((x: any) => x.BusinessApplicationID == this.defineBCMSTestForm.controls['bussinessApplications'].value.applicationId).AssociatedSites).map((site: any) => Number(site.SiteID))
      } : x
    );
    this.defineBCMSTestForm.controls['bussinessApplications'].reset();
    let businessAppIds = this.service.TableBApplicationTest.data.map((x: any) => Number(x.BusinessApplicationID)) || [];
    this.linkedBussinessApp = this.uniqueBussinessApp.filter((x: any) => !businessAppIds.includes(Number(x.BusinessApplicationID)));
    this.updateStoredBusinessApp();
  }

  cancelBusinessApp(app: any) {
    this.submittedBA = false;
    this.blockEditBA = false;
    this.service.TableBApplicationTest.data.forEach((x: any) => { x.isEdit = false });
    if (this.businessAppMode == "Edit" || app.BusinessApplicationID) {
      this.service.TableBApplicationTest._updateChangeSubscription();
    } else {
      const index = this.service.TableBApplicationTest.data.indexOf(app.index);
      this.service.TableBApplicationTest.data.splice(index, 1);
      this.service.TableBApplicationTest._updateChangeSubscription();
    }
    this.businessAppMode = "";
    this.defineBCMSTestForm.controls['bussinessApplications'].reset();
  }

  getBusinessAppDisablity() {
    if (this.defineBCMSTestForm.get('participantGroup.participants')?.value == 1 ||
      (this.defineBCMSTestForm.get('participantGroup.participants')?.value == 2 && this.defineBCMSTestForm.get('participantGroup.specificSiteId')?.value) ||
      (this.defineBCMSTestForm.get('participantGroup.participants')?.value == 3 && this.selectedBusiness?.length > 0) ||
      (this.defineBCMSTestForm.get('participantGroup.participants')?.value == 4 && this.selectedSites?.length > 0)) {
      return false;
    } else {
      return true;
    }
  }

  // Bussiness Applications Methods - ends
    //---------------------------------------------------------------------------------------------
  // Validate and add/update BCMS Test -- Methods - starts
  checkTestObsDerivedSelected() {
    if (!this.defineBCMSTestForm.get('testObserverGUID')?.value && this.defineBCMSTestForm.get('testObserver')?.value?.length > 0) {
      this.isTestObsExists = true;
      return true;
    }
    return false;
  }

  ValidateForm() : void {
    this.submitted = true;
    this.submittedPG = true;
    this.submittedDS = true;
    this.submittedBA = true;
    this.checkTestObsDerivedSelected();

    if(this.defineBCMSTestForm.invalid || this.endTestTimeError || this.endTestDateError || this.testExists || this.timeDiffError || this.isTestObsExists)
      return;
    if((this.defineBCMSTestForm.get('participantGroup.participants')?.value == 2) && !this.defineBCMSTestForm.get('participantGroup.specificSite')?.value)
      return;
    if((this.defineBCMSTestForm.get('participantGroup.participants')?.value == 3) && this.selectedBusiness?.length == 0)
      return;
    if((this.defineBCMSTestForm.get('participantGroup.participants')?.value == 4) && this.selectedSites?.length == 0)
      return;
    if(this.service.TabledisruptionScenarios.data?.length == 0 || this.service.TableBApplicationTest.data?.length == 0)
      return;
    if(this.checkDSSave(this.service.TableBApplicationTest.data))
      return;

    this.addUpdateBCMSTest();
  }

  addUpdateBCMSTest(): void {
    this.service.addUpdateBCMSTest(this.parent.testMode, this.defineBCMSTestForm.value, (this.parent.testMode == 'Add') ? null : this.parent.testData.TestAssessmentID, this.selectedBusiness, this.selectedSites, this.parent.selectedTest).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess(this.parent.testMode == 'Add' ? "BCMS Test Created Successfully" : "BCMS Test Updated Successfully");
        this.dialogRef.close(true);
        this.resetForm();
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }
  // Validate and add/update BCMS Test -- Methods - ends

  // Reset -- Methods - starts
  resetForm(): void {
    this.submitted = false;
    this.submittedPG = false;
    this.submittedBA = false;
    this.submittedDS = false;
    this.isTestObsExists = false;
    this.filteredTestObsList = [];
    this.disruptionMode = '';
    this.blockEdit = false;
    this.disruptionSceExists = false;
    this.businessAppMode = '';
    this.blockEditBA = false;
    this.linkedBussinessApp = [];
    this.filteredBusiness = [];
    this.selectedBusiness = [];
    this.filteredSites = [];
    this.selectedSites = [];
    this.service.TabledisruptionScenarios = new MatTableDataSource();
    this.service.TableBApplicationTest = new MatTableDataSource();
    this.displayedColumnsDS = ['Index', 'DisruptionScenarioName', 'Action'];
    this.displayedColumnsBA = ['Index', 'ApplicationName', 'Action'];
    this.defineBCMSTestForm.reset()
  }

  // Common Methods below (Save Sucess , Auto Scroll) -- start
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


  //Length Check
  checkLength(title: string){
    return extentedTitle(title,50)
  }

  checkTitleLength(){
    let patchedValue = this.parent.testData;
    if (patchedValue.TestingScenario?.length > 50){
      return patchedValue.TestingScenario
    } else {
      return ''
    }
  }

  checkTestScenarioCharacters(){
    return this.parent.testData?.TestingScenario?.length > 200
  }

}
