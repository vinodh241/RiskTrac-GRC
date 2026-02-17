import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { RowSpanComputer, Span } from "src/app/pages/rcsa/schedule-assessments/inprogress-schedule-assessments/row-span-computer";
import { ActivatedRoute } from '@angular/router';

export interface DataModel {
  Group: string;
  Unit: string;
  EntryInProgress: string;
  UnderRiskReview: string;
  Rejected: string;
  Approved: string;
}

@Component({
  selector: 'app-completed-schedule-assessments',
  templateUrl: './completed-schedule-assessments.component.html',
  styleUrls: ['./completed-schedule-assessments.component.scss']
})

export class CompletedScheduleAssessmentsComponent implements OnInit {

  displayedColumnsFirstRow: string[] = ['Headers_Group', 'Headers_Unit', 'InherentRisks', 'ResidualRisks', 'ActionPlan', 'ControlTesting'];
  displayedColumnsSecoundRow: string[] = ['InherentHighRisk', 'InherentModerateRisk', 'InherentLowRisk', 'InherentTotalRisks', 'ResidualHighRisk', 'ResidualModerateRisk', 'ResidualLowRisk', 'TotalRisks', 'ActionPlanClosed', 'ActionPlanOnhold', 'ActionPlanOpen', 'TotalPlans', 'ControlTestingSuccessful', 'ControlTestingUnsuccessful'];
  displayedColumnsThirdRow: string[] = ['Headers_Group', 'Headers_Unit', 'InherentHighRisk', 'InherentModerateRisk', 'InherentLowRisk', 'InherentTotalRisks', 'ResidualHighRisk', 'ResidualModerateRisk', 'ResidualLowRisk', 'TotalRisks', 'ActionPlanClosed', 'ActionPlanOnhold', 'ActionPlanOpen', 'TotalPlans', 'ControlTestingSuccessful', 'ControlTestingUnsuccessful'];
  completedScheduledataSource!: MatTableDataSource<any>;
  displayedColumnsForSecoundRow: any = [];
  saveerror: string = "";
  summaryGroupHeadText: string = "In Progress";
  summaryGroupHeadSubText: string = "Details";
  formData: any;
  inherentRisksColSpan:number=0;
  residualRisksColSpan:number=0;
  actionPlanColSpan:number=0;
  controlTestingColSpan:number=0;
  columnNames: string[] = [];
  // @ts-ignore
  lastColumnName: string;
  allButLastColumnNames: string[] = [];
  rowSpans!: Array<Span[]>;
  private rowSpanComputer = new RowSpanComputer();
  scheduleAssessment: any;


  constructor(private service: ScheduleAssessmentsService,
    public utils: UtilsService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (data) {
      this.scheduleAssessment = data;
    }
  }

  ngOnInit(): void {
    this.getgriddata();
  }


  getgriddata(): void {

    if (environment.dummyData) {
      let data = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
            "status": 1,
            "recordset": [
                [
                    {
                        "Title": "RCSA-001",
                        "AssessmentDescription": "Schedule Assessment 1",
                        "ProposedStartDate": "2022-12-18",
                        "ProposedCompletionDate": "2022-12-31"
                    }
                ],
                [
                    {
                        "Rowno": "1",
                        "Group": "Finance",
                        "Unit": "Financial Reporting & Planning",
                        "Inherent_HighRisk": 1,
                        "Inherent_LowRisk": 0,
                        "Inherent_ModerateRisk": 2,
                        "Inherent_TotalRisks": 3,
                        "Residual_LowRisk": 1,
                        "Residual_ModerateRisk": 2,
                        "ActionPlan_Closed": 2,
                        "ActionPlan_Onhold": 0,
                        "ActionPlan_Open": 1,
                        "ActionPlan_TotalPlans": 3,
                        "ControlTesting_Successful": 3,
                        "ControlTesting_Unsuccessful": 0,
                        "TotalControlTestings": 3,
                        "AvgOverallInherentRiskScore": 13.333333,
                        "AvgOverallControlTotalScore": 3.666666,
                        "ControlInPaceName": "Yes",
                        "ControlNatureName": "Detective",
                        "AvgOverallInherentRiskRating": "Moderate Risk",
                        "AvgOverallControlTotalRating": null,
                        "AvgResidualRating": null
                    }
                ],
                [
                    {
                        "HeaderKey": "Group",
                        "HeaderValue": "Group",
                        "RowOrder": "1"
                    },
                    {
                        "HeaderKey": "Unit",
                        "HeaderValue": "Unit",
                        "RowOrder": "2"
                    },
                    {
                        "HeaderKey": "Inherent_HighRisk",
                        "HeaderValue": "High Risk",
                        "RowOrder": "3"
                    },
                    {
                        "HeaderKey": "Inherent_LowRisk",
                        "HeaderValue": "Low Risk",
                        "RowOrder": "4"
                    },
                    {
                        "HeaderKey": "Inherent_ModerateRisk",
                        "HeaderValue": "Moderate Risk",
                        "RowOrder": "5"
                    },
                    {
                        "HeaderKey": "Inherent_TotalRisks",
                        "HeaderValue": "Total Risks",
                        "RowOrder": "6"
                    },
                    {
                        "HeaderKey": "Residual_LowRisk",
                        "HeaderValue": "Low Risk",
                        "RowOrder": "7"
                    },
                    {
                        "HeaderKey": "Residual_ModerateRisk",
                        "HeaderValue": "Moderate Risk",
                        "RowOrder": "8"
                    },
                    {
                        "HeaderKey": "ActionPlan_Closed",
                        "HeaderValue": "Closed",
                        "RowOrder": "9"
                    },
                    {
                        "HeaderKey": "ActionPlan_Onhold",
                        "HeaderValue": "On-hold",
                        "RowOrder": "10"
                    },
                    {
                        "HeaderKey": "ActionPlan_Open",
                        "HeaderValue": "Open",
                        "RowOrder": "11"
                    },
                    {
                        "HeaderKey": "ActionPlan_TotalPlans",
                        "HeaderValue": "Total Plans",
                        "RowOrder": "12"
                    },
                    {
                        "HeaderKey": "ControlTesting_Successful",
                        "HeaderValue": "Successful",
                        "RowOrder": "13"
                    },
                    {
                        "HeaderKey": "ControlTesting_Unsuccessful",
                        "HeaderValue": "Unsuccessful",
                        "RowOrder": "14"
                    }
                ]
            ],
            "errorMsg": null,
            "procedureSuccess": true,
            "procedureMessage": "Completed Schedule Assessment Dashboard fetched successfully"
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMzNEOTZDQy04ODY1LUVEMTEtQUE2MC0wMDBDMjk5MEVCQjciLCJ1c2VyTmFtZSI6InBhbGFuaXNAbHVjaWRzcGlyZS5jb20iLCJpYXQiOjE2NzM1MDIzMjUsImV4cCI6MTY3MzUwOTU0NH0.oFEVoXMYw3Ar60994z1DPRG9Xv39gSd4nAgqxzbKp6M",
        "error": {
            "errorCode": null,
            "errorMessage": null
        }
    };
      this.process(data);
    } else {
      //let data={id:2}
      let obj = { id: this.scheduleAssessment.ScheduleAssessmentID }
      this.service.getCompletedScheduleAssessmentData(obj).subscribe(res => {
        next:
        this.process(res);
      });
    }
  }

  process(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.length > 2) {
        this.formData = data.result.recordset[0];
        let docs = data.result.recordset[1];
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          })

          let columnHeaders = data.result.recordset[2];
          if (columnHeaders && columnHeaders.length>0) {
            
            columnHeaders.filter((s: any) => String(s.HeaderKey).startsWith("Inherent_")).forEach((doc:any) => {
              this.inherentRisksColSpan+=1;
              this.displayedColumnsForSecoundRow.push(doc);
            });
            columnHeaders.filter((s: any) => String(s.HeaderKey).startsWith("Residual_")).forEach((doc:any) => {
              this.displayedColumnsForSecoundRow.push(doc);
               this.residualRisksColSpan+=1;
            });
            columnHeaders.filter((s: any) => String(s.HeaderKey).startsWith("ActionPlan_")).forEach((doc:any) => {
              this.displayedColumnsForSecoundRow.push(doc);
               this.actionPlanColSpan+=1;
            });
            columnHeaders.filter((s: any) => String(s.HeaderKey).startsWith("ControlTesting_")).forEach((doc:any) => {
              this.displayedColumnsForSecoundRow.push(doc);
               this.controlTestingColSpan+=1;
            });
            this.displayedColumnsSecoundRow=[];
            this.displayedColumnsThirdRow=[];
            this.displayedColumnsSecoundRow=this.displayedColumnsForSecoundRow.map((s:any)=>s.HeaderKey)
            this.displayedColumnsThirdRow=columnHeaders.map((s:any)=>s.HeaderKey);
          }
          this.completedScheduledataSource = new MatTableDataSource(docs);
          this.columnNames = Object.keys(docs[0]);
          this.allButLastColumnNames = this.columnNames.slice(0, 1);
          this.rowSpans = this.rowSpanComputer.compute(data.result.recordset[1], this.allButLastColumnNames);
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
}
