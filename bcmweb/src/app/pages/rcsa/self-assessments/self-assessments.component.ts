import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { SelfAssessmentsService } from 'src/app/services/rcsa/self-assessments/self-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { NewScheduleSelfAssessmentsComponent } from './new-schedule-self-assessments/new-schedule-self-assessments.component';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { TableUtil } from "src/app/pages/rcsa/inherent-risk/tableUtil";
import * as XLSX from "xlsx";
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

export interface DataModel {
  RowNumber?: number,
  RCSACode: string;
  Period: string;
  Description: string;
  ProposedStartDate: Date;
  ProposedEndDate: Date;
  Reviewer1: string;
  Reviewer1ID: number;
  Reviewer2: string;
  Reviewer2ID: number;
  Status: string;
  IsActive: boolean;
  ScheduleAssesmentID?: number;
}
@Component({
  selector: 'app-self-assessments',
  templateUrl: './self-assessments.component.html',
  styleUrls: ['./self-assessments.component.scss']
})
export class SelfAssessmentsComponent implements OnInit {

  // displayedColumns: string[] = ['RCSACode',
  //   'Risk',
  //   'RCSAStatus',
  //   'Group',
  //   'Unit',
  //   'RiskCategory',
  //   'Process',
  //   'InherentLikehoodRating',
  //   'InherentImpactRating',
  //   'OverallInherentRiskRating',
  //   'ControlDescription',
  //   'ControlinPlace',
  //   'ControlType',
  //   'NatureofControl',
  //   'LevelofAutomation',
  //   'Frequency',
  //   'OverallControlEnvironment',
  //   'ResidualRiskRating',
  //   'RiskResponse',
  //   'RiskResponsiblePerson',
  //   'IdentifiedAction',
  //   'ActionResponsiblePerson',
  //   'Timeline',
  //   'Status',
  //   'Comments',
  //   'ConfirmationOrVerification',
  //   'CurrentQuaterControlTest',
  //   'Comments1'
  //   //,'Action'
  // ];

  displayedColumns: string[] = ['SLNo',
    'Group',
    'Unit',
    'Risk',
    'ScheduleInherentRiskStatus',
    'OverallInherentRiskRating',
    'OverallControlEnvironment',
    'ResidualRiskRating',
    'Comments',
    //,'Action'
  ];
  dataSource!: MatTableDataSource<DataModel>;
  dataSourceAssessmentCard: any;
  saveerror: string = "";
  summaryGroupHeadText: string = "In Progress";
  summaryGroupHeadSubText: string = "Details";
  showRiskStatus: boolean = false;
  showInherentRiskStatus: boolean = false;
  showInherentRatingStatus: boolean = false;
  showInherentProcessStatus: boolean = false;
  showcontrolFrequencyStatus: boolean = false;
  showControlAssessmentStatus: boolean = false;
  showcontrolTestingStatus: boolean = false;
  showActionPlanStatus: boolean = false;
  showActionPlanCommentStatus: boolean = false;
  percentageValue: any;
  scheduleAssessmentID: any;
  scheduleAssessmentData: any;
  controlAssessmentSpan!: number;
  inherentRateSpan!: number;
  showexportData: boolean = false;
  actionPlanStatusSpan!: number;
  rcsaSelfAssessmentHeader: any;
  datanotFound!: string;
  isFunctionalAdmin: boolean = false;
  isShowSubmitbtn:boolean=false;
  indexData:any = 0;
  UnitNames : boolean=false;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  SelfAssessmentSummaryList: any =[];

  constructor(private service: ScheduleAssessmentsService,
    private selfAssessmentsService: SelfAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    private router: Router,
    private datepipe: DatePipe,
    @Inject(DOCUMENT) private _document: any,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.scheduleAssessmentID = Number(this.activatedRoute.snapshot.params['id'] ?? 0);
    // this.scheduleAssessmentData = history.state;
    // this.scheduleAssessmentID = this.scheduleAssessmentData?.ScheduleAssessmentID;
    this.getPageLoad();
    this.controlAssessmentSpan = this.showControlAssessmentStatus ? 2 : 7;
    this.inherentRateSpan = this.showInherentRiskStatus ? 3 : 10;
    this.actionPlanStatusSpan = this.showActionPlanStatus ? 1 : 6;
    this.isFunctionalAdmin = this.utils.isFunctionalAdmin();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((item:any) => {
      let filteredItem = { ...item };
      delete filteredItem.UnitIDs
      return filteredItem;
  });

    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.showexportData = this.dataSource.filteredData && this.dataSource.filteredData.length > 0;
  }
  
  getTooltip(row: any, value: any) {
    if (row[value])
      return row[value];
    else
      return "";
  }

  exportAsXLSX() {
    let obj: any = [];
    if (this.dataSource.filteredData.length > 0) {
      this.dataSource.filteredData.forEach((m: any) => {
        obj.push({
          "RCSA Code": m.RCSACode,
          SLNO: m.SLNO,
          Group: m.GroupName,
          Unit: m.UnitName,
          Status: m.ScheduleInherentRiskStatusName,
          "Risk Category": m.RiskCategoryName,
          Process: m.ProcessName,
          Risk: m.Risk,
          "Likelihood Rating": m.InherentLikelihoodName,
          "Impact Rating": m.InherentImpactRatingName,
          //OverallInherentRisk: m.OverallInherentRiskID,
          "Overall Inherent Risk Rating": m.OverallInherentRiskRating,
          "Control Description": m.ControlDescription,
          "Control In Pace": m.ControlInPaceName,
          "Control Type": m.ControlTypeName,
          "Control Nature": m.ControlNatureName,
          "Control Automation": m.ControlAutomationName,
          "Control Frequency": m.ControlFrequencyName,
          "Overall Control Environment Risk Rating": m.OverallControlEnvironmentRiskRating,
          "Residual Risk Rating": m.ResidualRiskRating,
          "Residual Risk Response": m.ResidualRiskResponseName,
          "Residual Risk Responsible Person": m.ResidualRiskResponsiblePersonName,
          "Identified Action": m.IdentifiedAction,
          "Action Responsible Person": m.ActionResponsiblePersonName,
          Timeline: m.Timeline != null ? this.datepipe.transform(new Date(m.Timeline), 'dd MMM yyyy') : '',
          "Action Plan Status": m.ActionPlanStatusName,
          "Action Plan Comments": m.ActionPlanComments,
          "Confirmation/Verification of Closure": m.ControlVerificationClosureName,
          "Control Testing Result": m.ControlTestingResultName,
          "Control Testing Result Comment": m.ControlTestingResultComment,
          Comment: m.SelfComment//,
          //isActive: m.isActive
        });
      });
      TableUtil.exportArrayToExcel(obj, "Self_Schedule_Assessment");
    }

  }

  getPageLoad(): void {
    this.isShowSubmitbtn=false;
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": {
            "SelfAssessmentSummary": [
              {
                "RCSACode": "RCSA-001",
                "ScheduleInherentRiskID": 1,
                "Risk": "Insufficient time allowed for the budget setting process may lead to delays in obtaining necessary approvals and clear directions to Management.",
                "RCSAStatusID": 3,
                "RCSAStatusName": "Completed",
                "GroupID": 5,
                "GroupName": "Finance",
                "UnitID": 10,
                "UnitName": "Financial Reporting & Planning",
                "RiskCategoryID": 2,
                "RiskCategoryName": "Financial",
                "ProcessID": 5,
                "ProcessName": "Planning",
                "InherentLikelihoodID": 10,
                "InherentLikelihoodName": "Very Likely",
                "InherentImpactRatingID": 3,
                "InherentImpactRatingName": "Moderate",
                "OverallInherentRiskID": "Moderate Risk",
                "OverallInherentRiskScore": 12,
                "OverallInherentRiskRating": "Moderate Risk",
                "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
                "ControlInPaceID": 3,
                "ControlInPaceName": "Yes",
                "ControlTypeID": 1,
                "ControlTypeName": "Policy",
                "ControlNatureID": 3,
                "ControlNatureName": "Detective",
                "ControlAutomationID": 3,
                "ControlAutomationName": "Manual",
                "ControlFrequencyID": 3,
                "ControlFrequencyName": "Yes",
                "OverallControlTotalScore": 4,
                "OverallControlEnvironmentRiskRating": "Ineffective",
                "OverallControlEnvironmentRatingColourCode": null,
                "ResidualRiskRating": null,
                "ResidualRiskRatingColourCode": null,
                "ResidualRiskResponseID": 1,
                "ResidualRiskResponseName": "Tolerate",
                "ResidualRiskResponsiblePersonID": 1,
                "ResidualRiskResponsiblePersonName": "Vice President",
                "IdentifiedAction": "Budgeting module will be automated/enhanced in due course.",
                "ActionResponsiblePersonID": 1,
                "ActionResponsiblePersonName": "test@lucidspire.com",
                "Timeline": "2022-12-18T00:00:00.000Z",
                "ActionPlanStatusID": 1,
                "ActionPlanStatusName": "Open",
                "ActionPlanComments": "1.1 - Action Plan Comment",
                "ControlVerificationClosureID": 1,
                "ControlVerificationClosureName": "Yes",
                "ControlTestingResultID": 1,
                "ControlTestingResultName": "Successful",
                "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedBy": "456",
                "CreatedDate": "2022-12-18T00:45:00.450Z",
                "LastUpdatedBy": null,
                "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
                "MasterInherentRiskID": 1,
                "SLNO": "FR-001",
                "ScheduleInherentRiskStatusID": 5,
                "ScheduleInherentRiskStatusName": "Approved",
                "ISSubmitEnabled": false
              },
              {
                "RCSACode": "RCSA-001",
                "ScheduleInherentRiskID": 2,
                "Risk": "Errors in accounting transactions may not be identified and addressed promptly, resulting in inaccurate and/or incomplete periodic reporting.",
                "RCSAStatusID": 3,
                "RCSAStatusName": "Completed",
                "GroupID": 5,
                "GroupName": "Finance",
                "UnitID": 10,
                "UnitName": "Financial Reporting & Planning",
                "RiskCategoryID": 1,
                "RiskCategoryName": "Strategic",
                "ProcessID": 5,
                "ProcessName": "Planning",
                "InherentLikelihoodID": 10,
                "InherentLikelihoodName": "Very Likely",
                "InherentImpactRatingID": 4,
                "InherentImpactRatingName": "Major",
                "OverallInherentRiskID": "High Risk",
                "OverallInherentRiskScore": 16,
                "OverallInherentRiskRating": "High Risk",
                "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
                "ControlInPaceID": 3,
                "ControlInPaceName": "Yes",
                "ControlTypeID": 1,
                "ControlTypeName": "Policy",
                "ControlNatureID": 3,
                "ControlNatureName": "Detective",
                "ControlAutomationID": 3,
                "ControlAutomationName": "Manual",
                "ControlFrequencyID": 3,
                "ControlFrequencyName": "Yes",
                "OverallControlTotalScore": 4,
                "OverallControlEnvironmentRiskRating": "Ineffective",
                "OverallControlEnvironmentRatingColourCode": null,
                "ResidualRiskRating": null,
                "ResidualRiskRatingColourCode": null,
                "ResidualRiskResponseID": 1,
                "ResidualRiskResponseName": "Tolerate",
                "ResidualRiskResponsiblePersonID": 1,
                "ResidualRiskResponsiblePersonName": "Vice President",
                "IdentifiedAction": "Budgeting module will be automated/enhanced in due course.",
                "ActionResponsiblePersonID": 1,
                "ActionResponsiblePersonName": "test@lucidspire.com",
                "Timeline": "2022-12-18T00:00:00.000Z",
                "ActionPlanStatusID": 2,
                "ActionPlanStatusName": "Closed",
                "ActionPlanComments": "1.1 - Action Plan Comment",
                "ControlVerificationClosureID": 1,
                "ControlVerificationClosureName": "Yes",
                "ControlTestingResultID": 1,
                "ControlTestingResultName": "Successful",
                "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedBy": "456",
                "CreatedDate": "2022-12-18T00:45:00.450Z",
                "LastUpdatedBy": null,
                "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
                "MasterInherentRiskID": 2,
                "SLNO": "FR-002",
                "ScheduleInherentRiskStatusID": 5,
                "ScheduleInherentRiskStatusName": "Approved",
                "ISSubmitEnabled": false
              },
              {
                "RCSACode": "RCSA-001",
                "ScheduleInherentRiskID": 3,
                "Risk": "Inability to rely on historical data during the budget setting process due to constant changes in the market macros.",
                "RCSAStatusID": 3,
                "RCSAStatusName": "Completed",
                "GroupID": 5,
                "GroupName": "Finance",
                "UnitID": 10,
                "UnitName": "Financial Reporting & Planning",
                "RiskCategoryID": 1,
                "RiskCategoryName": "Strategic",
                "ProcessID": 5,
                "ProcessName": "Planning",
                "InherentLikelihoodID": 9,
                "InherentLikelihoodName": "Likely",
                "InherentImpactRatingID": 4,
                "InherentImpactRatingName": "Major",
                "OverallInherentRiskID": "Moderate Risk",
                "OverallInherentRiskScore": 12,
                "OverallInherentRiskRating": "Moderate Risk",
                "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
                "ControlInPaceID": 3,
                "ControlInPaceName": "Yes",
                "ControlTypeID": 1,
                "ControlTypeName": "Policy",
                "ControlNatureID": 3,
                "ControlNatureName": "Detective",
                "ControlAutomationID": 3,
                "ControlAutomationName": "Manual",
                "ControlFrequencyID": 3,
                "ControlFrequencyName": "Yes",
                "OverallControlTotalScore": 4,
                "OverallControlEnvironmentRiskRating": "Ineffective",
                "OverallControlEnvironmentRatingColourCode": null,
                "ResidualRiskRating": null,
                "ResidualRiskRatingColourCode": null,
                "ResidualRiskResponseID": 1,
                "ResidualRiskResponseName": "Tolerate",
                "ResidualRiskResponsiblePersonID": 1,
                "ResidualRiskResponsiblePersonName": "Vice President",
                "IdentifiedAction": null,
                "ActionResponsiblePersonID": null,
                "ActionResponsiblePersonName": null,
                "Timeline": null,
                "ActionPlanStatusID": null,
                "ActionPlanStatusName": null,
                "ActionPlanComments": null,
                "ControlVerificationClosureID": null,
                "ControlVerificationClosureName": null,
                "ControlTestingResultID": 1,
                "ControlTestingResultName": "Successful",
                "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
                "IsActive": true,
                "IsDeleted": false,
                "CreatedBy": "456",
                "CreatedDate": "2022-12-18T00:45:00.450Z",
                "LastUpdatedBy": null,
                "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
                "MasterInherentRiskID": 3,
                "SLNO": "FR-003",
                "ScheduleInherentRiskStatusID": 5,
                "ScheduleInherentRiskStatusName": "Approved",
                "ISSubmitEnabled": false
              }],
            "ScheduleAssessmentCard": [
              {
                "ScheduleInherentRiskStatusID": 1,
                "ScheduleInherentRiskStatusName": "New",
                "TotalValue": 6,
                "PercentageValue": 24.25
              },
              {
                "ScheduleInherentRiskStatusID": 0,
                "ScheduleInherentRiskStatusName": "Total",
                "TotalValue": 6,
                "PercentageValue": 24.25
              }
            ]
          }
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processScheduleAssessments(data, false);
      this.processAssessmentCard(data);

    } else {

      let obj = { "id": this.scheduleAssessmentID };
      this.configScoreRatingService.getSelfAssessmentDashboardScreen(obj).subscribe(data => {
        next: {
          if (data.success == 1) {
            this.processScheduleAssessments(data, false);
            this.processAssessmentCard(data);
          } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
          }
        }
      });
    }

  }

  submitScheduleAssessment(): void {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Risk",
        content: "Are you sure you want to submit all the Risks in draft status?"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        let req = {
          id: this.scheduleAssessmentID
        };
        this.selfAssessmentsService.submitSelfAssessment(req).subscribe(res => {
          if (res.success == 1) {
            next:
            this.saveSuccess(res.message);
            this.getPageLoad();
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveError(res.error.errorMessage);
            //this.saveerror = res.error.errorMessage;
          }

        });

      }
    });

  }


  processScheduleAssessments(gridData: any, isfilter: boolean = false): void {    
    if (gridData.success == 1) {
      if (!isfilter && gridData.result.recordset.ScheduleAssessment?.length > 0) {        
        let assessmentData              = gridData.result.recordset.ScheduleAssessment[0];
        this.SelfAssessmentSummaryList  = gridData.result.recordset.SelfAssessmentSummary;    
        if (this.SelfAssessmentSummaryList.length) {
          let unitData = [...new Set(this.SelfAssessmentSummaryList.map((n:any) => n.UnitName))]
          let userLoggedData = this.utils.isLoggedInUserUnitData();
          if(userLoggedData.some((item:any) => unitData.includes(item.UnitName))) {
            this.UnitNames = true;
            console.log('✌️unitData --->', unitData);
          } 
          console.log('✌️this.utils.isLoggedInUserUnitData() --->', this.utils.isLoggedInUserUnitData());

        } else {
          this.UnitNames = false;
        }        
        console.log('sakjhkjshc  this.UnitNames'+ this.UnitNames);
        this.rcsaSelfAssessmentHeader = {
          RCSACode: assessmentData.RCSACode,
          ProposedStartDate: assessmentData.ProposedStartDate,
          ProposedCompletionDate: assessmentData.ProposedCompletionDate,
          Status: assessmentData.RCSAStatusName,
          Period: assessmentData.SchedulePeriod
        }
        this.isShowSubmitbtn = !assessmentData.ISReviewer;
        console.log(' this.isShowSubmitbtn: '+ this.isShowSubmitbtn)
      }
      else if (!isfilter) {
        this.rcsaSelfAssessmentHeader = {
          RCSACode: '-',
          ProposedStartDate: null,
          ProposedCompletionDate: null,
          Status: "-",
          Period: " - "
        }
      }
      if (gridData.result.recordset.SelfAssessmentSummary.length > 0) {
        let docs  = gridData.result.recordset.SelfAssessmentSummary;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
            this.scheduleAssessmentID = doc.ScheduleAssessmentID;
          })
          
          this.dataSource = new MatTableDataSource(docs);
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }
      else {
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
      this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
    } else {
      if (gridData.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
      else {
        this.rcsaSelfAssessmentHeader = {
          RCSACode: '-',
          ProposedStartDate: null,
          ProposedCompletionDate: null,
          Status: "-",
          Period: " - "
        }
      }
    }
    if (this.rcsaSelfAssessmentHeader.RCSACode == '-') {
      this.datanotFound = "No RCSA is in In-progress";
    } else if((gridData.result.recordset.ScheduleAssessment.length > 0 && gridData.result.recordset.SelfAssessmentSummary.length == 0)) {
      this.datanotFound = "No Relevant Inherent Risk found.";
    } 
    else {
      this.datanotFound = "";
    }
  }

  navigateDetails(data: any): void {
    this.manageSelfAssessmentDetails(data);
  }

  // getRCSAdetails(data: any): void {
  //   const assesment = this.dialog.open(NewScheduleSelfAssessmentsComponent, {
  //     disableClose: true,
  //     width: "150vh",
  //     minHeight: "60vh",
  //     data: {
  //       "mode": "add"
  //     }
  //   })
  //   assesment.afterClosed().subscribe(result => {

  //     this.getgriddata(this.scheduleAssessmentID);
  //   })
  // }
  // initiateAdd(): void {
  //   const assesment = this.dialog.open(NewScheduleSelfAssessmentsComponent, {
  //     disableClose: true,
  //     width: "200vh",
  //     minHeight: "80vh",
  //     data: {
  //       "mode": "add"
  //     }
  //   })
  //   assesment.afterClosed().subscribe(result => {

  //     this.getgriddata(this.scheduleAssessmentID);
  //   })
  //   //this.adddg = true;
  // }

  // editData(data: any): void {
  //   data.mode = "edit";
  //   const assesment = this.dialog.open(NewScheduleSelfAssessmentsComponent, {
  //     disableClose: true,
  //     width: "60vh",
  //     minHeight: "60vh",
  //     data: data
  //   })
  //   assesment.afterClosed().subscribe(result => {

  //     this.getgriddata(this.scheduleAssessmentID);
  //   })
  // }
  CollapseShowRiskStatus() {
    this.showRiskStatus = !this.showRiskStatus;
    this.CollapseShowInherentRiskStatus();
  }

  CollapseShowInherentRiskStatus() {
    this.showInherentRiskStatus = this.showInherentRatingStatus = this.showInherentProcessStatus = this.showRiskStatus = !this.showInherentRiskStatus;
    this.inherentRateSpan = this.showInherentRiskStatus ? 3 : 10;
  }

  CollapseShowInherentRatingStatus() {
    this.showInherentRatingStatus = !this.showInherentRatingStatus;
    this.inherentRateSpan = this.showInherentRatingStatus ? 8 : 10;
  }

  CollapseShowInherentProcessStatus() {
    this.showInherentRatingStatus = this.showInherentProcessStatus = !this.showInherentProcessStatus;
    this.inherentRateSpan = this.showInherentProcessStatus ? 6 : 10;
  }

  CollapseShowControlFrequencyStatus() {
    this.showcontrolFrequencyStatus = !this.showcontrolFrequencyStatus;
    this.controlAssessmentSpan = this.showcontrolFrequencyStatus ? 3 : 7;
  }

  CollapseShowControlAssessmentStatus() {
    this.showControlAssessmentStatus = this.showcontrolFrequencyStatus = !this.showControlAssessmentStatus;
    this.controlAssessmentSpan = this.showControlAssessmentStatus ? 2 : 7;
  }

  CollapseShowControlTestingStatus() {
    this.showcontrolTestingStatus = !this.showcontrolTestingStatus;
  }

  CollapseShowActionPlanCommentStatus() {
    this.showActionPlanCommentStatus = !this.showActionPlanCommentStatus;
    this.actionPlanStatusSpan = this.showActionPlanCommentStatus ? 3 : 6;
  }

  CollapseShowActionPlanStatus() {
    this.showActionPlanStatus = this.showActionPlanCommentStatus = !this.showActionPlanStatus;
    this.actionPlanStatusSpan = this.showActionPlanStatus ? 1 : 6;
  }

  changed(data: any): void {
    let obj = {
      "id": data.ControlAutomationID,
      "isActive": !data.IsActive
    }
    this.service.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        //this.changeDetectorRefs.detectChanges();
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
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

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();

        this.getPageLoad();
      }, timeout)
    });
  }

  saveError(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "error",
      data: {
        title: "Failed",
        content: content
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();

        this.getPageLoad();
      }, timeout)
    });
  }

  manageSelfAssessmentDetails(data: any): void {
    let req = this.dataSource.filteredData.map((item: any) => item.ScheduleInherentRiskID);
    localStorage.setItem('SelfAssessmentDetailsScheduleInherentRiskIDs', JSON.stringify(req));
    this.router.navigate(['self-assessments', 'self-assessments-details', data.ScheduleInherentRiskID]);
  }
  getAssessmentCard(data: any) {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ScheduleInherentRiskStatusID": 1,
              "ScheduleInherentRiskStatusName": "New",
              "TotalValue": 6,
              "PercentageValue": 24.25
            },
            {
              "ScheduleInherentRiskStatusID": 0,
              "ScheduleInherentRiskStatusName": "Total",
              "TotalValue": 6,
              "PercentageValue": 24.25
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Schedule Assessment Cards fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processAssessmentCard(data);
    } else {
      let obj = { id: data };
      this.service.getAssessmentCard(obj).subscribe(res => {
        next:
        this.processAssessmentCard(res);
      });
    }
  }

  processAssessmentCard(data: any): void {

    if (data.success == 1) {
      if (data.result.recordset.ScheduleAssessmentCard.length > 0) {
        let docs = data.result.recordset.ScheduleAssessmentCard;
        if (docs) {

          const result = data.result.recordset.ScheduleAssessmentCard.filter((s: any) => s.ScheduleInherentRiskStatusName == "Total");
          this.rcsaSelfAssessmentHeader.TotalPercentage = result[0].PercentageValue;
          this.dataSourceAssessmentCard = data.result.recordset.ScheduleAssessmentCard;
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getStatusFilter(id: any,index:any) { 
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Self Assessment Summary fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "RCSACode": "RCSA-001",
              "ScheduleInherentRiskID": 1,
              "Risk": "Insufficient time allowed for the budget setting process may lead to delays in obtaining necessary approvals and clear directions to Management.",
              "RCSAStatusID": 3,
              "RCSAStatusName": "Completed",
              "GroupID": 5,
              "GroupName": "Finance",
              "UnitID": 10,
              "UnitName": "Financial Reporting & Planning",
              "RiskCategoryID": 2,
              "RiskCategoryName": "Financial",
              "ProcessID": 5,
              "ProcessName": "Planning",
              "InherentLikelihoodID": 10,
              "InherentLikelihoodName": "Very Likely",
              "InherentImpactRatingID": 3,
              "InherentImpactRatingName": "Moderate",
              "OverallInherentRiskID": "Moderate Risk",
              "OverallInherentRiskScore": 12,
              "OverallInherentRiskRating": "Moderate Risk",
              "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
              "ControlInPaceID": 3,
              "ControlInPaceName": "Yes",
              "ControlTypeID": 1,
              "ControlTypeName": "Policy",
              "ControlNatureID": 3,
              "ControlNatureName": "Detective",
              "ControlAutomationID": 3,
              "ControlAutomationName": "Manual",
              "ControlFrequencyID": 3,
              "ControlFrequencyName": "Yes",
              "OverallControlTotalScore": 4,
              "OverallControlEnvironmentRiskRating": "Ineffective",
              "OverallControlEnvironmentRatingColourCode": null,
              "ResidualRiskRating": null,
              "ResidualRiskRatingColourCode": null,
              "ResidualRiskResponseID": 1,
              "ResidualRiskResponseName": "Tolerate",
              "ResidualRiskResponsiblePersonID": 1,
              "ResidualRiskResponsiblePersonName": "Vice President",
              "IdentifiedAction": "Budgeting module will be automated/enhanced in due course.",
              "ActionResponsiblePersonID": 1,
              "ActionResponsiblePersonName": "test@lucidspire.com",
              "Timeline": "2022-12-18T00:00:00.000Z",
              "ActionPlanStatusID": 1,
              "ActionPlanStatusName": "Open",
              "ActionPlanComments": "1.1 - Action Plan Comment",
              "ControlVerificationClosureID": 1,
              "ControlVerificationClosureName": "Yes",
              "ControlTestingResultID": 1,
              "ControlTestingResultName": "Successful",
              "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedBy": "456",
              "CreatedDate": "2022-12-18T00:45:00.450Z",
              "LastUpdatedBy": null,
              "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
              "MasterInherentRiskID": 1,
              "SLNO": "FR-001",
              "ScheduleInherentRiskStatusID": 5,
              "ScheduleInherentRiskStatusName": "Approved",
              "ISSubmitEnabled": false
            },
            {
              "RCSACode": "RCSA-001",
              "ScheduleInherentRiskID": 2,
              "Risk": "Errors in accounting transactions may not be identified and addressed promptly, resulting in inaccurate and/or incomplete periodic reporting.",
              "RCSAStatusID": 3,
              "RCSAStatusName": "Completed",
              "GroupID": 5,
              "GroupName": "Finance",
              "UnitID": 10,
              "UnitName": "Financial Reporting & Planning",
              "RiskCategoryID": 1,
              "RiskCategoryName": "Strategic",
              "ProcessID": 5,
              "ProcessName": "Planning",
              "InherentLikelihoodID": 10,
              "InherentLikelihoodName": "Very Likely",
              "InherentImpactRatingID": 4,
              "InherentImpactRatingName": "Major",
              "OverallInherentRiskID": "High Risk",
              "OverallInherentRiskScore": 16,
              "OverallInherentRiskRating": "High Risk",
              "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
              "ControlInPaceID": 3,
              "ControlInPaceName": "Yes",
              "ControlTypeID": 1,
              "ControlTypeName": "Policy",
              "ControlNatureID": 3,
              "ControlNatureName": "Detective",
              "ControlAutomationID": 3,
              "ControlAutomationName": "Manual",
              "ControlFrequencyID": 3,
              "ControlFrequencyName": "Yes",
              "OverallControlTotalScore": 4,
              "OverallControlEnvironmentRiskRating": "Ineffective",
              "OverallControlEnvironmentRatingColourCode": null,
              "ResidualRiskRating": null,
              "ResidualRiskRatingColourCode": null,
              "ResidualRiskResponseID": 1,
              "ResidualRiskResponseName": "Tolerate",
              "ResidualRiskResponsiblePersonID": 1,
              "ResidualRiskResponsiblePersonName": "Vice President",
              "IdentifiedAction": "Budgeting module will be automated/enhanced in due course.",
              "ActionResponsiblePersonID": 1,
              "ActionResponsiblePersonName": "test@lucidspire.com",
              "Timeline": "2022-12-18T00:00:00.000Z",
              "ActionPlanStatusID": 2,
              "ActionPlanStatusName": "Closed",
              "ActionPlanComments": "1.1 - Action Plan Comment",
              "ControlVerificationClosureID": 1,
              "ControlVerificationClosureName": "Yes",
              "ControlTestingResultID": 1,
              "ControlTestingResultName": "Successful",
              "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedBy": "456",
              "CreatedDate": "2022-12-18T00:45:00.450Z",
              "LastUpdatedBy": null,
              "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
              "MasterInherentRiskID": 2,
              "SLNO": "FR-002",
              "ScheduleInherentRiskStatusID": 5,
              "ScheduleInherentRiskStatusName": "Approved",
              "ISSubmitEnabled": false
            },
            {
              "RCSACode": "RCSA-001",
              "ScheduleInherentRiskID": 3,
              "Risk": "Inability to rely on historical data during the budget setting process due to constant changes in the market macros.",
              "RCSAStatusID": 3,
              "RCSAStatusName": "Completed",
              "GroupID": 5,
              "GroupName": "Finance",
              "UnitID": 10,
              "UnitName": "Financial Reporting & Planning",
              "RiskCategoryID": 1,
              "RiskCategoryName": "Strategic",
              "ProcessID": 5,
              "ProcessName": "Planning",
              "InherentLikelihoodID": 9,
              "InherentLikelihoodName": "Likely",
              "InherentImpactRatingID": 4,
              "InherentImpactRatingName": "Major",
              "OverallInherentRiskID": "Moderate Risk",
              "OverallInherentRiskScore": 12,
              "OverallInherentRiskRating": "Moderate Risk",
              "ControlDescription": "1- Budget is prepared on annual basis in consistent with the foreseeable targets and objectives of the company2- Budgets are reviewed at adequate levels to ensure compliance with growth targets of the company",
              "ControlInPaceID": 3,
              "ControlInPaceName": "Yes",
              "ControlTypeID": 1,
              "ControlTypeName": "Policy",
              "ControlNatureID": 3,
              "ControlNatureName": "Detective",
              "ControlAutomationID": 3,
              "ControlAutomationName": "Manual",
              "ControlFrequencyID": 3,
              "ControlFrequencyName": "Yes",
              "OverallControlTotalScore": 4,
              "OverallControlEnvironmentRiskRating": "Ineffective",
              "OverallControlEnvironmentRatingColourCode": null,
              "ResidualRiskRating": null,
              "ResidualRiskRatingColourCode": null,
              "ResidualRiskResponseID": 1,
              "ResidualRiskResponseName": "Tolerate",
              "ResidualRiskResponsiblePersonID": 1,
              "ResidualRiskResponsiblePersonName": "Vice President",
              "IdentifiedAction": null,
              "ActionResponsiblePersonID": null,
              "ActionResponsiblePersonName": null,
              "Timeline": null,
              "ActionPlanStatusID": null,
              "ActionPlanStatusName": null,
              "ActionPlanComments": null,
              "ControlVerificationClosureID": null,
              "ControlVerificationClosureName": null,
              "ControlTestingResultID": 1,
              "ControlTestingResultName": "Successful",
              "ControlTestingResultComment": "1.1 - Control Testing Result Comment",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedBy": "456",
              "CreatedDate": "2022-12-18T00:45:00.450Z",
              "LastUpdatedBy": null,
              "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
              "MasterInherentRiskID": 3,
              "SLNO": "FR-003",
              "ScheduleInherentRiskStatusID": 5,
              "ScheduleInherentRiskStatusName": "Approved",
              "ISSubmitEnabled": false
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Self Assessment Summary fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processScheduleAssessments(data, true);
    } else {
      //from schedule assessments screen
      if (id !== undefined && id !== null) {
        let req = {
          id: this.scheduleAssessmentID,
          scheduleInherentRiskStatusID: id
        };
        this.selfAssessmentsService.getSelfAssessmentByStatus(req).subscribe(res => {
          next:
          this.processScheduleAssessments(res, true);
        });
      }
    }

    this.indexData = index;
  }

  navigateToPreviousPage() {
    this.router.navigateByUrl('schedule-assessments')
  }

  canSubmitAccess(): boolean {
    let result = false;
    if (this.utils.isStandardUser() && this.utils.isRiskManagementUnit()) {
      result = false
    } else if (this.utils.isPowerUser()) {
      result = true
    }
    return result;
  }
 
}
