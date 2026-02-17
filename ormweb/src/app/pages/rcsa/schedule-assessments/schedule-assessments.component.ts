import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { InprogressScheduleAssessmentsComponent } from './inprogress-schedule-assessments/inprogress-schedule-assessments.component';
import { CompletedScheduleAssessmentsComponent } from './completed-schedule-assessments/completed-schedule-assessments.component';
import { ScheduleAssessmentsDetailsComponent } from './schedule-assessments-details/schedule-assessments-details.component';
import { NewScheduleAssessmentsComponent } from './new-schedule-assessments/new-schedule-assessments.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { TableUtil } from "src/app/pages/rcsa/inherent-risk/tableUtil";
import * as XLSX from "xlsx";
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

export interface DataModel {
  RowNumber?: number,
  ScheduleAssessmentCode: string;
  SchedulePeriod: string;
  ScheduleAssessmentDescription: string;
  ProposedStartDate: Date;
  ProposedCompletionDate: Date;
  PrimaryReviewerName: string;
  Reviewer1ID: number;
  SecondaryReviewerName: string;
  Reviewer2ID: number;
  Status: string;
  IsActive: boolean;
  ScheduleAssesmentID?: number;
}

@Component({
  selector: 'app-schedule-assessments',
  templateUrl: './schedule-assessments.component.html',
  styleUrls: ['./schedule-assessments.component.scss']
})
export class ScheduleAssessmentsComponent implements OnInit {
  // @ts-ignore
  @ViewChild('TABLE') table: ElementRef;

  displayedColumns: string[] = ['RowNumber', 'ScheduleAssessmentCode', 'SchedulePeriod', 'ScheduleAssessmentDescription', 'ProposedStartDate', 'ProposedCompletionDate', 'PrimaryReviewerName', 'SecondaryReviewerName', 'Status', 'Action'];
  dataSource!: MatTableDataSource<DataModel>;
  dataSourceInprogress!: any;
  saveerror: string = "";
  assessmentYear: any;
  summaryGroupHeadText: string = "";
  summaryGroupHeadSubText: string = "";
  Legend1Color: string = "";
  Legend2Color: string = "";
  Legend3Color: string = "";
  noofUnits: string = "";
  units: string = "";
  Legend1Text: string = "";
  Legend2Text: string = "";
  Legend3Text: string = "";
  IsInprogress: boolean = true;
  // @ts-ignore
  selectedYears: number[] = [];
  iSCreateScheduleAssementEnabled: any;
  assessmentYears: any;
  assessmentCard: any;
  getAssessmentSummary: any;
  // @ts-ignore
  PeriodicElement: string[];
  showexportData: boolean = false;
  actionForm = new FormGroup({
    ddlyear: new FormControl(0),
    txtSearch: new FormControl(''),
  });
  disableMailIcon: boolean = true;
  checkPrevInprogressData:any = [];  
  prevInprogressData :any ='';
  // isPowerUser:boolean=false;

  // --- Quarter filter (multi-select) ---
  selectedQuarters: string[] = [];
  quarterOptions: { value: string, label: string }[] = [
    { value: 'Quarter 1', label: 'Quarter 1' },
    { value: 'Quarter 2', label: 'Quarter 2' },
    { value: 'Quarter 3', label: 'Quarter 3' },
    { value: 'Quarter 4', label: 'Quarter 4' }
  ];

  // --- Properties for ALL / Individual mode on list screen ---
  listSelectionMode: string = 'ALL';
  listFilterDepartmentIds: number[] = [];
  listFilterUnitIds: number[] = [];
  listDepartments: any[] = [];
  listAllUnits: any[] = [];

  /** Full unfiltered data for the selected year (used for client-side filtering) */
  private allAssessments: any[] = [];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service: ScheduleAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private datepipe: DatePipe,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router
  ) { }

  ngOnInit(): void { 
      this.getPageLoad();  

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
  }

  exportAsXLSX() {
    // TableUtil.exportTableToExcel("ScheduleAssessmentTable");

    ////To map the columns
    // const onlyNameAndSymbolArr: Partial<DataModel>[] = this.dataSource.map(x => ({
    //   ScheduleAssessmentCode: x.ScheduleAssessmentCode,
    //   SchedulePeriod: x.SchedulePeriod
    // }));
    let obj: any = [];
    if (this.dataSource.filteredData.length > 0) {
      this.dataSource.filteredData.forEach((m: any) => {
        obj.push({
          "Schedule Assessment Code": m.ScheduleAssessmentCode,
          "Schedule Period": m.SchedulePeriod,
          "Schedule Assessment Description": m.ScheduleAssessmentDescription,
          "Proposed Start Date": m.ProposedStartDate != null ? this.datepipe.transform(new Date(m.ProposedStartDate), 'dd MMM yyyy') : '',
          "Proposed CompletionDate": m.ProposedCompletionDate != null ? this.datepipe.transform(new Date(m.ProposedCompletionDate), 'dd MMM yyyy') : '',
          "Primary Reviewer": m.PrimaryReviewerName,
          "Secondary Reviewer": m.SecondaryReviewerName,
          "Schedule Assessment Status": m.ScheduleAssessmentStatusName,
          "Schedule Assessment Percentage": m.ScheduleAssessmentPercentage,
          "IsActive": m.IsActive?"Active":"Inactive"
        });
      });
      TableUtil.exportArrayToExcel(obj, "Schedule_Assessments");
    }
  }

  getPageLoad(): void {
    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "recordset": {
            "AssessmentYears": [
              {
                "ScheduledYear": 2021
              },
              {
                "ScheduledYear": 2022
              }
            ],
            "AssessmentCard": [
              {
                "ScheduleAssessmentID": 1,
                "GroupName": "Finance",
                "GroupID": 5,
                "Legend1Value": 1,
                "Legend1ID": 0,
                "Legend1Color": "summaryGreen",
                "Legend1Text": "Completed",
                "Legend2Value": 6,
                "Legend2ID": 1,
                "Legend2Color": "summaryYellow",
                "Legend2Text": "In-Progress",
                "TotalValue": 7,
                "TotalID": 2,
                "TotalUnits": 9,
                "MaxValue": 7
              },
              {
                "ScheduleAssessmentID": 1,
                "GroupName": "Risk & Credit",
                "GroupID": 6,
                "Legend1Value": 0,
                "Legend1ID": 0,
                "Legend1Color": "summaryGreen",
                "Legend1Text": "Completed",
                "Legend2Value": 2,
                "Legend2ID": 1,
                "Legend2Color": "summaryYellow",
                "Legend2Text": "In-Progress",
                "TotalValue": 2,
                "TotalID": 2,
                "TotalUnits": 9,
                "MaxValue": 7
              }
            ],
            "GetAssessmentSummary": [
              {
                "ScheduleAssessmentID": 1,
                "ScheduleAssessmentCode": "RCSA-001",
                "SchedulePeriod": "Quarter 4, 2022",
                "ScheduleAssessmentDescription": "Update Description",
                "ProposedStartDate": "2023-06-01T00:00:00.000Z",
                "ProposedCompletionDate": "2023-09-01T00:00:00.000Z",
                "PrimaryReviewerID": 2,
                "PrimaryReviewerName": "OpsSecurEyes02@lucidspire.com",
                "SecondaryReviewerID": 2,
                "SecondaryReviewerName": "OpsSecurEyes02@lucidspire.com",
                "ScheduleAssessmentStatusID": 1,
                "ScheduleAssessmentStatusName": "New10%",
                "IsActive": false,
                "ISCreateScheduleAssementEnabled": true
              },
              {
                "ScheduleAssessmentID": 2,
                "ScheduleAssessmentCode": "RCSA-002",
                "SchedulePeriod": "Quarter 4, 2022",
                "ScheduleAssessmentDescription": "Schedule Assessment Desc 2",
                "ProposedStartDate": "2023-05-01T00:00:00.000Z",
                "ProposedCompletionDate": "2023-07-01T00:00:00.000Z",
                "PrimaryReviewerID": 1,
                "PrimaryReviewerName": "test@lucidspire.com",
                "SecondaryReviewerID": 1,
                "SecondaryReviewerName": "test@lucidspire.com",
                "ScheduleAssessmentStatusID": 1,
                "ScheduleAssessmentStatusName": "New10%",
                "IsActive": true,
                "ISCreateScheduleAssementEnabled": true
              },
              {
                "ScheduleAssessmentID": 3,
                "ScheduleAssessmentCode": "RCSA-003",
                "SchedulePeriod": "Quarter 4, 2022",
                "ScheduleAssessmentDescription": "Schedule Assessment Desc 2",
                "ProposedStartDate": "2023-05-01T00:00:00.000Z",
                "ProposedCompletionDate": "2023-07-01T00:00:00.000Z",
                "PrimaryReviewerID": 1,
                "PrimaryReviewerName": "test@lucidspire.com",
                "SecondaryReviewerID": 1,
                "SecondaryReviewerName": "test@lucidspire.com",
                "ScheduleAssessmentStatusID": 1,
                "ScheduleAssessmentStatusName": "New10%",
                "IsActive": true,
                "ISCreateScheduleAssementEnabled": true
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
      this.process(data);
      this.processInProgressWidget(data);
      this.processAssessmentYear(data);

    } else {
      let obj = {};
      this.configScoreRatingService.getScheduleAssessmentScreen(obj).subscribe(data => {
        next: {
          if (data.success == 1) {
            // Set permissions from initial response (no API call)
            // NOTE: Do NOT call this.process(data) here — it fires loadListDepartmentsAndUnits
            // in parallel with processAssessmentYear → getgriddata, causing a token refresh
            // race condition ("Invalid Session"). fetchYearDataSequentially already handles
            // permissions, department loading, and filter application sequentially.
            if (data.result.recordset.SchedulePermission?.length > 0) {
              this.iSCreateScheduleAssementEnabled = data.result.recordset.SchedulePermission[0].ISCreateScheduleAssessmentEnabled;
            }
            this.processInProgressWidget(data);
            this.processAssessmentYear(data);
          } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
          }
        }
      });
    }

  }


  getgriddata(): void {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Schedule Assessment fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ScheduleAssessmentID": 1,
              "ScheduleAssessmentCode": "RCSA-001",
              "SchedulePeriod": "Quarter 4, 2022",
              "ScheduleAssessmentDescription": "Update Description",
              "ProposedStartDate": "2023-06-01T00:00:00.000Z",
              "ProposedCompletionDate": "2023-09-01T00:00:00.000Z",
              "PrimaryReviewerID": 2,
              "PrimaryReviewerName": "OpsSecurEyes02@lucidspire.com",
              "SecondaryReviewerID": 2,
              "SecondaryReviewerName": "OpsSecurEyes02@lucidspire.com",
              "ScheduleAssessmentStatusID": 1,
              "ScheduleAssessmentStatusName": "New10%",
              "IsActive": false
            },
            {
              "ScheduleAssessmentID": 2,
              "ScheduleAssessmentCode": "RCSA-002",
              "SchedulePeriod": "Quarter 4, 2022",
              "ScheduleAssessmentDescription": "Schedule Assessment Desc 2",
              "ProposedStartDate": "2023-05-01T00:00:00.000Z",
              "ProposedCompletionDate": "2023-07-01T00:00:00.000Z",
              "PrimaryReviewerID": 1,
              "PrimaryReviewerName": "test@lucidspire.com",
              "SecondaryReviewerID": 1,
              "SecondaryReviewerName": "test@lucidspire.com",
              "ScheduleAssessmentStatusID": 1,
              "ScheduleAssessmentStatusName": "New10%",
              "IsActive": true
            },
            {
              "ScheduleAssessmentID": 3,
              "ScheduleAssessmentCode": "RCSA-003",
              "SchedulePeriod": "Quarter 4, 2022",
              "ScheduleAssessmentDescription": "Schedule Assessment Desc 2",
              "ProposedStartDate": "2023-05-01T00:00:00.000Z",
              "ProposedCompletionDate": "2023-07-01T00:00:00.000Z",
              "PrimaryReviewerID": 1,
              "PrimaryReviewerName": "test@lucidspire.com",
              "SecondaryReviewerID": 1,
              "SecondaryReviewerName": "test@lucidspire.com",
              "ScheduleAssessmentStatusID": 1,
              "ScheduleAssessmentStatusName": "New10%",
              "IsActive": true
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Schedule Assessment fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.process(data);
    } else {
      if (!this.selectedYears || this.selectedYears.length === 0) return;
      this.fetchYearDataSequentially(0, []);
    }
  }

  /** Fetch grid data for multiple selected years sequentially (one API call at a time).
   *  Merges GetAssessmentSummary results from all years into a single list. */
  private fetchYearDataSequentially(index: number, accumulated: any[]): void {
    if (index >= this.selectedYears.length) {
      // All years fetched — merge results and apply filters
      this.getAssessmentSummary = accumulated;
      this.allAssessments = [...accumulated];

      if (this.listDepartments.length === 0) {
        this.loadListDepartmentsAndUnits(() => {
          this.applyClientSideFilters();
        });
      } else {
        this.applyClientSideFilters();
      }
      return;
    }

    const year = this.selectedYears[index];
    this.configScoreRatingService.getScheduleAssessmentScreen({ scheduleYear: year }).subscribe(res => {
      if (res.success == 1) {
        // Process permissions & in-progress widget from the first year's response
        if (index === 0) {
          if (res.result.recordset.SchedulePermission?.length > 0) {
            this.iSCreateScheduleAssementEnabled = res.result.recordset.SchedulePermission[0].ISCreateScheduleAssessmentEnabled;
          }
          if (res.result.recordset.InProgressAssessment?.length) {
            this.checkPrevInprogressData = res.result.recordset?.InProgressAssessment || [];
            if (this.checkPrevInprogressData?.length && this.checkPrevInprogressData[0]?.IsInprogressAssessment == 1 && (new Date().getFullYear()) > this.checkPrevInprogressData[0]?.ScheduleYear) {
              this.prevInprogressData = `Displaying current year data by default. Select the filter to view the previous year(s) data. Note: An ongoing assessment is available for ${this.checkPrevInprogressData[0].ScheduleYear}.`;
            } else {
              this.prevInprogressData = '';
            }
          } else {
            this.prevInprogressData = '';
          }
        }
        accumulated.push(...(res.result.recordset.GetAssessmentSummary || []));
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
      }
      // Fetch next year sequentially
      this.fetchYearDataSequentially(index + 1, accumulated);
    });
  }

  process(data: any): void {

    if (data.success == 1) {
      if (data.result.recordset.SchedulePermission.length > 0) {
        let assesmentconfig = data.result.recordset.SchedulePermission[0]; 
        this.iSCreateScheduleAssementEnabled = assesmentconfig.ISCreateScheduleAssessmentEnabled;  
      }

      // Store full unfiltered assessment list for client-side filtering
      this.getAssessmentSummary = data.result.recordset.GetAssessmentSummary;
      this.allAssessments = [...(data.result.recordset.GetAssessmentSummary || [])];

      // Load departments & units for filter dropdowns (only once), then apply filters
      if (this.listDepartments.length === 0) {
        this.loadListDepartmentsAndUnits(() => {
          this.applyClientSideFilters();
        });
      } else {
        this.applyClientSideFilters();
      }

      if(data.result.recordset.InProgressAssessment.length) {
          this.checkPrevInprogressData  = data.result.recordset?.InProgressAssessment || [];
          if(this.checkPrevInprogressData && this.checkPrevInprogressData.length && this.checkPrevInprogressData[0]?.IsInprogressAssessment == 1 && (new Date().getFullYear()) > this.checkPrevInprogressData[0]?.ScheduleYear) {
            this.prevInprogressData = `Displaying current year data by default. Select the filter to view the previous year(s) data. Note: An ongoing assessment is available for ${this.checkPrevInprogressData[0].ScheduleYear}.`
          } else {
            this.prevInprogressData = ''
          }         
      } else {
        this.prevInprogressData = ''
      }

    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  //navigate to Self-Assessments
  navigate(rowData: any): void {

    this._router.navigate(['self-assessments', rowData.ScheduleAssessmentID]);
    //this._router.navigateByUrl('/selfassessment', { state: rowData });
  }

  disable(rowData: any): void {
    //disable click   
  }

  //Show widget based on status after row click
  getRecord(rowData: any): void {
    if (rowData?.ScheduleAssessmentStatusName == 'Completed'){
      this.isActionplan=true;
      this.getActionWidget(rowData.ScheduleAssessmentID);
    }
    else if (rowData?.ScheduleAssessmentStatusName == 'In-Progress'){
      this.isActionplan=false;
      this.getInProgressWidget();
    }
  }

  getInProgressWidget() {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "SnapshotForInprogressScheduleAssessment fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ScheduleAssessmentID": 1,
              "GroupName": "Finance",
              "GroupID": 5,
              "Legend1Value": 1,
              "Legend1ID": 0,
              "Legend1Color": "summaryGreen",
              "Legend1Text": "Completed",
              "Legend2Value": 6,
              "Legend2ID": 1,
              "Legend2Color": "summaryYellow",
              "Legend2Text": "In-Progress",
              "TotalValue": 7,
              "TotalID": 2,
              "TotalUnits": 9,
              "MaxValue": 7
            },
            {
              "ScheduleAssessmentID": 1,
              "GroupName": "Risk & Credit",
              "GroupID": 6,
              "Legend1Value": 0,
              "Legend1ID": 0,
              "Legend1Color": "summaryGreen",
              "Legend1Text": "Completed",
              "Legend2Value": 2,
              "Legend2ID": 1,
              "Legend2Color": "summaryYellow",
              "Legend2Text": "In-Progress",
              "TotalValue": 2,
              "TotalID": 2,
              "TotalUnits": 9,
              "MaxValue": 7
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "SnapshotForInprogressScheduleAssessment fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processInProgressWidget(data);
    } else {
      this.service.getInprogressScheduleAssessment().subscribe(res => {
        next:
        this.processInProgressWidget(res);
      });
      //this.processInProgressWidget("");
    }
  }

  processInProgressWidget(data: any) {

    if (data.success == 1) {
      if (data.result.recordset.AssessmentCard.length > 0) {
        let docs = this.assessmentCard = data.result.recordset.AssessmentCard;
        this.summaryGroupHeadText = "In Progress";
        this.summaryGroupHeadSubText = "Details";
        this.units = "Units";
        this.IsInprogress = true;
        this.noofUnits = data.result.recordset.AssessmentCard[0].TotalUnits;
        this.Legend1Color = data.result.recordset.AssessmentCard[0].Legend1Color;
        this.Legend2Color = data.result.recordset.AssessmentCard[0].Legend2Color;
        this.Legend1Text = data.result.recordset.AssessmentCard[0].Legend1Text;
        this.Legend2Text = data.result.recordset.AssessmentCard[0].Legend2Text;

        if (docs && this.noofUnits != '0') {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
            doc.Legend1Width = (doc.Legend1Value / doc.MaxValue) * 100;
            doc.Legend2Width = (doc.Legend2Value / doc.MaxValue) * 100;
          })
          this.dataSourceInprogress = docs;
          //   this.dataSource.paginator = this.paginator
          //   this.dataSource.sort = this.sort
        }
        else{
          this.dataSourceInprogress=[]; 
        }
      }
    }
    // else if (this.assessmentCard != null && this.assessmentCard != "" && this.assessmentCard.length > 0) {
    //   let docs = this.assessmentCard;
    //   this.summaryGroupHeadText = "In Progress";
    //   this.summaryGroupHeadSubText = "Details";
    //   this.units = "Units";
    //   this.IsInprogress = true;
    //   this.noofUnits = this.assessmentCard[0].TotalUnits;
    //   this.Legend1Color = this.assessmentCard[0].Legend1Color;
    //   this.Legend2Color = this.assessmentCard[0].Legend2Color;
    //   this.Legend1Text = this.assessmentCard[0].Legend1Text;
    //   this.Legend2Text = this.assessmentCard[0].Legend2Text;

    //   if (docs) {
    //     let id = 0;
    //     docs.forEach((doc: any) => {
    //       id++;
    //       doc.RowNumber = id;
    //       doc.Legend1Width = (doc.Legend1Value / doc.MaxValue) * 100;
    //       doc.Legend2Width = (doc.Legend2Value / doc.MaxValue) * 100;
    //     })
    //     this.dataSourceInprogress = docs;
    //     //   this.dataSource.paginator = this.paginator
    //     //   this.dataSource.sort = this.sort
    //   }
    // }
    else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
isActionplan:boolean=false;
  getActionWidget(id: any) {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "GetSnapshotForCompletedScheduleAssessment fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ScheduleAssessmentID": 1,
              "GroupName": "Finance",
              "GroupID": 5,
              "Legend1Value": 0,
              "Legend1ID": 0,
              "Legend1Color": "summaryGreen",
              "Legend1Text": "Closed",
              "Legend2Value": 2,
              "Legend2ID": 1,
              "Legend2Color": "summaryRed",
              "Legend2Text": "Open",
              "Legend3Value": 0,
              "Legend3ID": 2,
              "Legend3Color": "summaryYellow",
              "Legend3Text": "On-hold",
              "TotalValue": 2,
              "TotalID": 3,
              "TotalPlans": 0,
              "MaxValue": 0
            },
            {
              "ScheduleAssessmentID": 1,
              "GroupName": "Finance",
              "GroupID": 5,
              "Legend1Value": 0,
              "Legend1ID": 0,
              "Legend1Color": "summaryGreen",
              "Legend1Text": "Closed",
              "Legend2Value": 2,
              "Legend2ID": 1,
              "Legend2Color": "summaryRed",
              "Legend2Text": "Open",
              "Legend3Value": 0,
              "Legend3ID": 2,
              "Legend3Color": "summaryYellow",
              "Legend3Text": "On-hold",
              "TotalValue": 2,
              "TotalID": 3,
              "TotalPlans": 0,
              "MaxValue": 0
            },
            {
              "ScheduleAssessmentID": 1,
              "GroupName": "Finance",
              "GroupID": 5,
              "Legend1Value": 0,
              "Legend1ID": 0,
              "Legend1Color": "summaryGreen",
              "Legend1Text": "Closed",
              "Legend2Value": 2,
              "Legend2ID": 1,
              "Legend2Color": "summaryRed",
              "Legend2Text": "Open",
              "Legend3Value": 0,
              "Legend3ID": 2,
              "Legend3Color": "summaryYellow",
              "Legend3Text": "On-hold",
              "TotalValue": 2,
              "TotalID": 3,
              "TotalPlans": 0,
              "MaxValue": 0
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "GetSnapshotForCompletedScheduleAssessment fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processActionWidget(data);
    } else {
      let obj = { id: id }

      this.service.getActionScheduleAssessment(obj).subscribe(res => {
        next:
        this.processActionWidget(res);
      });
    }
  }

  processActionWidget(data: any) {
    
    if (data.success == 1) {

      if (data.result.recordset.length > 0) {
        let docs = data.result.recordset;
        this.summaryGroupHeadText = "Action Plan";
        this.summaryGroupHeadSubText = "Status";
        this.units = "Plans";
        this.noofUnits = data.result.recordset[0].TotalPlans;
        this.Legend1Color = data.result.recordset[0].Legend1Color;
        this.Legend2Color = data.result.recordset[0].Legend2Color;
        this.Legend3Color = data.result.recordset[0].Legend3Color;
        this.Legend1Text = data.result.recordset[0].Legend1Text;
        this.Legend2Text = data.result.recordset[0].Legend2Text;
        this.Legend3Text = data.result.recordset[0].Legend3Text;
        this.IsInprogress = false;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;

            doc.Legend1Width = (doc.Legend1Value / doc.MaxValue) * 100;
            doc.Legend2Width = (doc.Legend2Value / doc.MaxValue) * 100;
            doc.Legend3Width = (doc.Legend3Value / doc.MaxValue) * 100;
          })
          this.dataSourceInprogress = docs;
        }
      }
      else{
        this.dataSourceInprogress=[]; 
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);

    }
  }

  getAssessmentYear() {
    if (environment.dummyData) {
      let data = {
        "success": true,
        "message": "Schedule Assessment Years fetched successfully",
        "result": {
          "status": 1,
          "recordset": [
            {
              "ScheduledYear": 2021
            },
            {
              "ScheduledYear": 2022
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "Schedule Assessment Years fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.processAssessmentYear(data);
    } else {

      this.service.getAssessmentYear().subscribe(res => {
        next:
        this.processAssessmentYear(res);
      });
    }
  }

  processAssessmentYear(data: any) { 
    if (data.success == 1) {
      if (data.result.recordset.AssessmentYears.length > 0) {
        this.assessmentYear = this.assessmentYears = data.result.recordset.AssessmentYears;

        // Restore multi-year selection from localStorage or default to current year
        const storedYears = localStorage.getItem("selectedYears");
        if (storedYears && storedYears !== "undefined") {
          try {
            const parsed = JSON.parse(storedYears);
            this.selectedYears = Array.isArray(parsed) && parsed.length > 0 ? parsed : [(new Date()).getFullYear()];
          } catch (e) {
            this.selectedYears = [(new Date()).getFullYear()];
          }
        } else {
          // Backward compatibility: check legacy single-year storage
          const legacyYear = localStorage.getItem("selectedYear");
          if (legacyYear && legacyYear !== "undefined") {
            const yr = Number(legacyYear);
            this.selectedYears = Number.isNaN(yr) ? [(new Date()).getFullYear()] : [yr];
          } else {
            this.selectedYears = [(new Date()).getFullYear()];
          }
        }

        this.getgriddata();
        this.actionForm.patchValue({ ddlyear: (new Date()).getFullYear() });
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getRCSAInprogressdetails(data: any): void {
    const assesment = this.dialog.open(InprogressScheduleAssessmentsComponent, {
      disableClose: true,
      width: "150vh",
      minHeight: "60vh",
      data: data
    })

    assesment.afterClosed().subscribe(result => {

    })
  }

  getRCSACompletedDetails(data: any): void {
    const assesment = this.dialog.open(CompletedScheduleAssessmentsComponent, {
      disableClose: true,
      width: "150vh",
      minHeight: "60vh",
      data: data
    });
    assesment.afterClosed().subscribe(result => {

    });
  }
  initiateAdd(): void {
    const assesment = this.dialog.open(NewScheduleAssessmentsComponent, {
      disableClose: true,
      width: "120vh",
      minHeight: "60vh",
      data: {
        "mode": "add"
      }
    })
    assesment.afterClosed().subscribe(result => {
      if(result){
        this.getgriddata();        
      }
    })
    //this.adddg = true;
  }

  
  editData(data: any): void {
    if (this.canCreateEditAccess()) {
      data.mode = "edit";

      const assesment = this.dialog.open(NewScheduleAssessmentsComponent, {
        disableClose: true,
        width: "120vh",
        minHeight: "60vh",
        data: data
      })


      assesment.afterClosed().subscribe(result => {
        if(result){
          this.getgriddata();        
        }
      })
    }
  }

  changeAssessmentStatus(data: any, event: any): void {
    let obj = {
      "id": data.ScheduleAssessmentID,
      "isActive": !data.IsActive
    }
    this.service.updateStatus(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.changeDetectorRefs.detectChanges();
        this.saveSuccess(res.message);
      } else {
        if (res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;

        event.source.checked = !event.source.checked;
      }
      error: (err: any) =>
      console.log("err::", err);
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
        this.getPageLoad();
        confirm.close();
      }, timeout)
    });
  }

  yearChange(): void {
    localStorage.setItem("selectedYears", JSON.stringify(this.selectedYears));
    this.selectedQuarters = []; // reset quarters when years change
    this.getgriddata();
  }

  /** Handle quarter filter change */
  quarterChange(): void {
    this.applyClientSideFilters();
  }

  getSnapDetails(data: any, info: any): void {

    data.IsInprogress = this.IsInprogress;
    data.InfoID = info;
    data.ScheduleAssesmentID = data.ScheduleAssessmentID;
    const assesment = this.dialog.open(ScheduleAssessmentsDetailsComponent, {
      disableClose: true,
      width: "80vh",
      minHeight: "50vh",
      data: data
    })
    assesment.afterClosed().subscribe(result => {
      if(result){
        this.getgriddata();        
      }
    })
    //this.adddg = true;
  }


  // =====================================================================
  // Department / Unit filter logic for list screen
  // =====================================================================

  /** Load departments and units for list screen filters.
   *  Accepts an optional callback to chain sequential API calls. */
  loadListDepartmentsAndUnits(callback?: () => void): void {
    this.service.getDepartmentsAndUnitsForSchedule().subscribe((res: any) => {
      if (res.success == 1) {
        this.listDepartments = res.result?.recordset?.departments || [];
        this.listAllUnits = res.result?.recordset?.units || [];
      }
      // Execute callback AFTER this API call completes (sequential token refresh)
      if (callback) {
        callback();
      }
    });
  }

  /** Returns units filtered by the currently selected departments on the list screen.
   *  Returns empty array when no departments are selected (Unit dropdown is disabled). */
  get listFilteredUnits(): any[] {
    if (!this.listFilterDepartmentIds || this.listFilterDepartmentIds.length === 0) return [];
    return this.listAllUnits.filter((u: any) => this.listFilterDepartmentIds.includes(u.GroupID));
  }

  /** Handle department change on the list screen */
  onListDepartmentChange(): void {
    // Clear unit selections when all departments are deselected
    if (!this.listFilterDepartmentIds || this.listFilterDepartmentIds.length === 0) {
      this.listFilterUnitIds = [];
    } else if (this.listFilterUnitIds.length > 0) {
      // Prune unit selections that no longer belong to selected departments
      const validUnitIds = this.listFilteredUnits.map((u: any) => u.UnitID);
      this.listFilterUnitIds = this.listFilterUnitIds.filter(id => validUnitIds.includes(id));
    }
    this.applyClientSideFilters();
  }

  /** Handle unit change on the list screen */
  onListUnitChange(): void {
    this.applyClientSideFilters();
  }

  /** Apply client-side filters (Quarter, Department, Unit) and update the table data source.
   *  Department/Unit filtering uses UnitIds and DepartmentIds returned from the line table
   *  as comma-separated strings (e.g. "1,2,3") in each assessment row. */
  applyClientSideFilters(): void {
    let filtered = [...this.allAssessments];

    // 1) Quarter filter (multi-select)
    if (this.selectedQuarters && this.selectedQuarters.length > 0) {
      filtered = filtered.filter((row: any) =>
        row.SchedulePeriod && this.selectedQuarters.some(q => row.SchedulePeriod.startsWith(q))
      );
    }

    // 2) Department filter - check if ANY of the assessment's departments match selected filter
    if (this.listFilterDepartmentIds.length > 0) {
      filtered = filtered.filter((row: any) => {
        if (!row.DepartmentIds) return false;
        const rowDeptIds = row.DepartmentIds.split(',').map((id: string) => parseInt(id.trim(), 10));
        return this.listFilterDepartmentIds.some(filterId => rowDeptIds.includes(filterId));
      });
    }

    // 3) Unit filter - check if ANY of the assessment's units match selected filter
    if (this.listFilterUnitIds.length > 0) {
      filtered = filtered.filter((row: any) => {
        if (!row.UnitIds) return false;
        const rowUnitIds = row.UnitIds.split(',').map((id: string) => parseInt(id.trim(), 10));
        return this.listFilterUnitIds.some(filterId => rowUnitIds.includes(filterId));
      });
    }

    // Re-number rows
    let id = 0;
    filtered.forEach((doc: any) => {
      id++;
      doc.RowNumber = id;
    });

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showexportData = this.dataSource.filteredData.length > 0;
  }

  /** Reload list data from server (for year changes, etc.) */
  reloadListData(): void {
    this.getgriddata();
  }

  canCreateEditAccess(): boolean {
    let result = false;
    result = (this.utils.isFunctionalAdmin());
    return result;
  }

  canDownloadsearchAccess(): boolean {
    let result = false;
    result = (this.utils.isStandardUser() || this.utils.isPowerUser() || this.utils.isFunctionalAdmin());
    return result;
  }

  // start of mail reminder code
  sendMailReminder(data: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Reminder",
        content: "Are you sure you want to send the reminder?"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          data: {
            "ScheduleAssessmentID": data.ScheduleAssessmentID,
            "CreatedBy": "keerthana.s"
          }
        }
        this.service.getEmailReminderData(obj).subscribe(res => {
          next:
          if(res.success == 1) {
            this.saveSuccess(res.message);
          } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.saveerror = res.error.errorMessage;
          }
          error: (err: any) =>
          console.log("err::", err);
        })
      }
    })
  }
  // end

  showRiskData(data:any){
    this.configScoreRatingService.scheduleAssessmentIDS = data.ScheduleAssessmentID;

    this._router.navigate(['risk-register-assessment-wise',{ScheduleAssessmentID: data.ScheduleAssessmentID}]);
  }
}
