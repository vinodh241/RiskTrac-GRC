import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { RestService } from '../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, dateToYMd, formatTimeZone, formatedDate1 } from 'src/app/includes/utilities/commonFunctions';
import { jsPDF } from "jspdf";
import autoTable  from 'jspdf-autotable';
import * as saveAs from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

// import html2canvas from 'html2canvas';
// import { toCanvas } from 'html-to-image';

export interface BCMSTestTableColumns {
  index: number;
  TestName: string;
  TestType: string;
  TestScenario: string;
  TestScope: string;
  Sites: string;
  ParticipatingFunctions: string;
  Observer: string;
  ScheduledData: string;
  Duration: string;
  Status: string;
}

export interface DisruptionScenariosList {
  Index: number;
  DisruptionScenarioID: any;
  DisruptionScenarioName: string;
  isEdit: boolean;
}

export interface CBApplicationList {
  Index: number;
  BusinessApplicationID: any;
  BusinessApplicationName: string;
  connectedBusinessFunctionID: any;
  connectedSiteIDs: Array<[]>;
  isEdit: boolean;
}

export interface ActionItemList {
  Index: number;
  TestActionPlanID: any;
  TestObservation: string;
  ActionItem: string;
  ActionItemOwner: string;
  ActionItemOwnerGUID: any;
  TargetDate: null;
  FormatedDate: string;
  isEdit: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BcmsTestingService extends RestService {

  public selectedBCMSTest$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public isBCManager      : boolean = false;
  public loggedUser = localStorage.getItem('userguid');

  // BCMS-Test-Listing-Page -- declarations
  public master!        : any;
  public TableBCMSTest! : MatTableDataSource<BCMSTestTableColumns>;
  public gotMaster$     : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Create-BCMS-Test-Page -- declarations
  public infoMaster!              : any;
  public allBusiness              : string[] = [];
  public allsites                 : string[] = [];
  public TableBApplicationTest!   : MatTableDataSource<CBApplicationList>;
  public TabledisruptionScenarios!: MatTableDataSource<DisruptionScenariosList>;
  public gotMasterInfo$           : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // BCMS-Test-Details -- declarations
  public testDetails!           : any;
  public bcmsTestData!          : any;
  public businessImpactResponse!:any;
  public gotBCMSTestData$       : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public gotBCMSTestDetails$    : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Questions-participant/observer/test-report -- declarations
  public testObserverMaster!          : any;
  public participantMasterData!       : any;
  public reviewCommentsHistory!       : any;
  public testParticipantDetails!      : any;
  public testParticipantsReportQuestions!: any;
  public testObserverDetails!         : any;
  public testObserverReportQuestions! : any;
  public testReportMaster!            : any;
  public TableTO!                     : MatTableDataSource<ActionItemList>;
  public gotParticipantReportData$    : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public gotObserverReportData$       : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public gotTestReportData$           : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Evidence upload -- Declarations
  public participateUploadedAttachments : any[] = [];
  public observerUploadedAttachments    : any[] = [];

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private datePipe: DatePipe,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  // BCMS-Test-Listing-Page -- Methods - starts
  getBCMSTestMaster(): void {
    if (environment.dummyData) {
      this.processBCMSTestList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BCMSTestsList": [{
            "TestAssessmentID": 1,
            "TestName": "Evacuation Drill for Amlak",
            "TestTypeID": 1,
            "TestType": "Evacuation Drill",
            "TestingScenario": "Fire in building",
            "TestScenarioDescription": "dfdfdfdf",
            "TestScope": "xyx",
            "ParticipantOptionID": 4,
            "Sites": [{ "SiteID": 1, "SiteName": "Site Test1" }],
            "BusinessFunctions": [{ "BusinessFunctionsID": 1, "BusinessFunctionsName": "Business test1" }],
            "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296CF4F3",
            "TestObserver": "Internal Audit",
            "ScheduledDate": "2024-02-21T20:21:34.757Z",
            "EndDate": "2024-03-12T20:21:34.757Z",
            "Duration": "1day 2hours",
            "TestAssessmentStatus": "Schedule",
            "TestAssessmentStatusID": 1,
            "PlannedTestLimitations": "fdfdfdfd",
            "PlannedFinancialImpact": "fdfdfd",
            "PlannedCustomerImpact": "dfdfdfd",
            "PlannedOtherImpact": "dfdffd",
            "DisruptionScenarios": [{ "DisruptionScenarioID": 1, "DisruptionScenarioName": "Confidentiality" }],
            "CoveredBusinessApplication": [{ "BusinessApplicationID": 1, "BusinessApplicationName": "Email System" }]
          },
          {
            "TestAssessmentID": 2,
            "TestName": "DR Component Test for Amlak DR Site 2023",
            "TestTypeID": 2,
            "TestType": "Component",
            "TestingScenario": "Floods",
            "TestScenarioDescription": "dfdfdfdf",
            "TestScope": "All Business Critical apps",
            "ParticipantOptionID": 4,
            "Sites": [{ "SiteID": 1, "SiteName": "Site Test1" }, { "SiteID": 2, "SiteName": "Site Test2" }],
            "BusinessFunctions": [{ "BusinessFunctionsID": 2, "BusinessFunctionsName": "Business test2" }],
            "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296CF4F2",
            "TestObserver": "nternal Audit",
            "ScheduledDate": "2024-03-22T20:21:34.757Z",
            "EndDate": "2024-03-22T20:21:34.757Z",
            "Duration": "1day 2hours",
            "TestAssessmentStatus": "In-Progress",
            "TestAssessmentStatusID": 2,
            "PlannedTestLimitations": "fdfdfdfd",
            "PlannedFinancialImpact": "fdfdfd",
            "PlannedCustomerImpact": "dfdfdfd",
            "PlannedOtherImpact": "dfdffd",
            "DisruptionScenarios": [{ "DisruptionScenarioID": 1, "DisruptionScenarioName": "Confidentiality" }],
            "CoveredBusinessApplication": [{ "BusinessApplicationID": 1, "BusinessApplicationName": "Email System" }]
          }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-bcms-tests-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBCMSTestList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBCMSTestList(response: any): void {
    this.master = response.result;
    this.master.BCMSTestsList = this.master.BCMSTestsList.map((x: any) => {
      x.FormatedSites = x.Sites.map((x: any) => x.SiteName).join(', ');
      x.FormatedBusinessFunctions = x.BusinessFunctions.map((x: any) => x.BusinessFunctionsName).join(', ')
      x.FormatedDate = dateToYMd(this.utils.formatDate(x.ScheduledDate));
      return x;
    });
    this.TableBCMSTest = new MatTableDataSource(addIndex(this.master.BCMSTestsList, false));
    this.isBCManager = this.master.BCManagersList.some((x: any) => x.BCManagerGUID == this.loggedUser);
    this.gotMaster$.next(true);
  }
  // BCMS-Test-Listing-Page -- Methods - ends

  // Create-BCMS-Test-Page -- Method - starts
  getBCMSAddTestInfo(): void {
    if (environment.dummyData) {
      this.processBCMSAddTestInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "TestTypesList":
            [{
              "TestTypeID": 1,
              "TestType": "Sites Evacuation Drills"
            },
            {
              "TestTypeID": 2,
              "TestType": "Tabletop exercises"
            },
            {
              "TestTypeID": 3,
              "TestType": "Call Tree Manual exercises"
            },
            {
              "TestTypeID": 4,
              "TestType": "Call Tree SMS exercises"
            },
            {
              "TestTypeID": 5,
              "TestType": "Component Tests (individual business functions)"
            }, {
              "TestTypeID": 6,
              "TestType": "Full BCP-DR tests (site level)"
            },
            {
              "TestTypeID": 7,
              "TestType": "DR Component Tests"
            },
            {
              "TestTypeID": 8,
              "TestType": "ITDR - Integrated Testing"
            },
            ],
          "TestObserversList":
            [
              {
                "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296CF4F3",
                "TestObserverName": "Test User1"
              },
              {
                "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296DFERF",
                "TestObserverName": "Test User2"
              }
            ],
          "SitesList":
            [
              {
                "SiteID": 1,
                "SiteName": "Site Test1"
              },
              {
                "SiteID": 2,
                "SiteName": "Site Test2"
              }
            ],
          "BusinessFunctionsList":
            [
              {
                "BusinessFunctionsID": 1,
                "BusinessFunctionsName": "Business test1"
              },
              {
                "BusinessFunctionsID": 2,
                "BusinessFunctionsName": "Business test2"
              }
            ],
          "BusinessApplicationsList":
            [
              {
                "BusinessApplicationID": 1,
                "BusinessApplicationName": "System"
              },
              {
                "BusinessApplicationID": 2,
                "BusinessApplicationName": "test1"
              }
            ],
          "ParticipantsOptionList":
            [
              {
                "ParticipantOptionID": 1,
                "ParticipantOption": "All Business Functions Across Sites"
              },
              {
                "ParticipantOptionID": 2,
                "ParticipantOption": "All Business Functions At Specific Sites"
              },
              {
                "ParticipantOptionID": 3,
                "ParticipantOption": "Custom List of Business Functions"
              },
              {
                "ParticipantOptionID": 4,
                "ParticipantOption": "Custom List of Sites"
              }
            ]
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-bcms-add-test-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBCMSAddTestInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBCMSAddTestInfo(response: any): void {
    this.infoMaster = response.result;
    this.infoMaster.ParticipantsOptionList = this.infoMaster.ParticipantsOptionList.sort((a: { ParticipantOptionID: number; }, b: { ParticipantOptionID: number; }) => a.ParticipantOptionID - b.ParticipantOptionID);
    this.TabledisruptionScenarios = new MatTableDataSource(addIndex([], true));
    this.TableBApplicationTest = new MatTableDataSource(addIndex([], true));
    this.allBusiness = this.infoMaster.BusinessFunctionsList.map((x: any) => x.BusinessFunctionsName);
    this.allsites = this.infoMaster.SitesList.map((x: any) => x.SiteName);
    this.gotMasterInfo$.next(true);
  }

  calculateTimeDuration(formValue: any) {
    let data = {
      "plannedStartDate"  : this.utils.formatTimeZone(new Date(formValue.plannedStartDate)) || '',
      "plannedStartTime"  : formValue.plannedStartTime,
      "plannedEndDate"    : this.utils.formatTimeZone(new Date(formValue.plannedEndDate)) || '',
      "plannedEndTime"    : formValue.plannedEndTime,
    }
    return this.post("/business-continuity-management/bcms-testing/validate-bcms-time-duration", { "data": data });
  }
  // Create-BCMS-Test-Page -- Method - ends

  // BCMS-Test-Creation -- Method - starts
  addUpdateBCMSTest(mode: any, formData: any, testId: any, participantBusiness: any, participantSites: any, testData: any) {
    let FormatedCBA = this.TableBApplicationTest.data.map((app: any) => ({ bussinessApplicationID: app.BusinessApplicationID, bussinessApplicationName: app.BusinessApplicationName }));
    let FormatedDS  = this.TabledisruptionScenarios.data.map((ds: any) => ({ disruptionScenarioID: ds.DisruptionScenarioID, disruptionScenarioName: ds.DisruptionScenarioName }));
    let FormatedPBF = participantBusiness.map((fun: any) => ({ BusinessFunctionsID: fun.BusinessFunctionsID, BusinessFunctionsName: fun.BusinessFunctionsName}));
    let FormatedPS  = participantSites.map((site: any) => ({SiteID: site.SiteID, SiteName: site.SiteName}));
    let participantOptionValue: any = (formData.participantGroup.participants == 1) ? [{}] : (formData.participantGroup.participants == 2) ? this.infoMaster.SitesList.filter((x: any) => x.SiteID == formData.participantGroup.specificSiteId) : (formData.participantGroup.participants == 3) ? FormatedPBF : FormatedPS;
    let data = {
      testAssessmentId: testId,
      testTitle: formData.testTitle,
      plannedStartDate: this.utils.formatTimeZone(formData.plannedStartDate),
      plannedStartTime: formData.plannedStartTime,
      plannedEndDate: this.utils.formatTimeZone(formData.plannedEndDate),
      plannedEndTime: formData.plannedEndTime,
      testTypeId: formData.testType,
      testTitleScenario: formData.testScenarioTitle,
      testObserverGUID: formData.testObserverGUID,
      testScenarioDescription: formData.testScenarioDes,
      plannedTestLimitations: formData.plannedTestLimit,
      plannedFinancialImpact: formData.plannedFinancialImp,
      plannedCustomerImpact: formData.PlannedCustomerImp,
      plannedOtherImpact: formData.PlannedOtherImp,
      participantsData: [{ participantsOptionID: formData.participantGroup.participants, participantsOptionValue: participantOptionValue }],
      disruptionScenarios: FormatedDS,
      coveredBusinessApplication: FormatedCBA,
      actualStartDate: null,
      actualStartTime: null,
      actualEndDate: null,
      actualEndTime: null,
      testAssessmentStatusId: 1
    }
    return this.post(mode == 'Add' ? "/business-continuity-management/bcms-testing/add-bcms-test" : "/business-continuity-management/bcms-testing/update-bcms-test", { "data": data });
  }
  // BCMS-Test-Creation -- Methods - end

  // BCMS-Detials-Page -- Method - starts
  getBCMSTestData(): void {
    if (environment.dummyData) {
      this.processBCMSTestData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BCMSTestsList": [{
            TestAssessmentID: 1,
            TestName: "Evacuation Drill for Amlak",
            TestTypeID: 1,
            TestType: "Evacuation Drill",
            TestingScenario: "Fire in building",
            TestScenarioDescription: "dfdfdfdf",
            ParticipantsData: 'All Business Functions at specific site',
            TestObserverGUID: "433877BA-CCAA-EE11-B06E-000C296DFERF",
            TestObserver: "Internal Audit",
            ScheduledDate: "2024-02-21T20:21:34.757Z",
            EndDate: "2024-02-21T20:21:34.757Z",
            ActualStartDate: "2024-02-21T20:21:34.757Z",
            ActualEndDate: "",
            TestStatus: "Schedule",
            TestAssessmentStatusID: 1,
            DisruptionScenarios: [{ DisruptionScenarioID: 1, DisruptionScenarioName: "Confidentiality" }],
            CoveredBusinessApplication: [{ BusinessApplicationID: 1, BusinessApplicationName: "Email System" }],
          }],
          "CurrentActions": [{					//Based on current status and user calculate in API
            ActionDescription: "Mark the Test as started. This will send out the notification to all stakeholders about the beginning of the BCMS exercise",
            ActionButtonName: "Start Test"
          }],
          "ReportSections": [{
            ReportSectionID: 1,
            ReportSectionName: "Participant FBCC Feedback",
            ReportSectionDescription: "The BCP/DR Test has not started yet. This section will be enabled after the test has been marked as complete.",
            ButtonName: "Prepare Participant Report",
            UserType: "TestParticipant",		//BCManger,TestParticipant,TestObserver
            UserName: "",
            UserGUID: "",
          },
          {
            ReportSectionID: 2,
            ReportSectionName: "Observer Report",
            ReportSectionDescription: "The BCP/DR Test has not started yet. This section will be enabled after the test has been marked as complete.",
            ButtonName: "Prepare Observer Report",
            UserType: "TestObserver",		//BCManger,TestParticipant,TestObserver
            UserName: "",
            UserGUID: "",
          },
          {
            ReportSectionID: 3,
            ReportSectionName: "Overall Test Observations & Report",
            ReportSectionDescription: "The BCP/DR Test has not started yet. This section will be enabled after the test has been marked as complete.",
            ButtonName: "Prepare Test Data",
            UserType: "BCManger",		//BCManger,TestParticipant,TestObserver
            UserName: "",
            UserGUID: "",
          }],
          "TestParticipantsList": [{
            TestParticipantID: 1,
            TestParticipantName: 'Participant 1', // Business Function Name
            RespondentGUID: "",
            Respondent: "Tamer Badhduh",                       // User Name
            StatusID: 1,
            StatusName: "Scheduled",
            IsSubmitted: true
          },
          {
            TestParticipantID: 2,
            TestParticipantName: 'Participant 2', // Business Function Name
            RespondentGUID: "",
            Respondent: "Tamer",                       // User Name
            StatusID: 1,
            StatusName: "Scheduled",
            IsSubmitted: false
          }
          ],
          "ReportSummary": [{
            TestObservations: 'A training program should be provided once on an annual basis',
            ActionItem: 'IT will work with Cyber Security team assuring covering security controls in DRC as per the production before next planned exercise.',
            TargetDate: "Oct 22, 2023"
          }],
          "OverAllTestResult": [{
            SuccessFull: "1%",
            PartiallySuccessFul: "1%",
            Failed: "1%"
          }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-bcms-test-data", { "data": { "testAssessmentId": Number(this.selectedBCMSTest$.value) } }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBCMSTestData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processBCMSTestData(response: any): void {
    this.bcmsTestData = response.result;
    this.testDetails = response.result.BCMSTestsList[0];
    this.isBCManager = this.bcmsTestData.BCManagersList.some((x: any) => x.BCManagerGUID == this.loggedUser);
    this.gotBCMSTestData$.next(true);
    this.gotBCMSTestDetails$.next(true);
  }
  // BCMS-Detials-Page -- Method - starts

  // Update BCMS-Test Status -- Method - Starts
  UpdateAssessmentStatus(data: any) {
    let payload = {
      "testAssessmentId": data.TestAssessmentID,
      "currentStatusId": data.TestAssessmentStatusID,
      "nextStatusId": Number(data.TestAssessmentStatusID) + 1
    }
    return this.post("/business-continuity-management/bcms-testing/update-bcms-test-status", { "data": payload });
  }
  // Update BCMS-Test Status -- Method - end

  // Questions Feedback Data for Participants -- Method - Starts
  getParticipantReportData(payload: any) {
    if (environment.dummyData) {
      this.processParticipantReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "TestDetails": [
            {
              "TestAssessmentID": "31",
              "TestName": "Test 1",
              "TestTypeID": 5,
              "TestType": "Component Tests (individual business functions)",
              "TestingScenario": "fire accident ",
              "TestScenarioDescription": "test title des",
              "ParticipantOption": "Custom list of Business Functions",
              "Sites": [
                {
                  "SIteID": 53,
                  "SiteName": "Bangalore head office, sigma tech park whitefield, bangalore"
                },
                {
                  "SIteID": 54,
                  "SiteName": "main branch SE"
                },
                {
                  "SIteID": 56,
                  "SiteName": "Bengaluru Head office1"
                }
              ],
              "BusinessFunctions": [
                {
                  "BusinessFunctionID": 25,
                  "BusinessFunctionsName": "Management"
                },
                {
                  "BusinessFunctionID": 25,
                  "BusinessFunctionsName": "Management"
                },
                {
                  "BusinessFunctionID": 28,
                  "BusinessFunctionsName": "Source Unit"
                }
              ],
              "TestObserverGUID": "74B7F09A-758A-ED11-BAC5-000C29A8F9E1",
              "TestObserver": "mo_bank_6 mid_name User 6",
              "ReviewerID": "2E8C222A-578B-ED11-BAC6-000C29A8F9E1",
              "ReviewerName": "devtest1  devtest1last",
              "ScheduledDate": "2024-05-07T13:51:00.000Z",
              "EndDate": "2024-05-21T12:55:00.000Z",
              "TestAssessmentStatusID": 1,
              "TestAssessmentStatus": "Scheduled",
              "PlannedTestLimitations": "fefe",
              "PlannedFinancialImpact": "fefef",
              "PlannedCustomerImpact": "efef",
              "PlannedOtherImpact": null,
              "DisruptionScenarios": [
                {
                  "DisruptionScenariosID": 48,
                  "DisruptionScenarioName": "description s"
                }
              ],
              "CoveredBusinessApplication": []
            }
          ],
          "TestParticipantDetails": [
            {
              "TestAssessmentID": "31",
              "ScheduledTestID": "46",
              "TestParticipantID": "116",
              "TestName": "Test 1",
              "TestObserverID": "74B7F09A-758A-ED11-BAC5-000C29A8F9E1",
              "TestObserverName": "mo_bank_6 mid_name User 6",
              "ReviewerID": null,
              "ReviewerName": "devtest1  devtest1last",
              "BusinessFunctionID": "25",
              "BusinessFunctionsSitesID": "38",
              "SiteID": "53",
              "TestWorkflowStatusID": 1,
              "IsReviewed": null,
              "RespondedBy": null
            }
          ],
          "TestParticipantsReportQuestions": [
            {
              "TemplateID": "1",
              "TemplateName": "Test Participant",
              "ParticipantReportData": [
                {
                  "SectionID": null,
                  "Section": null,
                  "QuestionsList": [
                    {
                      "QuestionID": 1,
                      "Question": "Were business functions/operations recovered as per defined and documented plans and procedures?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": null,
                      "Component": null,
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": true,}]"
                    }
                  ]
                },
                {
                  "SectionID": 1,
                  "Section": "Tabletop/desktop walkthrough exercise",
                  "QuestionsList": [
                    {
                      "QuestionID": 2,
                      "Question": "How well did the participants adhere to the simulated environment restrictions during the tabletop/desktop walkthrough exercise?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": null,
                      "Component": null,
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Not Well\",\"isCommentMandotory\": false,}, {\"OptionID\": 2\"Option\": \"Satisfactory\",\"isCommentMandotory\": false,}, {\"OptionID\": 3, \"Option\": \"Fairly Well\", \"isCommentMandotory\": false,}, {\"OptionID\": 4,\"Option\": \"Very Well\",\"isCommentMandotory\": false,}, {\"OptionID\": 5,\"Option\": \"Extremely Well\",\"isCommentMandotory\": false,}]"
                    }
                  ]
                },
                {
                  "SectionID": 2,
                  "Section": "Detailed Test Feedback",
                  "QuestionsList": [
                    {
                      "QuestionID": 3,
                      "Question": "Was the emergency response during site evacuation exercise executed effectively, as  per exercising procedure?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 1,
                      "Component": "Site evacuation drill - emergency response",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 4,
                      "Question": "Was the testing of IT DRP component successful and achieved outcomes as expected?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 2,
                      "Component": "IT DRP Testing - components testing",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 5,
                      "Question": "Was the testing of ITDRP integrated components successful and achieved outcomes as expected?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 3,
                      "Component": "IT DRP Testing - components testing",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 6,
                      "Question": "Was the recovery process executed effectively by the recovery team? ",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 4,
                      "Component": "Full blown simulation exercise - Recovery team",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 7,
                      "Question": "Was the recovery process executed effectively by the redundant network elements?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 5,
                      "Component": "Full blown simulation exercise - Network element",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 8,
                      "Question": "Was the recovery process executed  effectively by the redundant application nodes?Was the emergency response during site evacuation exercise executed effectively, as  per exercising procedure? ",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 6,
                      "Component": "Full blown simulation exercise - Application node",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    },
                    {
                      "QuestionID": 9,
                      "Question": "Did the exercise proceed without any problems?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": 7,
                      "Component": "Issues",
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Yes\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"No\",\"isCommentMandotory\": false,},{\"OptionID\": 3,\"Option\": \"Not Applicable\",\"isCommentMandotory\": false,}]"
                    }
                  ]
                },
                {
                  "SectionID": 3,
                  "Section": "Key Observations",
                  "QuestionsList": [
                    {
                      "QuestionID": 10,
                      "Question": "Key Observations",
                      "CommentType": "ckeditor",
                      "ComponentID": null,
                      "Component": null
                    }
                  ]
                },
                {
                  "SectionID": 4,
                  "Section": "Learnings / Improvement Areas",
                  "QuestionsList": [
                    {
                      "QuestionID": 11,
                      "Question": "How could various teams or mechanism involved be improved?",
                      "CommentType": "ckeditor",
                      "ComponentID": null,
                      "Component": null
                    }
                  ]
                },
                {
                  "SectionID": null,
                  "Section": null,
                  "QuestionsList": [
                    {
                      "QuestionID": 12,
                      "Question": "How successful were the tests overall?",
                      "ControlType": "radio",
                      "CommentType": "textarea",
                      "ComponentID": null,
                      "Component": null,
                      "Options": "[{\"OptionID\": 1,\"Option\": \"Successful\",\"isCommentMandotory\": false,}, {\"OptionID\": 2,\"Option\": \"Partially Unsuccessful - Minor gaps exist\",\"isCommentMandotory\": false,}, {\"OptionID\": 3,\"Option\": \"Unsuccessful - Major gaps exist\",\"isCommentMandotory\": false,}]"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-participant-report-data", { "data": payload }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processParticipantReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processParticipantReportData(response: any) {
    this.participantMasterData = response.result;
    this.testDetails = response.result.TestDetails[0];
    response.result.TestParticipantsReportQuestions[0].ParticipantReportData = response.result.TestParticipantsReportQuestions[0].ParticipantReportData.map((x: any) => {
      x.QuestionsList = x.QuestionsList.map((y: any) => {
        if(y.Options)
          y.Options = JSON.parse(y.Options);
        y['Notes'] = y.Question.split(';')[1];
        y.Question = y.Question.split(';')[0];
        return y;
      });
      return x
    });
    this.testParticipantsReportQuestions = response.result.TestParticipantsReportQuestions[0];
    this.testParticipantDetails = response.result.TestParticipantDetails[0];
    this.isBCManager = response.result.BCManagersList.some((x: any) => x.BCManagerGUID == this.loggedUser);
    this.reviewCommentsHistory = response.result.ReviewComments;
    this.participateUploadedAttachments = JSON.parse(JSON.stringify(this.participantMasterData.TestParticipantEvidences));
    this.gotBCMSTestDetails$.next(true);
    this.gotParticipantReportData$.next(true);
  }

  saveParticipantReport(main: any, formValue: any) {
    let data: { responses: { ResponseID: null; QuestionID: any; TemplateID: number; SelectedValue: any; Comment: any; }[] } = {
      responses: []
    };

    let evidences = {
      evidenceIds: (this.participateUploadedAttachments || []).map((ele: any) => ele.AttachmentID).join(","),
    }

    const allQuestions = this.testParticipantsReportQuestions.ParticipantReportData.flatMap((section: any) => section.QuestionsList);
    allQuestions.forEach((question: any) => {
      const questionID = question.QuestionID;
      let res = {
        "ResponseID": question.Responses[0].ResponseID,
        "QuestionID": question.QuestionID,
        "TemplateID": this.testParticipantsReportQuestions.TemplateID,
        "SelectedValue": formValue[`Options${questionID}`] || null,
        "Comment": formValue[`CommentType${questionID}`] || ""
      };
      data.responses.push(res);
    });

    let payload = Object.assign(main, data, evidences);
    return this.post("/business-continuity-management/bcms-testing/save-participant-report", { "data": payload });
  }

  submitParticipantResponse(payload: any) {
    return this.post("/business-continuity-management/bcms-testing/review-participant-report", { "data": payload });
  }

  //Upload Participant Attachment -- Methods - start
  processUploadParticipantAttachment(response: any): void {
    if (this.participateUploadedAttachments == null || this.participateUploadedAttachments == undefined)
      this.participateUploadedAttachments = [];
    this.participateUploadedAttachments.push(response?.result?.attachmentDetails[0]);
  }

  deleteUploadParticipantAttachment(id: any) {
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
        this.participateUploadedAttachments = this.participateUploadedAttachments.filter((x: any) => x.FileContentID !== id);
      }
    });
  }
  //Upload Participant Attachment -- Methods - end
  // Questions Feedback Data for Participants -- Method - end

  // Questions Feedback Data for Observer -- Method - Starts
  getObserverReportData(payload: any) {
    if (environment.dummyData) {
      this.processObserverReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "TestDetails": [{
            "TestAssessmentID": 1,
            "TestName": "Evacuation Drill for Amlak",
            "TestParticipantID": 1,
            "TestParticipantName": "fdfdf",
            "RespondentGUID": "",
            "Respondent": "fdfdff",
            "StatusID": 1,
            "StatusName": "fdfdf",
            "TestAssessmentStatusID": 1,
            "TestAssessmentStatus": "ffdfdf",
            "TestTypeID": 1,
            "TestType": "Evacuation Drill",
            "TestingScenario": "Fire in building",
            "TestScenarioDescription": "dfdfdfdf",
            "ParticipantsData": [],
            "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296DFERF",
            "TestObserver": "Internal Audit",
            "ScheduledDate": "",
            "EndDate": "",
            "ActualStartDate": "",
            "ActualEndDate": "",
            "TestStatus": "Schedule",
            "DisruptionScenarios": [{ DisruptionScenarioID: 1, DisruptionScenarioName: "Confidentiality" }],
            "CoveredBusinessApplication": [{ BusinessApplicationID: 1, BusinessApplicationName: "Email System" }],
          }],
          "TestObserverReportQuestions": [{
            "TemplateID": 1,
            "TemplateName": "dfdf",
            "ParticipantReportData": [{
              "SectionID": 1,
              "Section": "dfdfdf",
              "QuestionID": 1,
              "Question": "dfdffd",
              "TestComponents": [{
                "ComponentID": 1,
                "Component": "dfdf",
                "QuestionID": 1,
                "Question": 1,
                "OptionsArray": [{
                  "OptionID": 1,
                  "Option": "fgfdf",
                  "isCommentMandotory": true, //false,
                }],
                "ControlType": "radio",					//radio,checkbox,dropdown
                "CommentType": "textarea"				//textarea/ckeditor
              }],
              "OptionsArray": [{
                "OptionID": 1,
                "Option": "fgfdf",
                "isCommentMandotory": true,    //false,
              }],
              "ControlType": "radio",					//radio,checkbox,dropdown
              "CommentType": "textarea"				//textarea/ckeditor
            }]
          }],
          "TestObserverReportResponse": [{
            "TemplateID": 1,
            "TemplateName": "dfdf",
            "ParticipantReportData": [{
              "SectionID": 1,
              "Section": "dfdfdf",
              "QuestionID": 1,
              "Question": "dfdffd",
              "ResponseID": 1,
              "Response": "dfdf",
              "Comment": "fdfdff",
              "TestComponents": [{
                "ComponentID": 1,
                "Component": "dfdf",
                "QuestionID": 1,
                "Question": 1,
                "ResponseID": 1,
                "Response": "kkjk",
                "Comment": "dfdff",
                "OptionsArray": [{
                  "OptionID": 1,
                  "Option": "fgfdf",
                  "isCommentMandotory": true  //false,
                }],
                "ControlType": "radio",					//radio,checkbox,dropdown
                "CommentType": "textarea"				//textarea/ckeditor
              }],
              "OptionsArray": [{
                "OptionID": 1,
                "Option": "fgfdf",
                "isCommentMandotory": true //false,
              }],
              "ControlType": "radio",					//radio,checkbox,dropdown
              "CommentType": "textarea"				//textarea/ckeditor
            }]
          }],
          "ReviewCommentHistory": [{
            "ReviewCommentID": 1,
            "ReviewComment": "dfdfdf",
            "DateTime": "2024-01-10T13:23:28.490Z",
            "CommentUserName": "fdfdfd",
            "TestParticipantID": 1,
            "TestParticipantName": 'fdfdf',
          }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-observer-report-data", { "data": payload }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processObserverReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processObserverReportData(response: any) {
    this.testObserverMaster = response.result
    this.testDetails = this.testObserverMaster.TestDetails[0];
    this.testObserverMaster.TestObserverReportQuestions[0].ObserverReportData = this.testObserverMaster.TestObserverReportQuestions[0].ObserverReportData.map((x: any) => {
      x.QuestionsList = x.QuestionsList.map((y: any) => {
        if(y.Options)
          y.Options = JSON.parse(y.Options);
        y['Notes'] = y.Question.split(';')[1];
        y.Question = y.Question.split(';')[0];
        if(y.IsSupportTeam) {
          y.SupportTeamList = y.SupportTeamList.map((z: any) => {
            z.Options = JSON.parse(z.Options);
            return z;
          });
        }
        return y;
      });
      return x
    });
    this.testObserverReportQuestions = this.testObserverMaster.TestObserverReportQuestions[0];
    this.testObserverDetails = this.testObserverMaster.TestObserverDetails[0];
    this.isBCManager = this.testObserverMaster.BCManagersList.some((x: any) => x.BCManagerGUID == this.loggedUser);
    this.reviewCommentsHistory = this.testObserverMaster.ReviewComments;
    this.observerUploadedAttachments = JSON.parse(JSON.stringify(this.testObserverMaster.TestObserverEvidences));
    this.gotBCMSTestDetails$.next(true);
    this.gotObserverReportData$.next(true);
  }

  saveObserverReport(main: any, formValue: any) {
    main = Object.assign(main, {testObserverLnkId: this.testObserverDetails.TestObserverLNID})
    let data: { responses: { ResponseID: null; QuestionID: any; TemplateID: number; SelectedValue: any; Comment: any; }[] } = {
      responses: []
    };
    let supportTeamdata:{ supportTeamResponse: { BusinessApplicationsID: null; BusinessApplicationsLNID: null; TestAssessmentID: null; SupportLeadID: null; SupportLeadRating: any; }[] } = {
      supportTeamResponse: []
    };
    let evidences = {
      evidenceIds: (this.observerUploadedAttachments || []).map((ele: any) => ele.AttachmentID).join(","),
    }

    const allQuestions = this.testObserverReportQuestions.ObserverReportData.flatMap((section: any) => section.QuestionsList);
    allQuestions.forEach((question: any) => {
      const questionID = question.QuestionID;
      let res = {
        "ResponseID": question.Responses[0].ResponseID,
        "QuestionID": question.QuestionID,
        "TemplateID": this.testObserverReportQuestions.TemplateID,
        "SelectedValue": formValue[`Options${questionID}`] || null,
        "Comment": formValue[`CommentType${questionID}`] || "",
      };
      data.responses.push(res);
      if (question.IsSupportTeam) {
        question.SupportTeamList.forEach((team: any) => {
          const businessApplicationsLNID = team.BusinessApplicationsLNID;
          let res2 = {
            "BusinessApplicationsID"  : team.BusinessApplicationsID,
            "BusinessApplicationsLNID": team.BusinessApplicationsLNID,
            "TestAssessmentID"        : team.TestAssessmentID,
            "SupportLeadID"           : team.SupportLeadID,
            "SupportLeadRating"       : team.Options.find((op: any) => op.OptionID == formValue[`teamsOptions${businessApplicationsLNID}`]).Option
          }
          supportTeamdata.supportTeamResponse.push(res2)
        });
      }
    });

    let payload = Object.assign(main, data, supportTeamdata, evidences);
    return this.post("/business-continuity-management/bcms-testing/save-observer-report", { "data": payload });
  }

  //Upload Participant Attachment -- Methods - start
  processUploadObserverAttachment(response: any): void {
    if (this.observerUploadedAttachments == null || this.observerUploadedAttachments == undefined)
      this.observerUploadedAttachments = [];
    this.observerUploadedAttachments.push(response?.result?.attachmentDetails[0]);
  }

  deleteUploadObserverAttachment(id: any) {
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
        this.observerUploadedAttachments = this.observerUploadedAttachments.filter((x: any) => x.FileContentID !== id);
      }
    });
  }
  //Upload Participant Attachment -- Methods - end

  // Questions Feedback Data for Observer -- Method - end

  // Questions Feedback Data for Test Report -- Method - Starts
  getTestReportData(payload: any) {
    if (environment.dummyData) {
      this.processTestReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "TestDetails": [{
            "TestAssessmentID": 1,
            "TestName": "Evacuation Drill for Amlak",
            "TestParticipantID": 1,
            "TestParticipantName": "fdfdf",
            "RespondentGUID": "",
            "Respondent": "fdfdff",
            "StatusID": 1,
            "StatusName": "fdfdf",
            "TestAssessmentStatusID": 1,
            "TestAssessmentStatus": "ffdfdf",
            "TestTypeID": 1,
            "TestType": "Evacuation Drill",
            "TestingScenario": "Fire in building",
            "TestScenarioDescription": "dfdfdfdf",
            "ParticipantsData": [],
            "TestObserverGUID": "433877BA-CCAA-EE11-B06E-000C296DFERF",
            "TestObserver": "Internal Audit",
            "ScheduledDate": "",
            "EndDate": "",
            "ActualStartDate": "",
            "ActualEndDate": "",
            "TestStatus": "Schedule",
            "DisruptionScenarios": [{ DisruptionScenarioID: 1, DisruptionScenarioName: "Confidentiality" }],
            "CoveredBusinessApplication": [{ BusinessApplicationID: 1, BusinessApplicationName: "Email System" }],
          }],
          "ReviewCommentHistory": [{
            "ReviewCommentID": 1,
            "ReviewComment": "dfdfdf",
            "DateTime": "2024-01-10T13:23:28.490Z",
            "CommentUserName": "fdfdfd",
            "TestParticipantID": 1,
            "TestParticipantName": 'fdfdf',
          }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/bcms-testing/get-publish-report-data", { "data": payload }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processTestReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processTestReportData(response: any) {
    this.testReportMaster = response.result;
    this.testDetails = response.result.BCMSTestDetails[0];
    this.testReportMaster.ActionItemsList = this.testReportMaster.ActionItemsList.map((x: any) => {
      x.FormatedDate = dateToYMd(this.utils.formatDate(x.TargetDate));
      x.ActionItem = x.IdentifiedActionItem;
      x.TargetDate = this.utils.formatTimeZone(x.TargetDate);
      return x;
    });
    this.TableTO = new MatTableDataSource(addIndex(this.testReportMaster.ActionItemsList, true));
    this.TableTO._updateChangeSubscription();
    this.isBCManager = response.result.BCManagersList.some((x: any) => x.BCManagerGUID == this.loggedUser);
    this.reviewCommentsHistory = response.result.ReviewComments;
    this.gotBCMSTestDetails$.next(true);
    this.gotTestReportData$.next(true);
  }

  saveTestReport(formData: any, completionPercent: any, toTableData: any) {
    let data = {
      testAssessmentId : this.testDetails.TestAssessmentID,
      testReportId : this.testReportMaster.OverAllReportData[0].TestReportID,
      plannedTestLimitations : formData.testLimitPlanned,
      postAnalysisTestLimitation : formData.testLimitPosttest,
      plannedFinancialImpact : formData.plannedFinancialImpact,
      postAnalysisFinancialImpact : formData.postAnalysisFinancialImpact,
      plannedCustomerImpact: formData.plannedCustomerImpact,
      postAnalysisCustomerImpact: formData.postAnalysisCustomerImpact,
      plannedOtherImpact: formData.plannedOtherImpact,
      postAnalysisOtherImpact: formData.postAnalysisOtherImpact,
      rootCauseAnalysis: formData.rootCauseAnalysis,
      disruptionScenariosData: formData.disruptionScenarios.map((x: any) => ({'DisruptionScenariosID': x.disruptionScenariosID, 'TestAssessmentID': Number(this.testDetails.TestAssessmentID), 'IsTested': Number(x.isTested), 'ContinuityProcess': x.continuityProcess})),
      testingComponentsData: formData.testingComponents.map((x: any) => ({'TestingComponentReportID': x.testingComponentReportID, 'TestAssessmentID': Number(this.testDetails.TestAssessmentID), 'ComponentID': x.componentID, 'IsTestUnderTaken': x.isTestUnderTaken})),
      bussinessFunctions: formData.testResults.map((x: any) => ({'ParticipantID': x.participantID, 'TestAssessmentID': Number(this.testDetails.TestAssessmentID), 'BusinessFunctionID': x.businessFunctionID, 'RecoveryProcedures': x.recoveryProcedures, 'AdditionalInformation': x.additionalInformation, 'Result': Number(x.result)})),
      testObservations: toTableData.map((x: any) => ({'TestActionPlanID': x.TestActionPlanID, 'TestAssessmentID': Number(this.testDetails.TestAssessmentID), 'TestObservation': x.TestObservation, 'IdentifiedActionItem': x.ActionItem, 'ActionItemOwnerID': x.ActionItemOwnerGUID, 'StartDate': null, 'TargetDate': x.TargetDate})),
      testResult: this.testReportMaster.OverAllReportData[0].TestResult,
      completionPercent: completionPercent != null? completionPercent.toFixed(2) : null
    }

    return this.post("/business-continuity-management/bcms-testing/save-publish-report-data", { "data": data });
  }

  publishTestReport() {
    let data = {
      testAssessmentId : this.testDetails.TestAssessmentID
    }
    return this.post("/business-continuity-management/bcms-testing/publish-test-report", { "data": data });
  }
  // Questions Feedback Data for Observer -- Method - end

  // Download Report Draft -- Method - starts
  getDraftPDFData(testDetails: any) {
    let data = {
      testAssessmentId: testDetails.TestAssessmentID
    }
    return this.post("/business-continuity-management/bcms-testing/download-test-export-draft", { "data": data });
  }

  getDateFormatPDF(date: any) {
    date = new Date(formatTimeZone(date) + "T00:00:00.000Z");
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-UK', options);
  }

  async downloadTestReportPDF(data: any) {
    this.testDetails = data.BCMSTestDetails[0];
    this.businessImpactResponse = data.BusinessImpact[0];
    const pdfsize = 'a4';
    const pdf = new jsPDF('p', 'px', pdfsize);
    // const pageHeight = pdf.internal.pageSize.height;

    let contentHeight = 50;
    let lineHeight = 5;
    let linebreak = 20;
    let leftAlign = 55;
    let tableHeight = 0;
    let plannedTitleHeight = 0;

    //=============================Height Methods================================
    //(To find the height of the text of header and to add new page)

    // function getTextHeight(pdf: any, text: any, fontSize: any) {
    //   pdf.setFontSize(fontSize);
    //   const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - 2 * leftAlign);
    //   return lines.length * (fontSize * 1.15);
    // }

    // function checkAndAddPage(requiredHeight: any) {
    //   if ((contentHeight + requiredHeight) > pageHeight) {
    //     pdf.addPage();
    //     contentHeight = 50;
    //   }
    // }

    //=============================Test Report Title=============================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    // Split text into lines to fit the page width
    const maxWidth = pdf.internal.pageSize.width - 20; // 20px padding
    const textLines = pdf.splitTextToSize(this.testDetails.TestName, maxWidth);

    // Add each line to the PDF
    textLines.forEach((line:any) => {
      const textWidth = pdf.getStringUnitWidth(line) * 12 / pdf.internal.scaleFactor; // Adjust font size factor as needed
      pdf.text(line, (pdf.internal.pageSize.width - textWidth) / 2, contentHeight);
      contentHeight += 10; // Increase content height for the next line
    });

    contentHeight += 30;
    //=============================Planned Date==================================
    const plannedNActualColumn = [
      { title: "Title", dataKey: "title" },
      { title: "Value", dataKey: "value" },
      { title: "Value1", dataKey: "value1" }
    ];
    const plannedData = [{ startDate: this.getDateFormatPDF(this.testDetails.ScheduledDate), endDate: this.getDateFormatPDF(this.testDetails.EndDate), start_time: formatedDate1(this.testDetails.ScheduledDate).split('-')[1].trim(), end_time: formatedDate1(this.testDetails.EndDate).split('-')[1].trim() }];

    pdf.setFontSize(10);
    // plannedTitleHeight = getTextHeight(pdf, 'Planned as per approved Test Scope', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('TEST DATE / TIME', leftAlign, contentHeight);
    contentHeight += (lineHeight *2);

    pdf.setFontSize(10);
    // plannedTitleHeight = getTextHeight(pdf, 'Planned as per approved Test Scope', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('Planned as per approved Test Scope', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const planned = [
      { title: `Test Date(Planned as per approved Test Scope)  \n(Day-Month-Year)`, value: `Date Commenced: \nStart Date: \n${plannedData[0].startDate}`, value1: `Date Completed: \nEnd Date: \n${plannedData[0].endDate}`, colSpan: 0, rowSpan: 0 },
      { title: "Time Duration(Planned as per approved Test Scope)", value: `Time Commenced: \nStart Time: \n${plannedData[0].start_time}`, value1: `Time Completed: \nEnd Time: \n${plannedData[0].end_time}`, colSpan: 0, rowSpan: 2 },
    ];

    autoTable(pdf, {
      columns: plannedNActualColumn,
      body: planned.map(row => {
        return {
          ...row,
          value: { content: row.value, colSpan: row.colSpan, styles: { halign: 'center' } },
          title: { content: row.title, rowSpan: row.rowSpan, styles: { halign: 'center' } }
        };
      }),
      startY: contentHeight,
      theme: 'grid',
      showHead: 'never',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      didParseCell: (data) => {
        if (data.column.dataKey === 'title') {
          data.cell.styles.fillColor = [229, 229, 229];
          data.cell.styles.textColor = [38, 38, 38];
          data.cell.styles.halign = 'left';
          data.cell.styles.cellWidth = 100;
        }
        if (data.column.dataKey === 'value') {
          data.cell.styles.halign = 'left';
        }
      },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      }
    });
    contentHeight = (tableHeight + linebreak);

    //======================================Actual Date ======================================
    pdf.setFontSize(10);
    // plannedTitleHeight = getTextHeight(pdf, 'Actual', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('Actual', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const actualData = [{ startDate: this.getDateFormatPDF(this.testDetails.ActualStartDateTime), endDate: this.getDateFormatPDF(this.testDetails.ActualEndDateTime), start_time: formatedDate1(this.testDetails.ActualStartDateTime).split('-')[1].trim(), end_time: formatedDate1(this.testDetails.ActualEndDateTime).split('-')[1].trim() }];

    const actual = [
      { title: "Test Date(Actual)", value: `Date Commenced: \nStart Date: \n${actualData[0].startDate}`, value1: `Date Completed: \nEnd Date: \n${actualData[0].endDate}`, colSpan: 0 },
      { title: "Time Duration(Actual)", value: `Time Commenced: \nStart Time: \n${actualData[0].start_time}`, value1: `Time Completed: \nEnd Time: \n${actualData[0].end_time}`, colSpan: 0 },
    ];

    autoTable(pdf, {
      columns: plannedNActualColumn,
      body: actual.map(row => {
        if (row.colSpan) {
          return {
            ...row,
            value: { content: row.value, colSpan: row.colSpan, styles: { halign: 'center' } }
          };
        }
        return row;
      }),
      startY: contentHeight,
      theme: 'grid',
      showHead: 'never',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      didParseCell: (data) => {
        if (data.column.dataKey === 'title') {
          data.cell.styles.fillColor = [229, 229, 229];
          data.cell.styles.textColor = [38, 38, 38];
          data.cell.styles.halign = 'left';
          data.cell.styles.cellWidth = 100;
        }
        if (data.column.dataKey === 'value') {
          data.cell.styles.halign = 'left';
        }
      },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      }
    });

    contentHeight = (tableHeight + linebreak);
    //===============================Test Limitations====================================
    // plannedTitleHeight = getTextHeight(pdf, 'TEST LIMITATIONS', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('TEST LIMITATIONS', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const testLimitationsHeader = [
      { header: "", dataKey: "TestLimitations" },
      { header: "Planned as per scope", dataKey: "PlannedTestLimitations" },
      { header: "Post-test analysis", dataKey: "PostAnalysisTestLimitation" }
    ];

    // Fetch and set the image data (Commented Image convertion as it is creating different image sizes based on the html content ==> Jami.Pavan)
    // const fetchImageData = async (htmlContent:any) => {
    //   const div = document.createElement('div');
    //   div.innerHTML = htmlContent;
    //   document.body.appendChild(div);

    //   const canvas = await toCanvas(div);
    //   const imgDataURL = canvas.toDataURL('image/jpeg');

    //   document.body.removeChild(div);
    //   return imgDataURL;
    // };
    // data.TestLimitations[0].PlannedTestLimitations = await fetchImageData(data.TestLimitations[0].PlannedTestLimitations);
    // data.TestLimitations[0].PostAnalysisTestLimitation = await fetchImageData(data.TestLimitations[0].PostAnalysisTestLimitation);
    data.TestLimitations[0].PlannedTestLimitations = this.parsedHTML(data.TestLimitations[0].PlannedTestLimitations);
    data.TestLimitations[0].PostAnalysisTestLimitation = this.parsedHTML(data.TestLimitations[0].PostAnalysisTestLimitation);

    const testLimitationsData = data.TestLimitations;

    autoTable(pdf, {
      columns: testLimitationsHeader,
       body: testLimitationsData,
      // body: testLimitationsData.map((row:any) => ({
      //   ...row,
      //   PlannedTestLimitations: { content: '', img: row.PlannedTestLimitations.contentDataURL },
      //   PostAnalysisTestLimitation: { content: '', img: row.PostAnalysisTestLimitation.contentDataURL }
      // })),
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.001, lineColor: [0, 0, 0], cellWidth: 119 },
      didParseCell: (data) => {
        if (data.column.dataKey === 'TestLimitations') {
          data.cell.styles.fillColor = [229, 229, 229];
          data.cell.styles.textColor = [38, 38, 38];
          data.cell.styles.halign = 'left';
          data.cell.styles.cellWidth = 100;
          data.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawPage: (d:any) => {
        tableHeight = d.cursor.y;
      }
    });

    contentHeight = (tableHeight + linebreak);
    //=============================Business Impact =====================================
    // plannedTitleHeight = getTextHeight(pdf, 'BUSINESS IMPACT', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('BUSINESS IMPACT', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const businessImpactHeader = [
      [
        { content: `Business Impact \n\n(Detail out financial and / or customer impact due to the conduct of the test)`, rowSpan: 4, styles: { valign: 'top' as 'middle' | 'top' | 'bottom' } },
        { content: "Planned as per scope" },
        { content: "Post-test analysis" }
      ]
    ];

    const businessImpactData = [
      [{ content: "", styles: { cellWidth: 100 } }, `Financial Impact: \n${this.businessImpactResponse.PlannedFinancialImpact}`, `Financial Impact: \n${this.businessImpactResponse.PostAnalysisFinancialImpact}`],
      [{ content: "", styles: { cellWidth: 0 } }, `Customer Impact: \n${this.businessImpactResponse.PlannedCustomerImpact}`, `Customer Impact: \n${this.businessImpactResponse.PostAnalysisCustomerImpact}`],
      [{ content: "", styles: { cellWidth: 0 } }, `Other Impacts (if Any): \n${this.businessImpactResponse.PlannedOtherImpact}`, `Other Impacts (if Any): \n${this.businessImpactResponse.PostAnalysisOtherImpact}`]
    ];

    autoTable(pdf, {
      head: businessImpactHeader,
      body: businessImpactData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.01, lineColor: [0, 0, 0] },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      }
    });

    contentHeight = (tableHeight + linebreak);
    //=================================Disruption Scenarios===========================
    // plannedTitleHeight = getTextHeight(pdf, 'Disruption Scenarios', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('Disruption Scenarios', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const disruptionScenariosHeader = [
      { header: "S No", dataKey: "Sl_No" },
      { header: "Disruption Scenario", dataKey: "DisruptionScenarios" },
      { header: "Tested", dataKey: "IsTested" },
      { header: "Continuity Process", dataKey: "ContinuityProcess" }
    ];

    const disruptionScenariosData = data.DisruptionScenarios;
    // below Array Format from API(data.DisruptionScenarios)
    // [
    //   { Sl_No: "1", DisruptionScenarios: "AMLAK Head office not available", IsTested: "Yes",ContinuityProcess:"Identified critical processes as per be performed from alternative site" },
    // ];

    autoTable(pdf, {
      columns: disruptionScenariosHeader,
      body: disruptionScenariosData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.01, lineColor: [0, 0, 0] },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      }
    });

    contentHeight = (tableHeight + linebreak);
    //========================================Test UnderTaken==============================================
    // plannedTitleHeight = getTextHeight(pdf, 'TEST UNDERTAKEN', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('TEST UNDERTAKEN', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const testComponentsHeader = [
      { header: "Sr No", dataKey: "Sl_No" },
      { header: "Exercise Type", dataKey: "Component" },
      { header: "Test Undertaken (Yes/No)", dataKey: "IsTestUnderTaken" }
    ];

    const testComponentsData = data.TestComponents;
    // below Array Format from API(data.TestComponents)
    // [
    //   { Sl_No: "1", Component: "AMLAK Head office not available", IsTestUnderTaken: "Yes" }
    // ];

    autoTable(pdf, {
      columns: testComponentsHeader,
      body: testComponentsData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.001, lineColor: [0, 0, 0] },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      },
    });

    contentHeight = (tableHeight + linebreak);
    //=================================Test Results===========================================
    // plannedTitleHeight = getTextHeight(pdf, 'TEST RESULTS', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('TEST RESULTS', leftAlign, contentHeight);
    contentHeight += (lineHeight + 5);

    pdf.text('DETAILED TEST RESULTS', leftAlign, contentHeight);
    contentHeight += (lineHeight + 5);

    const testResultHeader = [
      { header: "Sr No", dataKey: "Sl_No" },
      { header: "Business Group /Function", dataKey: "BusinessFunction" },
      { header: "Recovery as per documented procedure(Yes/No)", dataKey: "RecoveryProcedures" },
      { header: "If not, please provide information", dataKey: "AdditionalInformation" },
      { header: "Result(Successful/Partially Successful /Failed)", dataKey: "Result" }
    ];

    const testResultData = data.BusinessFunctions;
    // below Array Format from API(data.BusinessFunctions)
    // [
    //   { Sl_No: "1", BusinessFunction: "AMLAK Head office not available", RecoveryProcedures: "Yes",AdditionalInformation : "",Result:"Successful" }
    // ];

    autoTable(pdf, {
      columns: testResultHeader,
      body: testResultData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.001, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.001, lineColor: [0, 0, 0] },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      },
    });

    contentHeight = (tableHeight + linebreak);
    //=========================================Over-All Test Report=========================================
    // plannedTitleHeight = getTextHeight(pdf, 'OVERALL TEST RESULT', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('OVERALL TEST RESULT', leftAlign, contentHeight);
    contentHeight += lineHeight;

    let TestResult = data.OverAllReport;
    // below Array Format from API(data.OverAllReport)
    //   [
    //     {
    //         "overAllStatusID": 1,
    //         "overAllStatus": "Successful",
    //         "percentage": "25%"
    //     },
    //     {
    //         "overAllStatusID": 2,
    //         "overAllStatus": "Partially Successful",
    //         "percentage": "50%"
    //     },
    //     {
    //         "overAllStatusID": 3,
    //         "overAllStatus": "Failed",
    //         "percentage": "0%"
    //     }
    // ]
    const overallHeaders = [
      { header: "Final Test Result", dataKey: "test_result" },
      { header: "Successful (%)", dataKey: "successful" },
      { header: "Partially Successful (%)", dataKey: "partial_successful" },
      { header: "Failure (%)", dataKey: "failure" },
    ];


    const overallData = [
      { test_result: "", successful: ` ${TestResult[0].percentage}`, partial_successful: `${TestResult[1].percentage}`, failure: `${TestResult[2].percentage}` },
    ];

    autoTable(pdf, {
      columns: overallHeaders,
      body: overallData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: leftAlign, right: 55 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.01, lineColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.01, lineColor: [0, 0, 0], cellWidth: 76, halign: 'center', valign: 'middle'},
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      },
      didParseCell: function (data: any) {
        if (data.section === 'head' && data.row.index === 0 && data.column.dataKey === 'test_result') {
          data.cell.rowSpan = 2;
          data.cell.styles.valign = 'middle';
        }
        if (data.column.dataKey === 'test_result') {
          data.cell.styles.cellWidth = 110;
        }
      }
    });

    contentHeight = (tableHeight + linebreak);


    //=================================Test Observations and Learnings===========================================
    // plannedTitleHeight = getTextHeight(pdf, 'OVERALL TEST OBSERVATIONS AND LEARNING', 10);
    // checkAndAddPage(plannedTitleHeight);
    pdf.text('OVERALL TEST OBSERVATIONS AND LEARNING', leftAlign, contentHeight);
    contentHeight += lineHeight;

    const testObservationHeader = [
      { header: "Sr No", dataKey: "Sl_No" },
      { header: "Test Observation/Learning", dataKey: "TestObservation" },
      { header: "Action Item(s)", dataKey: "ActionItem" },
      { header: "Responsibility(Action Item Owner)", dataKey: "ActionItemOwner" },
      { header: "Target Date", dataKey: "FormatedDate" }
    ];

    data.ActionItems = data.ActionItems.map((x: any) => {
      x.FormatedDate = dateToYMd(this.utils.formatDate(x.TargetDate));
      return x;
    });
    const testObservationData = data.ActionItems;
    // below Array Format from API(data.ActionItems)
    //  [
    //    { Sl_No: "1", TestObservation: "AMLAK Head office not available", ActionItem: "actionitem1",ActionItemOwner : "responsibility2dfdf",TargetDate:"May 12,2023" }
    //  ];

    autoTable(pdf, {
      columns: testObservationHeader,
      body: testObservationData,
      startY: contentHeight,
      theme: 'grid',
      styles: { fontSize: 10 },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.01, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 229, 229], textColor: [38, 38, 38], lineWidth: 0.01, lineColor: [0, 0, 0] },
      margin: { left: leftAlign, right: 55 },
      didDrawPage: (d: any) => {
        tableHeight = d.cursor.y;
      },
    });

    // Generate pages and print
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        (pdf.internal.pageSize.width/2) - 15,
        pdf.internal.pageSize.height - 15
      );
    }

    let FullReportName = 'Test_Report' + '_'
    + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.pdf';
    pdf.save(FullReportName);
  }
  // Download Report Draft -- Method - starts

  // Common Methods
  // 2020-09-18T16:28:45.000Z to 18/092020 04:28PM
  dateToStringWithTimeStamp(dateo: String, includeDate = true, includeTime = true, includeAMPM = true, seperator: any = '/') {
    if (dateo) {
      const ary = dateo.split('T');
      const aryd = ary[0].split('-');
      const aryt = ary[1].split('.')[0].split(':');
      let date = "";
      if (includeDate)
        date = aryd[1] + seperator + aryd[2] + seperator + aryd[0];
      if (includeTime) {
        if (date != "")
          date += " ";
        if (includeAMPM) {
          date += this.convertTime(((dateo || '').split('T')[1]).split('.')[0]);
        } else {
          date += aryt[0] + ':' + aryt[1] + ':' + aryt[2];
        }
      }
      return date;
    } else {
      return null;
    }
  }

  convertTime(timeString: any) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = (hours % 12) || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  getTitleValue(title: any) {
    return title?.length > 100? ((title).substring(0, 100)+'...'): title;
  }

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

  parsedHTML(text : any) {
    const dom = new DOMParser().parseFromString('<!doctype html><body>' + text, 'text/html');
    const decodedString = dom.body.textContent;
    return decodedString;
  }

  //download Crisis Attachment -- Methods -start
  downloadFile(atchmtId: any) {
    let data = { "fileContentId": atchmtId }
    this.post('/business-continuity-management/bcms-testing/download-bcmstest-evidence', { data }).subscribe(res => {
      if (res.success == 1) {
        const TYPED_ARRAY = new Uint8Array(res.result.attachmentDetails[0].FileContent.data);
        const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, ''));
        const fileMetaType = res.result.attachmentDetails[0].AttachmentType;
        const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
        const blob = new Blob([blobData], { type: fileMetaType });
        saveAs(blob, res.result.attachmentDetails[0].AttachmentName)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage);
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
  //download Crisis Attachment -- Methods -end
}
