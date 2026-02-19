import { Inject, Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx-js-style';
import { convertTime, formatTimeZone } from 'src/app/includes/utilities/commonFunctions';

export interface criticalBusiness {
  Index: number;
  Description: string;
  isEdit: boolean;
  ActivityID: any;
}

export interface criticalBusinessView {
  Index: number;
  Description: string;
}

export interface criticalBusinessProcess {
  Index: number;
  Description: string;
  affiliationDataStatus: any;
  activityID: any;
  isEdit: boolean;
}

export interface criticalBusinessProcessView {
  Index: number;
  Description: string;
  affiliationDataStatus: any;
}

export interface processActivityList {
  Index: number;
  BusinessProcessID: any;
  Name: string;
  Description: string;
  SubBusinessProcessId: any;
  isEdit: boolean;
}

export interface technologyDependency {
  ID: any
  Index: any;
  BusinessApplication: any;
  Description: string;
  isEdit: boolean;
}

export interface technologyDependencyView {
  Id: any
  Index: any;
  BusinessApplication: any;
  Description: string;
}

export interface riskManagement {
  Index: number;
  PotentialData: any;
  AffectedProcess: string;
  Impact: string;
  Likelihood: any;
  Risk: string;
  Contingency: string;
  Treatment: string;
  isEdit: boolean;
}
export interface riskManagementBIA {
  Index: number;
  PotentialData: any;
  AffectedProcess: string;
  Impact: string;
  Likelihood: any;
  RiskRating: string;
  Risk:any
  Contingency: string;
  Treatment: string;
  isEdit: boolean;
}

export interface riskManagementView {
  Index: number;
  PotentialData: any;
  AffectedProcess: string;
  Impact: string;
  Likelyhood: any;
  Risk: string;
  Contingency: string;
  Treatment: string;
}

export interface process {
  Index: number;
  Activity: any;
  Dependency: string;
  Function: string;
  Type: any;
  SubActivityID: any
  SubActivity: any;
  ProcessID: any
}

export interface processView {
  Index: number;
  Activity: any;
  Dependency: string;
  Function: string;
  Type: any;
  SubActivityID: any
  SubActivity: any;
  ProcessID: any
}

export interface supplier {
  Index: number;
  Dependency: string;
  Supplier: string;
  Type: any;
  SubActivityID: any
  SubActivity: any;
  ProcessID: any;
}

export interface supplierView {
  Index: number;
  Dependency: string;
  Supplier: string;
  Type: any;
  SubActivityID: any
  SubActivity: any;
  ProcessID: any;
}

export interface staffDetails {
  Index: number;
  CallID: any;
  CallOrder: any;
  CallOrder1: any;
  Role: any;
  CallInitiator: any;
  Mobile: any;
  Residence: any;
  CallReceiver: any;
  DesignationC: any;
  DesignationR: any;
  MobileR: any;
  ResidenceR: any;
  isEdit: boolean;
}

export interface staffDetailsView {
  Index: number;
  CallID: any;
  CallOrder: any;
  CallOrder1: any;
  Role: any;
  CallInitiator: any;
  Mobile: any;
  Residence: any;
  CallReceiver: any;
  DesignationC: any;
  DesignationR: any;
  MobileR: any;
  ResidenceR: any;
}

export interface resourceReqList {
  Index: number;
  BusinessProcessId: any;
  SubBusinessProcessName: string;
  SubActivityID: any
  RecordType: string;
  MediaType: string;
  AlternateSource: string
  vitalId: any;
  isEdit: boolean;
}

export interface criticalEqu {
  Index: number;
  BusinessProcessId: any;
  Equipment: string;
  Description: any
  TotalCount: string;
  MinimumCount: string;
  criticalId: any;
  isEdit: boolean;
}

export interface recoveryList {
  Index: number;
  BusinessProcessName: any;
  BusinessProcessId: any;
  Who: string;
  WhoId: string;
  When: any
  Where: string;
  SubBusinessProcesses: string;
  isEdit: boolean;
}

// Call ID Call Order Role Call Initiator Designation Mobile Residence Call Receiver Designation Mobile Residence
@Injectable({
  providedIn: 'root'
})

export class BusinessContinuityPlansService extends RestService {

  public selectedBusinessFunction: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedBCC: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public selectedBusinessContinuityID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public listingPage: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public reviewListSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotReviewMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public processActivitySubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public processBusinessMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public processDependencySubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public processRiskSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public impactAssSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public processStaffSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public resourceReqSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public recoveryProSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public sectionSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public TableCB!: MatTableDataSource<criticalBusiness>;
  public TableCBV!: MatTableDataSource<criticalBusinessView>;
  public TableCBP!: MatTableDataSource<criticalBusinessProcess>;
  public TablePA!: MatTableDataSource<processActivityList>;
  public TableTD!: MatTableDataSource<technologyDependency>;
  public TableTDV!: MatTableDataSource<technologyDependencyView>;
  public TableRM!: MatTableDataSource<riskManagement>;
  public TableRMBIA!: MatTableDataSource<riskManagementBIA>;

  public TableRMV!: MatTableDataSource<riskManagementView>;
  public TableIP!: MatTableDataSource<process>;
  public TableIPV!: MatTableDataSource<processView>;
  public TableSD!: MatTableDataSource<supplier>;
  public TableSDV!: MatTableDataSource<supplierView>;
  public TableSCD!: MatTableDataSource<staffDetails>;
  public TableSCDV!: MatTableDataSource<staffDetailsView>;
  public TableVR!: MatTableDataSource<resourceReqList>;
  public TableCE!: MatTableDataSource<criticalEqu>;
  public TableRS!: MatTableDataSource<recoveryList>;
  public TableCBPV!: MatTableDataSource<criticalBusinessProcessView>;

  public masterData: any;
  public reviewList: any;
  public masterReviewData: any
  public processActivity: any;
  public processBusinessDetails: any
  public processDependenciesData: any
  public processRiskData: any
  public impactAssObj: any;
  public processStaffData: any;
  public listingPageDetails: any;
  public resourceReqObj: any;
  public recoveryProObj: any;
  public businessContinutyID: any;
  public allSectionSave: any;

  public dataSaved: boolean = false;
  public dataDepSaved: boolean = false;
  public dataRiskSaved: boolean = false;
  public dataStaffSaved: boolean = false;
  public dataProcessSaved: boolean = false;
  public dataImpactSaved: boolean = false;
  public dataResourceSaved: boolean = false;
  public dataRecoverySaved: boolean = false;

  processData: any;
  impactData: any;
  ResourceData: any;

  // All section Report
  public secondReport: any;
  public secondReportHeader: any[] = []
  public secondFormatedReportData: any[] = [];
  transformedArray: any[] = [];
  headerName: any[] = [];
  impactProcessData: any = [];
  fourthReportHeader: any[] = [];
  fourthFormatedReportData: any[] = [];
  sixthReportHeader: any[] = []
  sixthFormatedReportData: any[] = [];
  rowCounts: any[] = [];
  rowCountsSix: any[] = [];
  eighthReportHeader: any[] = [];
  eighthFormatedReportData: any[] = [];
  tableData: any;
  period: any;
  temp: any;
  fourthReport: any;
  subProcessList: any;
  impactDropDownList: any;
  businessProcessList: any;
  ProcessList: any;
  impactMasterList: any;
  sixthReport: any;
  eighthReport: any;
  processListhree: any;

  impactPeriod = [
    { Period: "<2 hrs", PeriodDesc: "LessThanTwoHours" },
    { Period: "2-4 hrs", PeriodDesc: "TwoToFourHours" },
    { Period: "4-8 hrs", PeriodDesc: "FourToEightHours" },
    { Period: "1 day", PeriodDesc: "OneDay" },
    { Period: "2 days", PeriodDesc: "TwoDays" },
    { Period: "3-5 days", PeriodDesc: "ThreeToFiveDays" },
    { Period: ">5 days", PeriodDesc: "GreaterThanFiveDays" }
  ]

  constructor(
    private datePipe: DatePipe,
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getBusinessContinuityList() {
    if (environment.dummyData) {
      this.processBusinessList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BusinessContinuityPlansList": [{
            "BusinessFunctionID": 1,
            "BusinessFunctionName": "Management",
            "BusinessGroupID": 1,
            "BusinessGroup": "Finance",
            "MTPDID": 1,
            "MTPDValue": 20,
            "RTOID": 2,
            "RTOValue": 24,
            "RPOID": 1,
            "RPOValue": 15,
            "FBCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "FBCCName": "Test FBCC name",
            "BCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "BCCName": "Test BCC name",
            "DocStatusID": 3,
            "DocStatus": "Published",
            "NextReviewDate": "2024-02-10T16:21:07.803Z"
          },
          {
            "BusinessFunctionID": 2,
            "BusinessFunctionName": "Management Data",
            "BusinessGroupID": 3,
            "BusinessGroup": "Finance dpt",
            "MTPDID": 1,
            "MTPDValue": 20,
            "RTOID": 2,
            "RTOValue": 24,
            "RPOID": 1,
            "RPOValue": 15,
            "FBCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "FBCCName": "Test FBCC name",
            "BCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "BCCName": "Test BCC name",
            "DocStatusID": 3,
            "DocStatus": "Published",
            "NextReviewDate": "2024-02-10T16:21:07.803Z"
          }],

          "BCPSectionsList": [{
            "SectionID": 1,
            "Section": "Business Function Profile",
          },
          {
            "SectionID": 2,
            "Section": "Process / Activities Details",
          },
          {
            "SectionID": 3,
            "Section": "Dependencies",
          },
          {
            "SectionID": 4,
            "Section": "Impact Assessment",
          },
          {
            "SectionID": 5,
            "Section": "Risk Mitigation",
          },
          {
            "SectionID": 6,
            "Section": "Resource Requirements",
          },
          {
            "SectionID": 7,
            "Section": "Staff Contact Details",
          },
          {
            "SectionID": 8,
            "Section": "Recovery Process",
          }]

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-business-continuity-plans-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBusinessList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBusinessList(res: any) {
    this.masterData = res.result;
    this.gotMaster.next(true);
  }

  getBusinessContinuityReviewList() {
    if (environment.dummyData) {
      this.processBusinessReviewList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BusinessContinuityPlansList": [{
            "BusinessContinuityPlanID": 1,
            "BusinessFunctionID": 2,
            "BusinessFunctionName": "Credit Administration And Control",
            "BusinessGroupID": 1,
            "BusinessGroup": "Finance",
            "MTPDID": 1,
            "MTPDValue": 2,
            "RTOID": 2,
            "RTOValue": 24,
            "RPOID": 1,
            "RPOValue": 2,
            "FBCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "FBCCName": "Tamer Badhduh",
            "BCCID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "BCCName": "Tamer Badhduh",
            "DocStatusID": 2,
            "DocStatus": "Under Review",
            "ReviewCompletionDate": "2024-02-22 16:21:07.803",
            "ReviewStatusID": 1,
            "ReviewStatus": "Awaiting Submission"
          }],

          "BCPSectionsList": [{
            "SectionID": 1,
            "Section": "Business Function Profile",
          },
          {
            "SectionID": 2,
            "Section": "Process / Activities Details",
          },
          {
            "SectionID": 3,
            "Section": "Dependencies",
          },
          {
            "SectionID": 4,
            "Section": "Impact Assessment",
          },
          {
            "SectionID": 5,
            "Section": "Risk Mitigation",
          },
          {
            "SectionID": 6,
            "Section": "Resource Requirements",
          },
          {
            "SectionID": 7,
            "Section": "Staff Contact Details",
          },
          {
            "SectionID": 8,
            "Section": "Recovery Process",
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-plans/get-business-continuity-plans-review-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBusinessReviewList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBusinessReviewList(res: any) {
    this.masterReviewData = res.result;
    this.gotReviewMaster.next(true);
  }

  //page 96 Initiate BCP

  getBusinessFunReviewList() {
    if (environment.dummyData) {
      this.processBussFunReview({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "reviewList": [{
            "BusinessFunctionID": 1,
            "BusinessFunctionName": "Management",
            "LastReviewed": "May 20, 2022",
            "IsActive": "yes"
          },
          {
            "BusinessFunctionID": 2,
            "BusinessFunctionName": "Credit Administration & Control",
            "LastReviewed": "May 21, 2022",
            "IsActive": "yes"
          }],
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-initiate-review", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBussFunReview(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBussFunReview(res: any) {
    this.reviewList = res.result;
    this.reviewListSubj.next(true);
  }

  initiateBCP(data: any) {
    return this.post("/business-continuity-management/business-continuity-planning/initiate-review", {
      "data": {
        "BusinessFunctionId": data
      }
    });
  }

  //End of Initiate BCP page 96

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
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

  // page 106 section 1

  getProcessBusinessDetails(BusinessContinuityPlanID: any, FunctionID: any): any {
    if (environment.dummyData) {
      this.processbusiness({
        success: 1,
        message: 'Data fetch from DB successful.',
        result: {
          BusinessContinuityQuestionsList: [
            {
              BusinessContinuityPlanID: 1,
              BusinessFunctionID: 2,
              BusinessFunctionName: 'Credit Administration And Control',
              BusinessGroupID: 1,
              BusinessGroup: 'Finance',
              FBCCID: 2,
              FBCCName: 'Tamer Badhduh',
              BCCID: 3,
              BCCName: 'Tamer Badhduh',

              ProfilingQuestions: [
                {
                  ProfilingQuestionID: 1,
                  ProfilingQuestion:
                    'How long could you operate in a manual mode before systems become available? (Consider the amount of backlogged and missing data.)',
                },
                {
                  ProfilingQuestionID: 2,
                  ProfilingQuestion:
                    'When are the peak loads for your business unit/processes (e.g. day of week, week of month, or month of year)',
                },
              ],

              Affiliation: [
                {
                  AffiliationID: 1,
                  AffiliationName: 'Internal',
                },
                {
                  AffiliationID: 2,
                  AffiliationName: 'External',
                },
              ],
            },
          ],

          BusinessFunctionProfileDetails: [
            {
              BusinessContinuityPlanID: 1,
              BusinessFunctionID: 1,
              BusinessFunctionName: 'Credit Administration And Control',
              BusinessGroupID: 1,
              BusinessGroup: 'Finance',
              FBCCID: '433877BA-CCAA-EE11-B06E-000C296CF4F3',
              FBCCName: 'Fayad bin Bahad',
              BusinessDescription:
                'Booking deals for Corporate: Reviwing the documents and booking the deal Booking deals for Corporate: Reviwing the documents and booking the dealBooking deals for Corporate: Reviwing the documents and booking the dealBooking deals for Corporate: Reviwing the documents and booking the deal',
              BusinessServices:
                'Booking deals for Corporate and Retail, Vault Management, Insurance Management',
              CriticalBusinessActivities: [
                {
                  ActivityID: 1,
                  ActivityName: 'Insurance Management',
                },
                {
                  ActivityID: 2,
                  ActivityName: ' Management',
                }, {
                  ActivityID: 3,
                  ActivityName: 'Insurance Management',
                },
                {
                  ActivityID: 4,
                  ActivityName: ' Management',
                },
              ],
              Customers: [
                {
                  CustomerID: 1,
                  CustomerName: 'Insurance',
                  Affiliate: 'Internal',
                },
                {
                  CustomerID: 2,
                  CustomerName: 'Insurance',
                  Affiliate: 'Internal',
                },
                {
                  CustomerID: 3,
                  CustomerName: 'Insurance',
                  Affiliate: 'Internal',
                },
                {
                  CustomerID: 4,
                  CustomerName: 'Insurance',
                  Affiliate: 'Internal',
                },
              ],
              ProfilingQuestions: [
                {
                  ProfilingQuestionID: 1,
                  ProfilingQuestion:
                    'How long could you operate in a manual mode before systems become available? (Consider the amount of backlogged and missing data.)',
                  ProfilingAnswer:
                    'CAC operations are system base and no manual work can be done except the physical credit and security files in archiving room ( Depends on business call)',
                },
              ],
            },
          ],
        },
        error: {
          errorCode: null,
          errorMessage: null,
        },
        token: '',
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-plans/get-business-profile-questions", {
        data: {
          BusinessContinuityPlanID: BusinessContinuityPlanID,
          BusinessFunctionID: FunctionID
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processbusiness(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processbusiness(res: any) {
    this.processBusinessDetails = res.result;
    let isBCM: any = (localStorage.getItem("IsBCManager"))
    let isBO: any = (localStorage.getItem("IsBusinessOwner"))
    let IsBCCValidUser: any = (localStorage.getItem("IsBCCValidUser"))
    let workFlow: any = (localStorage.getItem("CurrentWorkFlowStatusID"))
    if (IsBCCValidUser == 0 && (workFlow != 7 && workFlow != 2 && workFlow != 1)) {
      this.listingPageDetails = true
    } else if (IsBCCValidUser == 1) {
      this.listingPageDetails = false
    }
    this.dataSaved = this.processBusinessDetails.BusinessFunctionProfileDetails[0]?.IsSaved
    this.processBusinessMaster.next(true);
  }

  addBusinessData(data: any) {
    return this.post(
      '/business-continuity-management/business-continuity-plans/save-business-function-profile',
      { data: data }
    );
  }

  // end of 106 section 1

  // page 107 section 2

  getProcessActivityDetails(BusinessFunctionID: any, BusinessContinuityPlanID: any, SectionID: any) {
    if (environment.dummyData) {
      this.processactivity({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ListingBusinessProcessDetails": [
            {
              "BusinessProcessID": 1,
              "BusinessProcessName": "Insurance Management",
              "BusinessProcessDesc": "iusmod tempor incididunt ut laboreet dolore magna",
              "FacilityName": "Amlak Head Office",
              "NormalWorkingHoursFrom": "8:30am",
              "NormalWorkingHoursTo": "6:30pm",
              "PeakWorkingHoursFrom": "8:30am",
              "PeakWorkingHoursTo": "8:30am",
              "MTPDID": 1,
              "MTPDIName": "Day(s)",
              "MTPDValue": 15,
              "RTOID": 1,
              "RTOName": "Day(s)",
              "RTOValue": 16,
              "RPOID": 1,
              "RPOName": "Day(s)",
              "RPOValue": 12,
              "MACValue": 50,
              "MNPRRemote": 1,
              "MNPROffice": 1,
              "SubProcessActivities": [{ "Name": "Documentation", "Description": "Utullamco laboris nisi ut aliqui" },
              { "Name": "Booking", "Description": "Utullamco laboris nisi ut aliqui" }]
            },
            {
              "BusinessProcessID": 2,
              "BusinessProcessName": "Retail Credit",
              "BusinessProcessDesc": "Retail credit Desc",
              "FacilityName": "Amlak Head Office",
              "NormalWorkingHoursFrom": "8:30am",
              "NormalWorkingHoursTo": "6:30pm",
              "PeakWorkingHoursFrom": "8:30am",
              "PeakWorkingHoursTo": "8:30am",
              "MTPDID": 1,
              "MTPDIName": "Hours",
              "MTPDValue": 20,
              "RTOID": 1,
              "RTOName": "Hours",
              "RTOValue": 16,
              "RPOID": 1,
              "RPOName": "Hours",
              "RPOValue": 12,
              "MACValue": 100,
              "MNPRRemote": 1,
              "MNPROffice": 1,
              "SubProcessActivities": [{ "Name": "Documentation", "Description": "Utullamco laboris nisi ut aliqui" },
              { "Name": "Booking", "Description": "Utullamco laboris nisi ut aliqui" }]
            }],
          "ListingReviewData": [{
            "Status": "Published",
            "StatusID": 3,
            "MTPDID": 1,
            "MTPDValue": 15,
            "RTOID": 1,
            "RTOValue": 16,
            "RPOID": 1,
            "RPOValue": 12,
            "MACValue": 50,
            "MNPRID": 1,
            "MNPRValue": 10,
            "BusinessFunctionProfileID": 5,
            "BusinessFunctionProfileName": "Credit Administration & Control",
          }],
          "ReviewBusinessProcessDetails": [{
            "ScheduleInitiateReviewID": 1,
            "BusinessProcessID": 1,
            "BusinessProcessName": "Retail Booking",
            "BusinessProcessDesc": "",
            "NormalWorkingHours": [{ "TimeId": 1, "Time": "1:pm" }, { "TimeId": 2, "Time": "2:pm" }],
            "PeakWorkingHours": [{ "TimeId": 1, "Time": "N/A" }, { "TimeId": 2, "Time": "4:pm" }, { "TimeId": 3, "Time": "6:pm" }],
            "MTPDId": 1,
            "MTPDIName": "Days",
            "RTOId": 1,
            "RTOName": "Days",
            "RPOId": 1,
            "RPOName": "Days",
            "MACID": "",
            "MACValue": "",
            "MNPRID": "",
            "MNPRValue": "",
            "SubProcessActivities": ""
          },
          {
            "ScheduleInitiateReviewID": 2,
            "BusinessProcessID": 2,
            "BusinessProcessName": "Insurance Management",
            "BusinessProcessDesc": "",
            "NormalWorkingHours": [{ "TimeId": 1, "Time": "1:pm" }, { "TimeId": 2, "Time": "2:pm" }],
            "PeakWorkingHours": [{ "TimeId": 1, "Time": "N/A" }, { "TimeId": 2, "Time": "4:pm" }, { "TimeId": 3, "Time": "6:pm" }],
            "MTPDId": 2,
            "MTPDIName": "Hours",
            "RTOId": 2,
            "RTOName": "Hours",
            "RPOId": 2,
            "RPOName": "Hours",
            "MACID": "",
            "MACValue": "",
            "MNPRID": "",
            "MNPRValue": "",
            "SubProcessActivities": ""
          }],
          "ReviewBusinessProcessList": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management"
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking"
          }],
          "ReviewFacilityDetails": [{ "FacilityId": 1, "FacilityName": "Amlok Head Office" },
          { "FacilityId": 2, "FacilityName": "Banglore Head Office" }]

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-business-process-details", {
        data: {
          BusinessFunctionId: Number(BusinessFunctionID),
          BusinessContinuityPlanID: Number(BusinessContinuityPlanID),
          SectionID: SectionID
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processactivity(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processactivity(res: any) {
    this.processActivity = res.result;
    this.listingPageDetails = this.listingPage.value
    this.businessContinutyID = this.selectedBusinessContinuityID.value
    this.dataProcessSaved = this.processActivity.BusinessProcessDetailsView[0]?.IsSaved
    this.processActivitySubj.next(true);
  }

  getSecondSecDraftData(BusinessFunctionID: any, BusinessContinuityPlanID: any, SectionID: any) {
    this.post("/business-continuity-management/business-continuity-planning/get-business-process-details", {
      data: {
        BusinessFunctionId: Number(BusinessFunctionID),
        BusinessContinuityPlanID: Number(BusinessContinuityPlanID),
        SectionID: SectionID
      }
    }).subscribe(res => {
      next:
      if (res.success == 1) {
        this.processSecondDraftReport(res)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  getTimeFormat(date: any) {
    let dateFormat = formatTimeZone(date)
    let dateData = dateFormat + "T00:00:00.000Z";
    return this.dateToYMd(dateData)
  }

  dateToYMd(date: string) {
    const inputDate = new Date(date);
    return inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  }

  processSecondDraftReport(res: any): any {
    let allDetails = res.result
    this.secondReport = allDetails.BusinessProcessDetailsView
    this.secondReport = this.secondReport.map((x: any) => {
      x.SubProcessName = ((x.SubProcessActivities || []).map((y: any) => y.Name)).join();
      x.SubProcessDescription = ((x.SubProcessActivities || []).map((y: any) => y.Description)).join();
      x.NormalStartHour = convertTime(x.NormalWorkingHoursStart);
      x.NormalEndHour = convertTime(x.NormalWorkingHoursEnd);
      x.concatNormalHours = x.NormalStartHour + ' to ' + x.NormalEndHour;
      x.PeakStatHour = convertTime(x.PeakWorkingHoursStart);
      x.peakEndHour = convertTime(x.PeakWorkingHoursEnd);
      x.concatPeakHours = x.PeakStatHour + ' to ' + x.peakEndHour;
      x.concatMTPD = x.MTPD + ' ' + x.MTPDUnit;
      x.concatRTO = x.RTO + ' ' + x.RTOUnit;
      x.concatRPO = x.RPO + ' ' + x.RPOUnit;
      return x;
    });


    let lastReviewed = localStorage.getItem("LastReviewed");
    let formattedDate = '--';

    if (lastReviewed) {
      let date = new Date(lastReviewed);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        formattedDate = this.getTimeFormat(lastReviewed);
      }
    }

    this.secondReportHeader = [
      ['Department /Section', localStorage.getItem('BusinessFunctionName'), 'Department Head', localStorage.getItem('BusinessOwnerName')],
      ['Coordinator', localStorage.getItem('BCCName'), 'Last Reviewed Date', formattedDate],
      [], [],
      ['Business Process', 'Process Description', 'Sub Processes /Activities', 'Sub Processes /Activities Description', 'MTPD', 'RTO', 'RPO', 'MAC (in %)', 'MNPR (Remote Head Count)', 'MNPR (Office Head Count)',
        'Facility / Premises Required', 'Normal Working Hours', 'Peak Working Hours']]

    this.secondReport.forEach((rec: any) => {
      this.secondFormatedReportData.push(
        [(rec.BusinessProcessName || ''), (rec.BusinessProcessDesc || ''), (rec.SubProcessName || ''), (rec.SubProcessDescription || ''), (rec.concatMTPD || ''), (rec.concatRTO || ''), (rec.concatRPO || ''), (rec.MAC || ''),
        (rec.MNPRRemoteHeadCount || ''), (rec.MNPROfficeHeadCount || ''), (rec.SiteName || ''), (rec.concatNormalHours || ''), (rec.concatPeakHours || '')]
      );
    });

    this.downloadSecReport('Process_Activities_Details Report')
  }

  downloadSecReport(ReportName: string) {
    this.openWait("Downloading...");
    const wb = XLSX.utils.book_new();
    let wbReady: BehaviorSubject<boolean> = new BehaviorSubject(false)

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.secondReportHeader.concat(this.secondFormatedReportData));

    const blackBorderStyle = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
      }
    };

    const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
      initializeCell(ws, cellAddress);
      ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
    };

    const blueHeaderStyle = {
      fill: { fgColor: { rgb: "333399" } },
      font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" },
      ...blackBorderStyle
    };

    // Apply the header styles
    const headerCells = ['A1', 'A2', 'A5', 'B5', 'C1', 'C2', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5', 'L5'];
    headerCells.forEach(cell => applyStyle(ws, cell, blueHeaderStyle));

    ws['!cols'] = [
      { wch: 25 }, { wch: 30 }, { wch: 35 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 25 }, { wch: 25 }
    ];

    // ws['!protect'] = { selectLockedCells: true, selectUnlockedCells: true };
    XLSX.utils.book_append_sheet(wb, ws, ('Business process Details'));

    let FullReportName = ReportName + '_'
      + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.xlsx'
    XLSX.writeFile(wb, FullReportName)
    this.closeWait();

    this.secondReportHeader = [];
    this.secondFormatedReportData = [];

  }

  addUpdateProcessActiviti(id: any, data: any, tableData: any) {
    this.processData = {
      BusinessContinuityPlanId: Number(id),
      BusinessProcesses: [],
      BusinessProcessDescription: null,
      SubBusinessProcesses: []
    }
    data.forEach((item: any) => {
      this.processData['BusinessProcesses'].push({
        "BusinessProcessID": item.BusinessActivityID,
        "BusinessProcessDetailsID": item.BusinessProcessDetailsID,
        "BusinessProcessDesc": item.ActivityDescription,
        "SiteID": item.FacilityID,
        "SiteName": null,
        "NormalWorkingHoursStart": item.NormalWorkingHours,
        "NormalWorkingHoursEnd": item.NormalWorkingHoursTo,
        "PeakWorkingHoursStart": item.PeakWorkingHours,
        "PeakWorkingHoursEnd": item.PeakWorkingHoursTo,
        "MTPD": item.MTPD + "_" + item.MTPDUnit + "_" + ((item.MTPDUnit == "Day(s)") ? (item.MTPD * 24) : item.MTPD),
        "RTO": item.RTO + "_" + item.RTOUnit + "_" + ((item.RTOUnit == "Day(s)") ? (item.RTO * 24) : item.RTO),
        "RPO": item.RPO + "_" + item.RPOUnit + "_" + ((item.RPOUnit == "Day(s)") ? (item.RPO * 24) : item.RPO),
        "MAC": Number(item.MAC),
        "MNPRRemoteHeadCount": Number(item.RemoteLocationID),
        "MNPROfficeHeadCount": Number(item.OfficeLocationID)
      })
    });
    tableData.forEach((rec: any) => {
      this.processData['SubBusinessProcesses'].push({
        "SubProcessId": rec.SubBusinessProcessId ? rec.SubBusinessProcessId : null,
        "SubProcessName": rec.Name,
        "SubProcessDescription": rec.Description,
        "BusinessProcessID": rec.BusinessProcessID
      })
    })
    return this.post('/business-continuity-management/business-continuity-planning/save-process-activity-details', { data: this.processData }
    );
  }

  // End of page 107 section 2

  // Start of page 108 section 3

  getDependenciesInfo(data: any, businessId: any) {
    if (environment.dummyData) {
      this.processDependencies({
        success: 1,
        message: 'Data fetch from DB successful.',
        result: {
          BusinessProcesslist: [
            {
              BusinessActivityID: 1,
              BusinessActivity: 'Insurance Management',
            },
            {
              BusinessActivityID: 2,
              BusinessActivity: 'Retail Booking',
            },
            {
              BusinessActivityID: 3,
              BusinessActivity: 'Vault Management',
            },
          ],

          BusinessApplicationsList: [
            {
              BusinessApplicaionID: 1,
              BusinessApplication: 'Temenos',
            },
            {
              BusinessApplicaionID: 2,
              BusinessApplication: 'Email',
            },
            {
              BusinessApplicaionID: 3,
              BusinessApplication: 'Internet',
            },
          ],

          DependencyTypeList: [
            {
              DependencyID: 1,
              DependencyType: 'Upstream',
            },
            {
              DependencyID: 2,
              Dependency: 'Downstream',
            },
            {
              DependencyID: 3,
              Dependency: 'n/a',
            },
          ],

          DependentFunctionsList: [
            {
              BusinessFunctionID: 1,
              BusinessFunction: 'Collections',
            },
            {
              BusinessFunctionID: 2,
              BusinessFunction: 'Finance',
            },
          ],

          SupplierList: [
            {
              SupplierID: 1,
              SupplierName: 'Tejoury',
            },
            {
              SupplierID: 2,
              SupplierName: 'FinchTech Insurance',
            },
          ],

          BusinessSubActivityLists: [
            {
              SubActivityID: 1,
              BusinessProcessID: 1,
              SubActivityName: 'Declcaration',
            },
            {
              SubActivityID: 2,
              BusinessProcessID: 1,
              SubActivityName: 'Claims',
            },
            {
              SubActivityID: 3,
              BusinessProcessID: 2,
              SubActivityName: 'Invoices',
            },
            {
              SubActivityID: 4,
              BusinessProcessID: 2,
              SubActivityName: 'Insurance Management',
            },
          ],

          DependenciesDetails: [
            {
              BusinessProcessID: 1,
              BusinessProcessName: 'Insurance Management',
              TechnologyDependency: [
                {
                  BusinessApplicationID: 1,
                  BusinessApplicationName: 'Temenos',
                  Description: 'Issuance of invoices',
                },
              ],
              InterdependentProcesses: [
                {
                  ProcessActivityID: 1,
                  ProcessActivityName: 'Booking',
                  Description: 'Issuance of invoices',
                  DependentFunction: 'Finance Dept',
                  DependencyType: "DownStream"
                },
              ],
              SupplierDependency: [
                {
                  SubActivityID: 1,
                  SubActivityName: 'Declaration',
                  Description: 'Insurance for all 3 processes',
                  SupplierID: 1,
                  SupplierName: 'Tejoury',
                  DependentTypeID: 1,
                  DependentTypeName: 'Upstream',
                },
              ],
            },
            {
              BusinessProcessID: 2,
              BusinessProcessName: 'Retail Booking',
              TechnologyDependency: [
                {
                  BusinessApplicationID: 1,
                  BusinessApplicationName: 'TemenosRetails',
                  Description: 'Issuance of invoices',
                },
              ],
              InterdependentProcesses: [
                {
                  ProcessActivityID: 1,
                  ProcessActivityName: 'Booking1',
                  Description: 'Issuance of invoices',
                  DependentFunction: 'Finance Dept',
                  DependencyType: "UPStream"
                },
              ],
              SupplierDependency: [
                {
                  SubActivityID: 1,
                  SubActivityName: 'Declaration',
                  Description: 'Insurance for all 3 processes',
                  SupplierID: 1,
                  SupplierName: 'Tejoury',
                  DependentTypeID: 1,
                  DependentTypeName: 'Upstream',
                },
              ],
            },
          ],
        },
        error: {
          errorCode: null,
          errorMessage: null,
        },
        token: '',
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-plans/get-dependencies-info", {
        data: {
          BusinessContinuityPlanID: data,
          BusinessFunctionID: businessId
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processDependencies(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processDependencies(res: any) {
    this.processDependenciesData = res.result;
    this.businessContinutyID = this.selectedBusinessContinuityID.value
    let isBCM: any = (localStorage.getItem("IsBCManager"))
    let isBO: any = (localStorage.getItem("IsBusinessOwner"))
    let IsBCCValidUser: any = (localStorage.getItem("IsBCCValidUser"))
    let workFlow: any = (localStorage.getItem("CurrentWorkFlowStatusID"))
    if (IsBCCValidUser == 1 && (workFlow != 7 && workFlow != 2 && workFlow != 1)) {
      this.listingPageDetails = false
    } else if (IsBCCValidUser == 0) {
      this.listingPageDetails = true
    }
    this.dataDepSaved = this.processDependenciesData.OriginalDependenciesDetails[0]?.InterDependentProcess[0]?.IsSaved
    this.processDependencySubj.next(true);
  }

  addDependencyData(data: any) {
    return this.post(
      '/business-continuity-management/business-continuity-plans/save-dependencies',
      { data: data }
    );
  }
  // End of page 108 section 3

  // Start of page 109 section 4

  getImpactAssesmentDetails(BusinessFunctionID: any, BusinessContinuityPlanID: any, SectionID: any) {
    if (environment.dummyData) {
      this.processImpactAssess({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BusinessProcessLists": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management",
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking",
          },
          {
            "BusinessProcessID": 3,
            "BusinessProcessName": "Vault Management",
          }],
          "ImpactMasterData": [{
            "ImpactMasterDataID": 1,
            "ImpactMasterData": "Service Delivery Impact"
          },
          {
            "ImpactMasterDataID": 2,
            "ImpactMasterData": "Financial Loss"
          },
          {
            "ImpactMasterDataID": 3,
            "ImpactMasterData": "Regulatory Impact"
          },
          {
            "ImpactMasterDataID": 4,
            "ImpactMasterData": "Reputation Impact"
          },
          {
            "ImpactMasterDataID": 5,
            "ImpactMasterData": "Employee Moral Impact"
          }],
          "ImpactLists": [{
            "ImpactID": 1,
            "ImpactName": "No Impact"
          },
          {
            "ImpactID": 2,
            "ImpactName": "Minor"
          },
          {
            "ImpactID": 3,
            "ImpactName": "Considerable"
          },
          {
            "ImpactID": 4,
            "ImpactName": "Major"
          }],
          "BusinessSubActivityLists": [{
            "SubActivityID": 1,
            "BusinessProcessID": 1,
            "SubActivityName": "Declcaration",
          },
          {
            "SubActivityID": 2,
            "BusinessProcessID": 1,
            "SubActivityName": "Claims",
          },
          {
            "SubActivityID": 3,
            "BusinessProcessID": 2,
            "SubActivityName": "Invoices",
          },
          {
            "SubActivityID": 4,
            "BusinessProcessID": 2,
            "SubActivityName": "Insurance Management",
          }],
          ListingImpactAssessment: [{
            BusinessProcessID: 1,
            BusinessProcessName: "Insurance Management",
            SubProcessActivities: [{ SubActivityName: "Documentation", SubActivityID: 1 }, { SubActivityName: "Claims", SubActivityID: 2 }],
            ImpactData: [
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", LessThanTwoHours: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", TwoToFourHours: 2, "Name": "Minor" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", FourToEightHours: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", OneDay: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", TwoDays: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", ThreeToFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", GreaterThanFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 2, "ImpactMasterData": "Financial Loss", OneDay: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 3, "ImpactMasterData": "Regulatory Impact", TwoDays: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 4, "ImpactMasterData": "Reputation Impact", ThreeToFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 5, "ImpactMasterData": "Employee Moral Impact", GreaterThanFiveDays: 2, "Name": "Minor" }],
          },
          {
            BusinessProcessID: 2,
            BusinessProcessName: "Retail Booking",
            SubProcessActivities: [{ SubActivityName: "Documentation", SubActivityID: 1 }, { SubActivityName: "Claims", SubActivityID: 2 }],
            ImpactData: [
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", LessThanTwoHours: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", TwoToFourHours: 2, "Name": "Minor" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", FourToEightHours: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", OneDay: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", TwoDays: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", ThreeToFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 1, "ImpactMasterData": "Service Delivery Impact", GreaterThanFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 2, "ImpactMasterData": "Financial Loss", OneDay: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 3, "ImpactMasterData": "Regulatory Impact", TwoDays: 1, "Name": "NoImpact" },
              { ImpactMasterDataID: 4, "ImpactMasterData": "Reputation Impact", ThreeToFiveDays: 2, "Name": "Minor" },
              { ImpactMasterDataID: 5, "ImpactMasterData": "Employee Moral Impact", GreaterThanFiveDays: 2, "Name": "Minor" }],
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      })
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-impact-assessment-details", {
        data: {
          BusinessFunctionID: Number(BusinessFunctionID),
          BusinessContinuityPlanId: Number(BusinessContinuityPlanID),
          SectionID: SectionID
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processImpactAssess(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processImpactAssess(res: any) {
    this.impactAssObj = res.result;
    this.listingPageDetails = this.listingPage.value;
    this.dataImpactSaved = this.impactAssObj.impactAssementList[0]?.ImpactMasterData[0]?.IsSaved;
    this.impactAssSubj.next(true);
  }

  addUpdateImpactAss(obj: any) {
    return this.post('/business-continuity-management/business-continuity-planning/save-impact-assessmentdetails', { data: obj }
    );
  }

  // End of page 109 section 4

  // Start of page 110 section 5

  getRiskInfo(data: any, businessId: any) {
    if (environment.dummyData) {
      this.processRisk({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {

          "AffectedProcesslist": [{
            "BusinessActivityID": 1,
            "BusinessActivity": "Insurance Management"
          },
          {
            "BusinessActivityID": 2,
            "BusinessActivity": "Retail Booking"
          },
          {
            "BusinessActivityID": 3,
            "BusinessActivity": "Coorporate Booking"
          }],

          "ImpactList": [{
            "ImpactID": 1,
            "Impact": "Minor"
          },
          {
            "ImpactID": 2,
            "Impact": "Moderate"
          },
          {
            "ImpactID": 3,
            "Impact": "Major"
          }],
          "LikelihoodList": [{
            "LikelihoodID": 1,
            "Likelihood": "Low"
          },
          {
            "LikelihoodID": 2,
            "Likelihood": "Medium"
          },
          {
            "LikelihoodID": 1,
            "Likelihood": "High"
          }],

          "RiskMitigationLists": [{
            "RiskMitigatonID": 1,
            "PotentialFailure": "testing for potential failure",
            "AffectedProcess": "Retail Booking",
            "ImpactID": 1,
            "Impact": "Minor",
            "LikelihoodID": 2,
            "Likelihood": "Medium",
            "Risk": "Medium",
            "ContingencyMeasures": "sed du eisumod tempor incidunt uf labouri et dolore magna aliqua",
            "TreatmentPlan": "lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempo"
          },
          {
            "RiskMitigatonID": 2,
            "PotentialFailure": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu",
            "AffectedProcess": "Corporate Booking",
            "ImpactID": "2",
            "Impact": "Medium",
            "LikelihoodID": 3,
            "Likelihood": "High",
            "Risk": "High",
            "ContingencyMeasures": "Proper unit testing must be done",
            "TreatmentPlan": "some predefined test cases needs to be followed for treatment"
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-plans/get-risk-mitigation-info", {
        data: {
          BusinessContinuityPlanID: data,
          BusinessFunctionID: businessId
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRisk(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processRisk(res: any) {
    this.processRiskData = res.result;
    let isBCM: any = (localStorage.getItem("IsBCManager"))
    let isBO: any = (localStorage.getItem("IsBusinessOwner"))
    let IsBCCValidUser: any = (localStorage.getItem("IsBCCValidUser"))
    let workFlow: any = (localStorage.getItem("CurrentWorkFlowStatusID"))
    if (IsBCCValidUser == 1 && (workFlow != 7 && workFlow != 2 && workFlow != 1)) {
      this.listingPageDetails = false
    } else if (IsBCCValidUser == 0) {
      this.listingPageDetails = true
    }
    this.dataRiskSaved = this.processRiskData?.RiskMitigationLists[0]?.IsSaved
    this.processRiskSubj.next(true);
  }

  getOverallRiskRating(data: any) {
    return this.post("/business-continuity-management/business-continuity-plans/get-overall-risk-rating", { data: data });
  }

  addRiskMitigation(data: any) {
    return this.post(
      '/business-continuity-management/business-continuity-plans/save-risk-mitigation',
      { data: data }
    );
  }

  // End of page 110 section 5

  // Start of page 111 section 6

  getResourceReqDetails(BusinessFunctionID: any, BusinessContinuityPlanID: any, SectionID: any) {
    if (environment.dummyData) {
      this.processResourceReq({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ReviewResourceRequirements": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management"
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking"
          }],
          "ReviewBusinessSubActivityList": [{
            "SubActivityID": 1,
            "BusinessProcessID": 1,
            "SubActivityName": "Declcaration",
          },
          {
            "SubActivityID": 2,
            "BusinessProcessID": 1,
            "SubActivityName": "Claims",
          },
          {
            "SubActivityID": 3,
            "BusinessProcessID": 2,
            "SubActivityName": "Invoices",
          },
          {
            "SubActivityID": 4,
            "BusinessProcessID": 2,
            "SubActivityName": "Insurance Management",
          }],
          "ReviewMediaTypeList": [{
            "MediaTypeID": 1,
            "MediaTypeName": "Electronical & Physical"
          },
          {
            "MediaTypeID": 2,
            "MediaTypeName": "Electronical"
          }],
          "ReviewAlternateSourceList": [{
            "AlternateSourceID": 1,
            "AlternateSourceName": "Data backup"
          },
          {
            "AlternateSourceID": 2,
            "AlternateSourceName": "Cloud Storage"
          }],
          "ReviewEquipmentList": [{
            "EquipmentID": 1,
            "EquipmentName": "PC"
          },
          {
            "EquipemntID": 2,
            "EquipmentName": "Printer"
          }],
          "ListingResourceRequirements": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management",
            "VitalRecords": [{
              "SubActivityID": 1,
              "SubActivityName": "Declcaration",
              "RecordType": "System generated monthly declaration for the new customers",
              "MediaType": "Electronical & Physical",
              "AlternateSource": "Data Backup"
            }],
            "CriticalEquipmentSupplies": [{
              "Equipment": "PC",
              "Description": "Desktop computers for data entry",
              "TotalCount": 4,
              "MinimumCount": 20
            }]
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking",
            "VitalRecords": [{
              "SubActivityID": 2,
              "SubActivityName": "Claims",
              "RecordType": "System generated",
              "MediaType": "Electronical",
              "AlternateSource": "Data Backup"
            }],
            "CriticalEquipmentSupplies": [{
              "Equipment": "PCM",
              "Description": "Desktop computers",
              "TotalCount": 5,
              "MinimumCount": 10
            }]
          }],
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-resource-requirement-details", {
        data: {
          BusinessFunctionID: Number(BusinessFunctionID),
          BusinessContinuityPlanID: Number(BusinessContinuityPlanID),
          SectionID: SectionID
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processResourceReq(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processResourceReq(res: any) {
    this.resourceReqObj = res.result;
    this.listingPageDetails = this.listingPage.value
    this.dataResourceSaved = this.resourceReqObj.criticalEquipmentList[0]?.CriticalEquipmentSupplies[0]?.IsSaved
    this.resourceReqSubj.next(true);
  }

  addUpdateResource(plan: any, pro: any, bf: any, output: any) {
    this.ResourceData = {
      BusinessContinuityPlanId: Number(plan),
      BusinessFunctionID: Number(bf),
      VitalRecords: [],
      CriticalEquipmentSupplies: []
    }
    pro.forEach((item: any) => {
      this.ResourceData['VitalRecords'].push({
        "BusinessProcessID": item.BusinessProcessId ? item.BusinessProcessId : null,
        "VitalRecordsId": item.VitalRecordsId ? item.VitalRecordsId : null,
        "SubActivityID": item.SubBusinessProcessId,
        "RecordType": item.RecordType,
        "MediaType": item.MediaTypeID,
        "AlternateSource": item.AlternateSourceID
      })
    });
    output.forEach((rec: any) => {
      this.ResourceData['CriticalEquipmentSupplies'].push({
        "CriticalEquipmentSuppliesID": rec.CriticalEquipmentSuppliesID ? rec.CriticalEquipmentSuppliesID : null,
        "BusinessProcessID": rec.BusinessProcessId ? rec.BusinessProcessId : null,
        "EquipmentID": rec.EquipmentID,
        "Description": rec.Description,
        "TotalCount": Number(rec.TotalCount),
        "MinimumCount": Number(rec.MinimumCount)
      })
    })
    return this.post('/business-continuity-management/business-continuity-planning/save-resource-requirements-details', { data: this.ResourceData }
    );
  }

  // End of page 111 section 6

  // Start of page 112 section 7

  getStaffInfo(data: any, businessId: any) {
    if (environment.dummyData) {
      this.processStaff({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {

          "RoleList": [{
            "RoleID": 1,
            "Role": "FBCC Team"
          }],

          "StaffUserDetails": [{
            "UserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "UserName": "Tameer Badhduh",
            "Designation": "CAC, Asst.Manager",
            "Mobile": "8542157985",
            "Residence": "Saudi Arabia"
          },
          {
            "UserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E2",
            "UserName": "Fahad bin Dhayan",
            "Designation": "CAC Manager",
            "Mobile": 6542154872,
            "Residence": "Mecca"
          }],

          "StaffContactLists": [{
            "StaffContactID": 1,
            "CallID": 1,
            "CallIDName": "CAC",
            "CallOrder": "CG",
            "CallOrderOne": "CAC",
            "RoleID": 1,
            "Role": "FBCC Team",
            "CallInitiator": "Mansoor Qureshi",
            "InitiatorDesignation": "Corporate Sr. RM",
            "InitiatorMobile": "05405277288",
            "InitiatorResidence": "n/a",
            "CallReceiver": "Tamer Badhduh",
            "ReceiverDesignation": "AGM, CAC",
            "ReceiverMobile": "0540509848",
            "ReceiverResidence": "n/a"
          },
          {
            "StaffContactID": 2,
            "CallID": 2,
            "CallIDName": "CAC1",
            "CallOrder": "CAC",
            "CallOrderOne": "CAC1",
            "RoleID": 2,
            "Role": "Alternate FBCC Team",
            "CallInitiator": "Tamer Badhduh",
            "InitiatorDesignation": "AGM, CAC",
            "InitiatorMobile": "0540509848",
            "InitiatorResidence": "n/a",
            "CallReceiver": "Fahad Bin Dhayan",
            "ReceiverDesignation": "CAC Mgr",
            "ReceiverMobile": "05405033213",
            "ReceiverResidence": "n/a"
          }]


        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-plans/get-staff-contact-info", {
        data: {
          BusinessContinuityPlanID: data,
          BusinessFunctionID: businessId
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processStaff(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processStaff(res: any) {
    this.processStaffData = res.result;
    let isBCM: any = (localStorage.getItem("IsBCManager"))
    let isBO: any = (localStorage.getItem("IsBusinessOwner"))
    let IsBCCValidUser: any = (localStorage.getItem("IsBCCValidUser"))
    let workFlow: any = (localStorage.getItem("CurrentWorkFlowStatusID"))
    if (IsBCCValidUser == 1 && (workFlow != 7 && workFlow != 2 && workFlow != 1)) {
      this.listingPageDetails = false
    } else if (IsBCCValidUser == 0) {
      this.listingPageDetails = true
    }
    this.dataStaffSaved = this.processStaffData?.StaffContactLists[0]?.IsSaved
    this.processStaffSubj.next(true);
  }

  addStaffContact(data: any) {
    return this.post(
      '/business-continuity-management/business-continuity-plans/save-staff-contact',
      { data: data }
    );
  }

  // End of page 112 section 7

  // Start of page 113 section 8

  getRecoveryProcessDetails(BusinessFunctionID: any, BusinessContinuityPlanID: any, SectionID: any) {
    if (environment.dummyData) {
      this.processRecoveryPro({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ListingRecoveryProcessList": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management",
            "MTPD": "10 day",
            "MTPDValue": 10,
            "UserName": "Jami Pavan",
            "Activities": [{ "ActivityID": 1, "ActivityName": "Declaration" }, { "ActivityID": 2, "ActivityName": "Claims" }],
            "SiteName": "",
            "SiteID": null,
            "SitePlace": "Remote Site"
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking",
            "MTPD": "1 day",
            "MTPDValue": 10,
            "UserName": "Nandan",
            "Activities": [{ "ActivityID": 1, "ActivityName": "Declaration" }, { "ActivityID": 2, "ActivityName": "Claims" }],
            "SiteName": "Riyadh Office",
            "SiteID": 1,
            "SitePlace": "Alternate Site"
          }],
          "ListingStaffRequirement": [{
            "DayOne": 9,
            "DayTwo": 5,
            "DayThree": 4,
            "DayFour": 5,
            "DayFive": 4,
            "Total": 9,
            "WorkingRemotely": 5,
            "Onpremise": 4
          }],
          "ReviewRecoveryProcessList": [{
            "BusinessProcessID": 1,
            "BusinessProcessName": "Insurance Management",
            "MTPD": "within 1 day",
            "UserName": "Jami  Pavan"
          },
          {
            "BusinessProcessID": 2,
            "BusinessProcessName": "Retail Booking",
            "MTPD": "1 day",
            "UserName": "Jami  Pavan"
          }],
          "ReviewSiteList": [{
            "SiteID": 1,
            "SiteName": "AMLKA HO",
          },
          {
            "SiteID": 2,
            "SiteName": "AMLAK DR",
          }],
          "ReviewUserList": [{
            "UserGUID": "433877BA-CCAA-EE11-B06E-000C296CF4F3",
            "UserName": "Jami  Pavan"
          },
          {
            "UserGUID": "C36C2AB8-50D5-EE11-B0AA-000C296CF4F3",
            "UserName": "Shwetha  "
          },
          {
            "UserGUID": "E10F1050-578B-ED11-BAC6-000C29A8F9E1",
            "UserName": "devtest2  devtest2last"
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/business-continuity-planning/get-recovery-process-details", {
        data: {
          BusinessFunctionID: Number(BusinessFunctionID),
          BusinessContinuityPlanId: Number(BusinessContinuityPlanID),
          SectionID: SectionID
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRecoveryPro(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processRecoveryPro(res: any) {
    this.recoveryProObj = res.result;
    this.listingPageDetails = this.listingPage.value
    this.dataRecoverySaved = this.recoveryProObj.staffRequirementDetails[0]?.IsSaved
    this.recoveryProSubj.next(true);
  }

  addUpdateRecovery(plan: any, bf: any, output: any, recovery: any, sub: any) {
    this.ResourceData = {
      BusinessContinuityPlanId: Number(plan),
      BusinessFunctionID: Number(bf),
      RecoveryStaffRequirement: output,
      RecoveryStrategies: [],
      SubBusinessProcesses: sub
    }
    recovery.forEach((rec: any) => {
      this.ResourceData['RecoveryStrategies'].push({
        "BusinessProcessID": rec.BusinessId ? rec.BusinessId : rec.BusinessProcessId,
        "RecoveryStrategiesId": rec.RecoveryStrategiesId ? rec.RecoveryStrategiesId : null,
        "UserGUID": rec.WhoId ? rec.WhoId : rec.WhoGUID,
        "Trigger": rec.When,
        "SiteID": rec.Where === 'Alternate Site' ? (rec.Where + "_" + rec.Site) : rec.Where
      })
    })

    return this.post('/business-continuity-management/business-continuity-planning/save-recovery-process-details', { data: this.ResourceData }
    );
  }

  // End of page 113 section 8

  addIndex(docs: any, addEditMode: any) {
    let Index = 1;
    docs?.forEach((data: any) => {
      data.Index = Index;
      Index++;
    });
    return docs;
  }

  //All section details

  allSectionDetails(BusinessContinuityPlanID: any, BusinessFunctionID: any): any {
    this.post("/business-continuity-management/business-continuity-plans/get-complete-BCP-details", {
      data: {
        BusinessFunctionID: Number(BusinessFunctionID),
        BusinessContinuityPlanID: Number(BusinessContinuityPlanID),
      }
    }).subscribe(res => {
      next:
      if (res.success == 1) {
        this.processSection(res)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  processSection(data: any) {
    this.allSectionSave = data.result
    this.sectionSubj.next(true);
  }

  reviewComment(data: any) {
    return this.post(
      '/business-continuity-management/business-continuity-planning/get-review-comments',
      { data: data }
    );
  }

  /**
   * Fetches BIA Rating master data from the database
   * Returns: { id, value, description } for each rating (Low, Medium, High)
   */
  getBIARatingMasterData() {
    return this.post(
      '/business-continuity-management/business-continuity-planning/get-bia-rating-master-data',
      {},
      false // Don't show wait dialog for this call
    );
  }

  getTitleValue(title: any) {
    return title?.length > 20 ? ((title).substring(0, 20) + '...') : title;
  }

  getTitleListValue(title: any) {
    return title?.length > 10 ? ((title).substring(0, 10) + '...') : title;
  }

  // All section Export draft

  headerList(res: any) {
    this.headerName = res.result.impactMasterList.map((impactName: any) => impactName.ImpactMasterData)
    this.period = this.impactPeriod.map((p: any) => p.Period)
    this.transformedArray = this.addEmptyStrings(this.headerName, 6);
  }

  duplicatePeriod() {
    let lenHeader = this.headerName.length;
    this.temp = Array.from({ length: lenHeader }, () => this.period).flat();
  }

  getSubProcess(processId: any) {
    return this.subProcessList.filter((sub: any) => sub.BusinessProcessId == processId).map((x: any) => x.SubBusinessProcessName).join(', ');
  }

  getImpactId(impact: any) {
    return this.impactDropDownList.find((x: any) => x.ImpactName == impact).ImpactID;
  }

  getImpactAssessments() {
    this.businessProcessList.forEach((eachProcess: any) => {
      let formatedProcessData = [];
      formatedProcessData = [eachProcess.BusinessProcessName, this.getSubProcess(eachProcess.BusinessProcessId)];
      let impactAssementProcessData = this.fourthReport.filter((x: any) => x.BusinessProcessID == eachProcess.BusinessProcessId) || [];
      this.impactMasterList.forEach((eachImpact: any) => {
        let eachImpactData = impactAssementProcessData.find((x: any) => x.ImpactId == eachImpact.ImpactMasterDataID);
        let impactData = [this.getImpactId(eachImpactData.LessThanTwoHours),
        this.getImpactId(eachImpactData.TwoToFourHours),
        this.getImpactId(eachImpactData.FourToEightHours),
        this.getImpactId(eachImpactData.OneDay),
        this.getImpactId(eachImpactData.TwoDays),
        this.getImpactId(eachImpactData.ThreeToFiveDays),
        this.getImpactId(eachImpactData.GreaterThanFiveDays),
        ];
        formatedProcessData.push(impactData);
      });
      formatedProcessData = formatedProcessData.flat();
      this.impactProcessData.push(formatedProcessData)
    });
  }

  addEmptyStrings(array: string[], count: number): string[] {
    let result: string[] = [];
    array.forEach(item => {
      result.push(item);
      for (let i = 0; i < count; i++) {
        result.push('');
      }
    });
    return result;
  }

  getPropertyValue(property: any, data: any) {
    return data[property];
  }

  parsedHTML(text: any) {
    const dom = new DOMParser().parseFromString('<!doctype html><body>' + text, 'text/html');
    const decodedString = dom.body.textContent;
    return decodedString;
  }

  exportDraft(BusinessFunctionID: any, BusinessContinuityPlanID: any) {
    this.post("/business-continuity-management/business-continuity-planning/get-complete-bcp-draft-report", {
      data: {
        BusinessFunctionID: Number(BusinessFunctionID),
        BusinessContinuityPlanID: BusinessContinuityPlanID,
      }
    }).subscribe(res => {
      next:
      if (res.success == 1) {
        const workbook = XLSX.utils.book_new();
        const sheet1Data = this.firstSecDraft(res);
        const sheet2Data = this.secondSecDraft(res);
        const sheet4Data = this.fourthSecDraft(res);
        const sheet6Data = this.sixthSecDraft(res);
        const sheet8Data = this.eighthSecDraft(res);

        if (sheet1Data && Array.isArray(sheet1Data) && sheet1Data.length > 0) {
          const sheet1 = XLSX.utils.aoa_to_sheet(sheet1Data);
          XLSX.utils.book_append_sheet(workbook, sheet1, 'Business Function Profile');

          // Assign values
          sheet1['D5'] = { t: 's', v: this.tableData.BusinessFunctionName || '', s: { alignment: { wrapText: true } } };
          sheet1['J5'] = { t: 's', v: this.tableData.BusinessOwnerName || '', s: { alignment: { wrapText: true } } };
          sheet1['D6'] = { t: 's', v: this.tableData.BCCNames || '', s: { alignment: { wrapText: true } } };
          let lastReviewed = localStorage.getItem("LastReviewed");
          let formattedDate = '--';

          if (lastReviewed) {
            let date = new Date(lastReviewed);

            // Check if the date is valid
            if (!isNaN(date.getTime())) {
              formattedDate = this.getTimeFormat(lastReviewed);
            }
          }

          sheet1['J6'] = { t: 's', v: formattedDate };

          // worksheet['J6'] = { t: 's', v: localStorage.getItem("LastReviewed") == null ? '--' : this.getTimeFormat(localStorage.getItem("LastReviewed")) };
          sheet1['B9'] = { t: 's', v: this.parsedHTML(this.tableData.BusinessDescription) || '', s: { alignment: { wrapText: true } } };
          sheet1['B12'] = { t: 's', v: this.parsedHTML(this.tableData.BusinessServices) || '', s: { alignment: { wrapText: true } } };

          // Merge ranges
          sheet1['!merges'] = [
            { s: { r: 2, c: 1 }, e: { r: 2, c: 13 } },
            { s: { r: 3, c: 1 }, e: { r: 3, c: 13 } },
            { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
            { s: { r: 4, c: 3 }, e: { r: 4, c: 6 } },
            { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } },
            { s: { r: 5, c: 3 }, e: { r: 5, c: 6 } },
            { s: { r: 4, c: 7 }, e: { r: 4, c: 8 } },
            { s: { r: 5, c: 7 }, e: { r: 5, c: 8 } },
            { s: { r: 4, c: 9 }, e: { r: 4, c: 13 } },
            { s: { r: 5, c: 9 }, e: { r: 5, c: 13 } },
            { s: { r: 7, c: 1 }, e: { r: 7, c: 13 } },
            { s: { r: 8, c: 1 }, e: { r: 8, c: 13 } },
            { s: { r: 10, c: 1 }, e: { r: 10, c: 13 } },
            { s: { r: 9, c: 1 }, e: { r: 9, c: 13 } },
            { s: { r: 11, c: 1 }, e: { r: 11, c: 13 } },
            { s: { r: 12, c: 1 }, e: { r: 12, c: 13 } },
            { s: { r: 13, c: 1 }, e: { r: 13, c: 13 } },
            { s: { r: 14, c: 1 }, e: { r: 14, c: 13 } },
            { s: { r: 15, c: 1 }, e: { r: 15, c: 13 } },

          ];

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' };
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style };
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          const questionHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            ...blackBorderStyle
          };

          const cellsToStyle = [
            'B3', 'B5', 'B6', 'C6', 'H5', 'H6',
            'B8', 'B11', 'B13', 'B15'
          ];

          cellsToStyle.forEach(cell => applyStyle(sheet1, cell, blueHeaderStyle));

          const startRow = 18;
          const increment = 3;
          for (let i = 0; i < this.tableData.ProfilingQuestions.length; i++) {
            const targetRow = startRow + i * increment;
            sheet1['!merges'].push({ s: { r: targetRow, c: 1 }, e: { r: targetRow, c: 13 } });
            sheet1['!merges'].push({ s: { r: targetRow - 1, c: 1 }, e: { r: targetRow - 1, c: 13 } })
              ;
            applyStyle(sheet1, `B${targetRow}`, questionHeaderStyle);
          }

          const addCriticalBusinessActivities = (data: any[]) => {
            let startRow = 14;
            sheet1[`B${startRow}`] = { t: 's', v: data };
            return startRow + data.length;
          };

          const nextRowAfterActivities = addCriticalBusinessActivities(
            this.tableData.CriticalBusinessActivities.map((x: any, index: any) => `${index + 1}. ${x.Description}`).join(', ')
          );

          const addCustomer = (data: any[]) => {
            let startRow = 16;
            sheet1[`B${startRow}`] = { t: 's', v: data };
            return startRow + data.length;
          };

          const nextRowAfterCust = addCustomer(
            this.tableData.Customers.map((x: any, index: any) => index + 1 + '. ' + x.Description + '(' + x.Affiliate + ')').join(', ')
          );

          const profileQuest = nextRowAfterCust + 3;

          sheet1['!cols'] = [
            { wch: 5 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }
          ];
          sheet1['!rows'] = [
            { hpt: 20 },  // Row 1 height
            { hpt: 30 },  // Row 2 height
            { hpt: 30 },  // Row 3 height
            { hpt: 10 },  // Row 1 height
            { hpt: 30 },  // Row 2 height
            { hpt: 30 },  // Row 1 height
            { hpt: 20 },  // Row 2 height
            { hpt: 20 },  // Row 4 height
            { hpt: 30 },  // Row 5 height
            { hpt: 10 },  // Des,
            { hpt: 25 },  // Row 6 height
            { hpt: 25 },  // Row 6 height
            { hpt: 25 },  // Row 6 height
            { hpt: 25 },  // Row 6 height
            { hpt: 20 },
            { hpt: 20 },
            { hpt: 20 },
            { hpt: 20 },
            { hpt: 20 },
            { hpt: 20 },
            { hpt: 20 },
          ];
        } else {
          console.error('exportDraft1 did not return a valid 2D array');
        }
        // Ensure that sheet1Data is a valid 2D array
        if (sheet2Data && Array.isArray(sheet2Data) && sheet2Data.length > 0) {
          const sheet2 = XLSX.utils.aoa_to_sheet(sheet2Data);
          XLSX.utils.book_append_sheet(workbook, sheet2, 'Process or Activity Details');

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };
          // const ws: XLSX.WorkSheet
          // Apply the header styles
          const headerCells = ['A1', 'A2', 'A5', 'B5', 'C1', 'C2', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5', 'K5', 'L5', 'M5'];
          headerCells.forEach(cell => applyStyle(sheet2, cell, blueHeaderStyle));

          sheet2['!cols'] = [
            { wch: 25 }, { wch: 30 }, { wch: 35 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }
          ];

          this.secondReportHeader = [];
          this.secondFormatedReportData = [];

        } else {
          console.error('processSecondDraftReport did not return a valid 2D array');
        }
        const sheet3Data = this.thirdSecDraft(res);
        if (sheet3Data && Array.isArray(sheet3Data) && sheet3Data.length > 0) {
          const sheet3 = XLSX.utils.aoa_to_sheet(sheet3Data);
          let lastReviewed = localStorage.getItem("LastReviewed");
          let formattedDate = '--';

          if (lastReviewed) {
            let date = new Date(lastReviewed);

            // Check if the date is valid
            if (!isNaN(date.getTime())) {
              formattedDate = this.getTimeFormat(lastReviewed);
            }
          }

          sheet3['B1'] = { t: 's', v: localStorage.getItem("BusinessFunctionName"), s: { alignment: { wrapText: true } } };
          sheet3['B2'] = { t: 's', v: localStorage.getItem("BCCName"), s: { alignment: { wrapText: true } } };
          sheet3['D1'] = { t: 's', v: localStorage.getItem("BusinessOwnerName"), s: { alignment: { wrapText: true } } };
          sheet3['D2'] = { t: 's', v: formattedDate, s: { alignment: { wrapText: true } } };

          let startRow = 6;
          sheet3["!merges"] = [];

          for (let i = 0; i < this.rowCounts.length; i++) {
            let startR = startRow;
            let endR = startRow + this.rowCounts[i] - 1;

            sheet3["!merges"].push({
              s: { c: 0, r: startR },
              e: { c: 0, r: endR }
            });

            startRow = endR + 1;
          }

          sheet3['!merges'].push(
            { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
            { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
            { s: { r: 4, c: 3 }, e: { r: 4, c: 6 } },
            { s: { r: 4, c: 7 }, e: { r: 4, c: 10 } }
          );

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          const headerCells = ['A2', 'A1', 'B6', 'C2', 'C1', 'A5', 'B5', 'C5', 'C6', 'D5', 'D6', 'E5', 'E6', 'F5', 'F6', 'G5', 'G6', 'H5', 'H6', 'I5', 'I6', 'J5', 'J6', 'K5', 'K6', 'L5', 'L6', 'M5', 'M6'];
          headerCells.forEach(cell => applyStyle(sheet3, cell, blueHeaderStyle));

          sheet3['!cols'] = [
            { wch: 25 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }
          ];
          XLSX.utils.book_append_sheet(workbook, sheet3, 'Dependency');
        } else {
          console.error('exportDraft did not return a valid 2D array');
        }
        if (sheet4Data && Array.isArray(sheet4Data) && sheet4Data.length > 0) {
          const sheet4 = XLSX.utils.aoa_to_sheet(sheet4Data);
          XLSX.utils.book_append_sheet(workbook, sheet4, 'Impact Assessment');

          sheet4["!merges"] = [];

          for (let i = 0; i < this.impactMasterList.length; i++) {
            let startC = 2 + i * 7;
            let endC = startC + 7 - 1;

            sheet4["!merges"].push({
              s: { c: startC, r: 11 },
              e: { c: endC, r: 11 }
            });
          }

          const headerCellStyle = {
            font: { color: { rgb: "FFFFFF" }, bold: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '333399' } },  // Header background color
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } }, // Top border
              bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
              left: { style: 'thin', color: { rgb: '000000' } }, // Left border
              right: { style: 'thin', color: { rgb: '000000' } }, // Right border
            },
          };

          const headerCellStyle1 = {
            font: { color: { rgb: "000000" }, bold: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'FFFFFF' } },  // Header background color
            alignment: { horizontal: "left", vertical: "Left" },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } }, // Top border
              bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
              left: { style: 'thin', color: { rgb: '000000' } }, // Left border
              right: { style: 'thin', color: { rgb: '000000' } }, // Right border
            },
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          this.fourthReportHeader.forEach((headers: any, rows: any) => {
            // Check if any of the conditions match
            const conditionMet = rows === 0 || rows === 1 || rows === 5 || rows === 6 || rows === 7 || rows === 8

            this.fourthReportHeader[rows].forEach((header: any, i: any) => {
              const cellAddress = XLSX.utils.encode_cell({ r: rows, c: i });

              // Apply the appropriate style based on the condition
              // if (conditionMet) {
              //   sheet4[cellAddress].s = headerCellStyle1;
              // } else {
              //   sheet4[cellAddress].s = headerCellStyle;
              // }
              if (conditionMet) {
                applyStyle(sheet4, cellAddress, headerCellStyle1);
              } else {
                applyStyle(sheet4, cellAddress, headerCellStyle);
              }
            });
          });

          const wscols = this.fourthReportHeader[0].map((col: string, i: number) => {
            const dataWidth = Math.max(
              col.length,
              ...this.fourthFormatedReportData.map((row: any) => (row[i] ? String(row[i]).length : 0))
            );

            const columnWidth = dataWidth > 45 ? 45 : dataWidth;

            return {
              wch: columnWidth,
              s: {
                ...(dataWidth > 45 && { alignment: { wrapText: true } }),
              },
            };
          });

          sheet4['!cols'] = wscols;

          const wscols1 = this.fourthReportHeader[0].map((col: string, i: number) => {
            if (col && col.length > 0) {
              return {
                wch: 10,
                alignment: { vertical: 'top' }
              };
            }
            return wscols[i]
          });

          const statusStyles: any = [{ fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '05d005' } } }, { fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'f5f52c' } } },
          { fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'f11414' } } }]
          for (var i in sheet4) {
            if (typeof sheet4[i] != 'object') continue;
            let cell = XLSX.utils.decode_cell(i);

            if (cell.r >= 5) {
              if (cell.c >= 1) {
                if (sheet4[i].v == 1) {
                  sheet4[i].s = statusStyles[0];
                } else if (sheet4[i].v == 2) {
                  sheet4[i].s = statusStyles[1];
                } else if (sheet4[i].v == 3 || sheet4[i].v == 4) {
                  sheet4[i].s = statusStyles[2];
                }
              }

              if (!sheet4[i].s) {
                sheet4[i].s = {};
              }
              sheet4[i].s.alignment = {
                ...(sheet4[i].s.alignment || {}),
                wrapText: true,
              };
            }
          }

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          // Apply the header styles
          const headerCells = ['A1', 'A2', 'A5', 'C1', 'C2'];
          headerCells.forEach(cell => applyStyle(sheet4, cell, blueHeaderStyle));

          sheet4['!cols'] = [
            { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }
          ];

          this.fourthReportHeader = [];
          this.impactProcessData = [];
          this.fourthFormatedReportData = [];

        } else {
          console.error('processSecondDraftReport did not return a valid 2D array');
        }

        const sheet5Data = this.fifthSecDraft(res);
        if (sheet5Data && Array.isArray(sheet5Data) && sheet5Data.length > 0) {
          const sheet5 = XLSX.utils.aoa_to_sheet(sheet5Data);

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          // Apply the header styles
          const headerCells = ['A2', 'A1', 'C2', 'C1', 'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5'];
          headerCells.forEach(cell => applyStyle(sheet5, cell, blueHeaderStyle));

          // Set column widths and row heights
          sheet5['!cols'] = [
            { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 40 }, { wch: 25 }
          ];
          // Set specific cell values
          let lastReviewed = localStorage.getItem("LastReviewed");
          let formattedDate = '--';

          if (lastReviewed) {
            let date = new Date(lastReviewed);

            // Check if the date is valid
            if (!isNaN(date.getTime())) {
              formattedDate = this.getTimeFormat(lastReviewed);
            }
          }

          sheet5['B1'] = { t: 's', v: localStorage.getItem("BusinessFunctionName"), s: { alignment: { wrapText: true } } };
          sheet5['B2'] = { t: 's', v: localStorage.getItem("BCCName"), s: { alignment: { wrapText: true } } };
          sheet5['D1'] = { t: 's', v: localStorage.getItem("BusinessOwnerName"), s: { alignment: { wrapText: true } } };
          sheet5['D2'] = { t: 's', v: formattedDate, s: { alignment: { wrapText: true } } };

          XLSX.utils.book_append_sheet(workbook, sheet5, 'Risk Mitigation');
        } else {
          console.error('exportDraft did not return a valid 2D array');
        }
        if (sheet6Data && Array.isArray(sheet6Data) && sheet6Data.length > 0) {
          const sheet6 = XLSX.utils.aoa_to_sheet(sheet6Data);
          XLSX.utils.book_append_sheet(workbook, sheet6, 'Resource Requirement');
          sheet6["!merges"] = [
            XLSX.utils.decode_range("A5:A6"),
            XLSX.utils.decode_range("B5:E5"),
            XLSX.utils.decode_range("F5:I5"),
          ];

          const centerAlignmentStyle = {
            alignment: { vertical: 'center' }
          };

          sheet6['!merges'].forEach((range: XLSX.Range) => {
            for (let R = range.s.r; R <= range.e.r; ++R) {
              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                sheet6[cellAddress].s = centerAlignmentStyle;
              }
            }
          });

          let startRow = 6;
          for (let i = 0; i < this.rowCountsSix.length; i++) {
            let startR = startRow;
            let endR = startRow + this.rowCountsSix[i] - 1;

            sheet6["!merges"].push({
              s: { c: 0, r: startR },
              e: { c: 0, r: endR }
            });

            startRow = endR + 1;
          }

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          // Apply the header styles
          const headerCells = ['A1', 'A2', 'A5', 'A6', 'B5', 'B6', 'C1', 'C2', 'C5', 'C6', 'D5', 'D6', 'E5', 'E6', 'F5', 'F6', 'G5', 'G6', 'H5', 'H6', 'I5', 'I6'];
          headerCells.forEach(cell => applyStyle(sheet6, cell, blueHeaderStyle));

          sheet6['!cols'] = [
            { wch: 30 }, { wch: 30 }, { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 25 }, { wch: 25 }, { wch: 22 }, { wch: 22 }
          ];

          this.sixthReportHeader = [];
          this.sixthFormatedReportData = [];

        } else {
          console.error('processSecondDraftReport did not return a valid 2D array');
        }

        const sheet7Data = this.seventhSecDraft(res);
        if (sheet7Data && Array.isArray(sheet7Data) && sheet7Data.length > 0) {
          const sheet7 = XLSX.utils.aoa_to_sheet(sheet7Data);

          // Styles and formatting
          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          // Apply the header styles
          const headerCells = ['A2', 'A1', 'C2', 'C1', 'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', "I5", "J5", "K5", "L5"];
          headerCells.forEach(cell => applyStyle(sheet7, cell, blueHeaderStyle));

          // Set column widths and row heights
          sheet7['!cols'] = [
            { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 40 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }
          ];

          // Set specific cell values
          let lastReviewed = localStorage.getItem("LastReviewed");
          let formattedDate = '--';

          if (lastReviewed) {
            let date = new Date(lastReviewed);

            // Check if the date is valid
            if (!isNaN(date.getTime())) {
              formattedDate = this.getTimeFormat(lastReviewed);
            }
          }

          sheet7['B1'] = { t: 's', v: localStorage.getItem("BusinessFunctionName"), s: { alignment: { wrapText: true } } };
          sheet7['B2'] = { t: 's', v: localStorage.getItem("BCCName"), s: { alignment: { wrapText: true } } };
          sheet7['D1'] = { t: 's', v: localStorage.getItem("BusinessOwnerName"), s: { alignment: { wrapText: true } } };
          sheet7['D2'] = { t: 's', v: formattedDate, s: { alignment: { wrapText: true } } };


          XLSX.utils.book_append_sheet(workbook, sheet7, 'Staff Contact');
        } else {
          console.error('exportDraft did not return a valid 2D array');
        }
        if (sheet8Data && Array.isArray(sheet8Data) && sheet8Data.length > 0) {
          const sheet8 = XLSX.utils.aoa_to_sheet(sheet8Data);
          XLSX.utils.book_append_sheet(workbook, sheet8, 'Recovery Process');

          const blackBorderStyle = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };

          const initializeCell = (ws: XLSX.WorkSheet, cellAddress: string) => {
            if (!ws[cellAddress]) {
              ws[cellAddress] = { t: 's', v: '' }; // Initialize the cell as a string type with an empty value
            }
          };

          const applyStyle = (ws: XLSX.WorkSheet, cellAddress: string, style: any) => {
            initializeCell(ws, cellAddress);
            ws[cellAddress].s = { ...ws[cellAddress].s, ...style }; // Merge existing style with new style
          };

          const blueHeaderStyle = {
            fill: { fgColor: { rgb: "333399" } },
            font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
            alignment: { horizontal: "center", vertical: "center" },
            ...blackBorderStyle
          };

          // Apply the header styles
          const headerCells = ['A1', 'A2', 'A5', 'A9', 'B5', 'B9', 'C1', 'C2', 'C5', 'C9', 'D5', 'D9', 'E5', 'E9', 'F5', 'G5', 'H5', 'I5'];
          headerCells.forEach(cell => applyStyle(sheet8, cell, blueHeaderStyle));

          sheet8['!cols'] = [
            { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 50 }, { wch: 50 }
          ];
          this.eighthReportHeader = [];
          this.eighthFormatedReportData = [];
        } else {
          console.error('processSecondDraftReport did not return a valid 2D array');
        }

        XLSX.writeFile(workbook, 'BCP_Draft_Report (' + localStorage.getItem('BusinessFunctionName') + ').xlsx');
        console.log('Excel file created with multiple sheets.');
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });

  }

  firstSecDraft(res: any): any[][] {
    this.tableData = res?.result.BusinessFunctionProfileDetails[0] || [];
    let proQuestions: any[] = [];

    proQuestions.push([],
      [],
      ["", "Business Area Understanding"],
      [],
      ["", "Business Function", "", "", "", "", "", "Business Owner", "", "", ""],
      ["", "BC Coordinator", "", "", "", "", "", "Last Reviewed Date", "", "", ""],
      [""],
      ["", "Description of Business"],
      [""],
      [],
      ["", "Business Products/Services"],
      ["", "[List of products or services]"],
      ["", "Critical Business Processes/Activities"],
      [],
      ["", "Customers"],
      [],
      []
    );

    this.tableData.ProfilingQuestions.forEach((n: any, index: any) => {
      proQuestions.push(["", index + 1 + ". " + n.ProfilingQuestion], ["", n.ProfilingAnswer], []);
    });
    return proQuestions;
  }

  secondSecDraft(res: any): any[][] {
    let allDetails = res.result;
    this.secondReport = allDetails.BusinessProcessDetailsView.map((x: any) => {
      x.SubProcessName = ((x.SubProcessActivities || []).map((y: any) => y.Name)).join(", ");
      x.SubProcessDescription = ((x.SubProcessActivities || []).map((y: any) => y.Description)).join(", ");
      x.NormalStartHour = convertTime(x.NormalWorkingHoursStart);
      x.NormalEndHour = convertTime(x.NormalWorkingHoursEnd);
      x.concatNormalHours = x.NormalStartHour + ' to ' + x.NormalEndHour;
      x.PeakStatHour = convertTime(x.PeakWorkingHoursStart);
      x.peakEndHour = convertTime(x.PeakWorkingHoursEnd);
      x.concatPeakHours = x.PeakStatHour + ' to ' + x.peakEndHour;
      x.concatMTPD = x.MTPD + ' ' + x.MTPDUnit;
      x.concatRTO = x.RTO + ' ' + x.RTOUnit;
      x.concatRPO = x.RPO + ' ' + x.RPOUnit;
      return x;
    });

    let lastReviewed = localStorage.getItem("LastReviewed");
    let formattedDate = '--';
    if (lastReviewed) {
      let date = new Date(lastReviewed);
      if (!isNaN(date.getTime())) {
        formattedDate = this.getTimeFormat(lastReviewed);
      }
    }

    this.secondReportHeader = [
      ['Business Function', localStorage.getItem('BusinessFunctionName'), 'Business Owner', localStorage.getItem('BusinessOwnerName')],
      ['BC Coordinator', localStorage.getItem('BCCName'), 'Last Reviewed Date', formattedDate],
      [], [],
      ['Business Process', 'Process Description', 'Sub Processes /Activities', 'Sub Processes /Activities Description', 'MTPD', 'RTO', 'RPO', 'MAC (in %)', 'MNPR (Remote Head Count)', 'MNPR (Office Head Count)',
        'Facility / Premises Required', 'Normal Working Hours', 'Peak Working Hours']
    ];

    this.secondFormatedReportData = this.secondReport.map((rec: any) => [
      rec.BusinessProcessName || '',
      rec.BusinessProcessDesc || '',
      rec.SubProcessName || '',
      rec.SubProcessDescription || '',
      rec.concatMTPD || '',
      rec.concatRTO || '',
      rec.concatRPO || '',
      rec.MAC || '',
      rec.MNPRRemoteHeadCount || '',
      rec.MNPROfficeHeadCount || '',
      rec.SiteName || '',
      rec.concatNormalHours || '',
      rec.concatPeakHours || ''
    ]);

    // Return the combined header and formatted data
    return this.secondReportHeader.concat(this.secondFormatedReportData);
  }

  thirdSecDraft(res: any): any[][] {
    this.processListhree = res.result.BusinessProcesslist;
    this.tableData = res.result.OriginalDependenciesDetails[0] || [];

    let reportData: any[] = [];
    // this,rowCounts: any = []; // Array defining the number of rows to merge in each block

    this.processListhree.forEach((eachProcess: any) => {
      let filteredIDP = (res.result.OriginalDependenciesDetails[0].InterDependentProcess || []).filter((x: any) => x.ProcessID == eachProcess.BusinessActivityID);
      let filteredSD = (res.result.OriginalDependenciesDetails[0].SupplierDependencies || []).filter((x: any) => x.ProcessID == eachProcess.BusinessActivityID);
      let filteredTD = (res.result.OriginalDependenciesDetails[0].TechnologyDependencies || []).filter((x: any) => x.ID == eachProcess.BusinessActivityID);
      let maxValue = Math.max(filteredIDP.length, filteredSD.length, filteredTD.length);
      this.rowCounts.push(maxValue);

      for (let i = 0; i < maxValue; i++) {
        reportData.push([
          eachProcess.BusinessActivity,
          (i < filteredTD.length) ? this.getPropertyValue('BusinessApplication', filteredTD[i]) : '',
          (i < filteredTD.length) ? this.getPropertyValue('Description', filteredTD[i]) : '',
          (i < filteredIDP.length) ? this.getPropertyValue('SubActivity', filteredIDP[i]) : '',
          (i < filteredIDP.length) ? this.getPropertyValue('Dependency', filteredIDP[i]) : '',
          (i < filteredIDP.length) ? this.getPropertyValue('Function', filteredIDP[i]) : '',
          (i < filteredIDP.length) ? this.getPropertyValue('Type', filteredIDP[i]) : '',
          (i < filteredSD.length) ? this.getPropertyValue('SubActivity', filteredSD[i]) : '',
          (i < filteredSD.length) ? this.getPropertyValue('Dependency', filteredSD[i]) : '',
          (i < filteredSD.length) ? this.getPropertyValue('Supplier', filteredSD[i]) : '',
          (i < filteredSD.length) ? this.getPropertyValue('Type', filteredSD[i]) : ''
        ]);
      }
    });

    let headerData = ([
      // [],
      ["Business Function", "", "Business Owner", "", "", ""],
      ["BC Coordinator", "", "Last Reviewed Date", "", "", ""],
      [],
      // [],
      [],
      ["Business Process/Activity", "IT / Technology Dependency", "", "Interdependent Processes", "", "", "", "Supplier Dependencies", "", "", ""],
      ["", "IT / Business Application", "Description", "Sub-process / activity", "Description of dependency", "Dependent Function", "Dependency Type", "Sub-process / activity", "Description of dependency", "Supplier", "Dependency Type"]
    ]);

    const worksheetData = headerData.concat(reportData);
    return worksheetData;
  }

  fourthSecDraft(res: any): any[][] {
    this.subProcessList = res.result.subProcessList
    this.businessProcessList = res.result.businessProcessList
    this.impactDropDownList = res.result.impactDropDownList
    this.fourthReport = res.result.impactAssementList[0]?.ImpactMasterData;
    this.impactMasterList = res.result.impactMasterList;
    this.headerList(res);
    this.duplicatePeriod();
    this.getImpactAssessments();

    let result: any = {};

    // Use forEach to process each item in the array
    this.subProcessList.forEach((item: any) => {
      const { BusinessProcessId, BusinessProcessName, SubBusinessProcessName } = item;

      // Initialize the entry for the BusinessProcessId if it doesn't exist
      if (!result[BusinessProcessId]) {
        result[BusinessProcessId] = {
          BusinessProcessName: BusinessProcessName,
          SubBusinessProcessNames: []
        };
      }

      // Add the SubBusinessProcessName to the appropriate BusinessProcessId
      result[BusinessProcessId].SubBusinessProcessNames.push(SubBusinessProcessName);
    });

    this.fourthReport.push(result)
    let lastReviewed = localStorage.getItem("LastReviewed");
    let formattedDate = '--';

    if (lastReviewed) {
      let date = new Date(lastReviewed);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        formattedDate = this.getTimeFormat(lastReviewed);
      }
    }

    this.fourthReportHeader = [
      ['Business Function', localStorage.getItem('BusinessFunctionName'), 'Business Owner', localStorage.getItem('BusinessOwnerName')],
      ['BC Coordinator', localStorage.getItem('BCCName'), 'Last Reviewed Date', formattedDate],
      [], [], ['Value'], ['1', 'No Impact'], ['2', 'Minor'], ['3', 'Considerable'], ['4', 'Major'], [], [],
      ['Business Process', 'Sub Processes', this.transformedArray],
      ['', '', this.temp]]

    this.fourthReportHeader[11] = this.fourthReportHeader[11].flat(); // Flattening the 4th array
    this.fourthReportHeader[12] = this.fourthReportHeader[12].flat();

    // Return the combined header and formatted data
    return this.fourthReportHeader.concat(this.impactProcessData);
  }

  fifthSecDraft(res: any): any[][] {
    this.tableData = res.result?.RiskMitigationLists || [];

    this.secondReport = this.tableData.map((x: any) => ({
      PotentialData: x.PotentialData || '',
      AffectedProcess: x.AffectedProcess || '',
      Impact: x.Impact,
      Likelihood: x.Likelihood,
      Risk: x.Risk,
      Contingency: x.Contingency,
      Treatment: x.Treatment
    }));

    // Define header data
    const headerData = [
      // [],
      ["Business Function", "", "Business Owner", "", "", ""],
      ["BC Coordinator", "", "Last Reviewed Date", "", "", ""],
      [],
      [],
      ["#", "Risk / Potential Failure", "Affected Process", "Impact", "Likelihood", "Risk", "Contingency Measures in place", "Treatment plan"]
    ];

    // Convert secondReport to array of arrays
    const reportData = this.secondReport.map((rec: any, index: any) => [
      (index + 1).toString(),
      rec.PotentialData,
      rec.AffectedProcess,
      rec.Impact,
      rec.Likelihood,
      rec.Risk,
      rec.Contingency,
      rec.Treatment
    ]);

    return headerData.concat(reportData);
  }

  sixthSecDraft(res: any): any[][] {
    this.sixthReport = res.result.criticalEquipmentList[0];
    this.ProcessList = res.result.businessProcessList
    let lastReviewed = localStorage.getItem("LastReviewed");
    let formattedDate = '--';

    if (lastReviewed) {
      let date = new Date(lastReviewed);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        formattedDate = this.getTimeFormat(lastReviewed);
      }
    }

    this.sixthReportHeader = [
      ['Business Function', localStorage.getItem('BusinessFunctionName'), 'Business Owner', localStorage.getItem('BusinessOwnerName')],
      ['BC Coordinator', localStorage.getItem('BCCName'), 'Last Reviewed Date', formattedDate],
      [], [],
      ['Business Process', 'Vital Records', '', '', '', 'Critical Equipment & Supplies', '', '', ''],
      ['', 'Sub-Process / Activity', 'Record Type', 'Media Type (Electronic or Physical)', 'Alternat Source(e.g. Data Backup)', 'Critical Equipment', 'Description', 'Total Count', 'Minimum Count']]

    this.ProcessList.forEach((eachProcess: any) => {
      let filteredVR = (this.sixthReport.VitalRecords || []).filter((x: any) => x.BusinessProcessId == eachProcess.BusinessProcessId);
      let filteredCE = (this.sixthReport.CriticalEquipmentSupplies || []).filter((x: any) => x.BusinessProcessId == eachProcess.BusinessProcessId);
      let maxValue = Math.max(filteredVR.length, filteredCE.length)
      this.rowCountsSix.push(maxValue)
      for (let i = 0; i < maxValue; i++) {
        this.sixthFormatedReportData.push([eachProcess.BusinessProcessName,
        (i < filteredVR.length) ? this.getPropertyValue('SubBusinessProcessName', filteredVR[i]) : '',
        (i < filteredVR.length) ? this.getPropertyValue('RecordType', filteredVR[i]) : '',
        (i < filteredVR.length) ? this.getPropertyValue('MediaType', filteredVR[i]) : '',
        (i < filteredVR.length) ? this.getPropertyValue('AlternateSource', filteredVR[i]) : '',
        (i < filteredCE.length) ? this.getPropertyValue('Equipment', filteredCE[i]) : '',
        (i < filteredCE.length) ? this.getPropertyValue('Description', filteredCE[i]) : '',
        (i < filteredCE.length) ? this.getPropertyValue('TotalCount', filteredCE[i]) : '',
        (i < filteredCE.length) ? this.getPropertyValue('MinimumCount', filteredCE[i]) : ''])
      }

    });
    // Return the combined header and formatted data
    return this.sixthReportHeader.concat(this.sixthFormatedReportData);
  }

  seventhSecDraft(res: any): any[][] {
    this.tableData = res.result?.StaffContactLists || [];

    this.secondReport = this.tableData.map((x: any, index: number) => ({
      // CallID: index % 2 === 0 ? x.CallID : x.CallOrder,
      // CallOrder1: x.CallOrder + '-->' + x.CallOrder1 || '',
      CallID: x.CallID,
      CallOrder1: x.CallOrder + ' ---> ' + x.CallOrder1,
      Role: x.Role,
      CallInitiator: x.CallInitiator,
      DesignationC: x.DesignationC,
      Mobile: x.Mobile,
      Residence: x.Residence,
      CallReceiver: x.CallReceiver,
      DesignationR: x.DesignationR,
      MobileR: x.MobileR,
      ResidenceR: x.ResidenceR
    }));

    // Define header data
    const headerData = [
      // [],
      ["Business Function", "", "Business Owner", "", "", ""],
      ["BC Coordinator", "", "Last Reviewed Date", "", "", ""],
      [],
      [],
      ["#", "Call ID", "Call Order", "Role", "Call Initiator", "Designation", "Mobile", "Residence", "Call Receiver", "Designation", "Mobile", "Residence"]
    ];

    // Convert secondReport to array of arrays
    const reportData = this.secondReport.map((rec: any, index: any) => [
      (index + 1).toString(),
      rec.CallID,
      rec.CallOrder1,
      rec.Role,
      rec.CallInitiator,
      rec.DesignationC,
      rec.Mobile,
      rec.Residence,
      rec.CallReceiver,
      rec.DesignationR,
      rec.MobileR,
      rec.ResidenceR
    ]);

    return headerData.concat(reportData);
  }

  eighthSecDraft(res: any): any[][] {
    this.eighthReport = res.result.recoveryProcessList[0].RecoveryStrategies || [];
    this.eighthReport = this.eighthReport.map((x: any) => {
      x.subProcess = ((x.SubBusinessProcesses || []).map((y: any) => y.SubBusinessProcessName)).join(', ');
      return x;
    });

    let stafData = res.result.staffRequirementDetails.map((a: any) => {
      return {
        day1: a.Day1,
        day2: a.Day2,
        day3: a.Day3,
        day4: a.Day4,
        day5: a.Day5,
        total: a.Total,
        remote: a.Remote,
        onPremise: a.OnPremise
      }
    });

    let lastReviewed = localStorage.getItem("LastReviewed");
    let formattedDate = '--';

    if (lastReviewed) {
      let date = new Date(lastReviewed);

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        formattedDate = this.getTimeFormat(lastReviewed);
      }
    }

    this.eighthReportHeader = [
      ['Business Function', localStorage.getItem('BusinessFunctionName'), 'Business Owner', localStorage.getItem('BusinessOwnerName')],
      ['BC Coordinator', localStorage.getItem('BCCName'), 'Last Reviewed Date', formattedDate],
      [], [],
      ['Business Unit', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Total', 'Minimum staff count required during Disaster situation - Working Remotely', 'Minimum Staff count required during disaster situation – On premise']
    ]

    stafData.forEach((rec: any) => {
      this.eighthFormatedReportData.push(
        [localStorage.getItem('BusinessFunctionName'), (rec.day1 || ''), (rec.day2 || ''), (rec.day3 || ''), (rec.day4 || ''), (rec.day5 || ''), (rec.total || ''), (rec.remote || ''),
        (rec.onPremise || '')],
      );
    });

    this.eighthFormatedReportData.push([], [])
    this.eighthFormatedReportData.push(['Business Process', 'Who', 'When / Trigger', 'Where', 'How (activities)'])

    this.eighthReport.forEach((rec: any) => {
      this.eighthFormatedReportData.push(
        [(rec.BusinessProcessName || ''), (rec.Who || ''), (rec.When || ''), (rec.WhereSite || ''), (rec.subProcess || '')]
      );
    });

    // Return the combined header and formatted data
    return this.eighthReportHeader.concat(this.eighthFormatedReportData);
  }

}



