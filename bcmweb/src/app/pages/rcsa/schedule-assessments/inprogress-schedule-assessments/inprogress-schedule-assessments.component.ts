import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { RowSpanComputer, Span } from "src/app/pages/rcsa/schedule-assessments/inprogress-schedule-assessments/row-span-computer";

export interface DataModel {
  Group: string;
  Unit: string;
  EntryInProgress: string;
  UnderRiskReview: string;
  Rejected: string;
  Approved: string;
}

@Component({
  selector: 'app-inprogress-schedule-assessments',
  templateUrl: './inprogress-schedule-assessments.component.html',
  styleUrls: ['./inprogress-schedule-assessments.component.scss']
})

export class InprogressScheduleAssessmentsComponent implements OnInit {

  //displayedColumns: string[] = ['Group', 'Unit', 'EntryInProgress', 'UnderRiskReview', 'Rejected', 'Approved'];
  dataSource!: MatTableDataSource<DataModel>;
  saveerror: string = "";
  summaryGroupHeadText: string = "In Progress";
  summaryGroupHeadSubText: string = "Details";
  columnNames: string[] = [];
  lastColumnName!: string;
  allButLastColumnNames: string[] = [];
  rowSpans!: Array<Span[]>;
  scheduleAssessment: any;
  private rowSpanComputer = new RowSpanComputer();
  displayedColumns: any = [];
  displayedHeaders: any = [];
  displayedDetailedHeaders: any = [];
  displayedKeyValueHeaders: any = [];
  displayedKeyValueDetailed: any = [];
  rowIndexs: string[] = [];
  screenData: any;
  detailedStatusColSpan: number = 0;
  detailedStausHeader!: string;
  datanotFound:string="";


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
                "Title": "RCSA-002",
                "AssessmentDescription": "test",
                "ProposedStartDate": "2022-12-17",
                "ProposedCompletionDate": "2022-12-05",
                "FirstHeader": "Detailed Status - Quarter 1, 2021"
              }
            ],
            [
              {
                "Group": "Finance",
                "Unit": "Financial Reporting & Planning",
                "Total": 4,
                "New": "50% (2)",
                "Draft": "0% (0)",
                "UnderReview": "25% (1)",
                "Approved": "25% (1)",
                "Rejected": "0% (0)"
              },
              {
                "Group": "Risk & Credit",
                "Unit": "Corporate Credit",
                "Total": 1,
                "New": "0% (0)",
                "Draft": "0% (0)",
                "UnderReview": "100% (1)",
                "Approved": "0% (0)",
                "Rejected": "0% (0)"
              },
              {
                "Group": "Risk & Credit",
                "Unit": "Retail Credit",
                "Total": 1,
                "New": "0% (0)",
                "Draft": "100% (1)",
                "UnderReview": "0% (0)",
                "Approved": "0% (0)",
                "Rejected": "0% (0)"
              }
            ],
            [
              {
                "HeaderKey": "Group",
                "HeaderValue": "Group",
                "RowOrder": 1
              },
              {
                "HeaderKey": "Unit",
                "HeaderValue": "Unit",
                "RowOrder": 2
              },
              {
                "HeaderKey": "New",
                "HeaderValue": "New",
                "RowOrder": 3
              },
              {
                "HeaderKey": "Draft",
                "HeaderValue": "Draft",
                "RowOrder": 4
              },
              {
                "HeaderKey": "UnderReview",
                "HeaderValue": "Under Review",
                "RowOrder": 5
              },
              {
                "HeaderKey": "Approved",
                "HeaderValue": "Approved",
                "RowOrder": 6
              },
              {
                "HeaderKey": "Rejected",
                "HeaderValue": "Rejected",
                "RowOrder": 7
              },
              {
                "HeaderKey": "Total",
                "HeaderValue": "Total",
                "RowOrder": 8
              }
            ]
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "In-Progress Schedule Assessment Dashboard fetched successfully"
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMzNEOTZDQy04ODY1LUVEMTEtQUE2MC0wMDBDMjk5MEVCQjciLCJ1c2VyTmFtZSI6InBhbGFuaXNAbHVjaWRzcGlyZS5jb20iLCJpYXQiOjE2NzM1MDIzMjUsImV4cCI6MTY3MzUxMzMwNX0.O3NnzsvxQk2uiU740ase6ymtSyoO_kTPVOIOUE4OgQo",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.process(data);
    } else {
      let obj = { id: this.scheduleAssessment.ScheduleAssessmentID }
      this.service.getInProgressScheduleAssessmentData(obj).subscribe(res => {
        next:
        this.process(res);
      });
    }

  }

  process(data: any): void {

    if (data.success == 1) {
      if (data.result.recordset.length > 2) {
        let docs = data.result.recordset[1];
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
          })

          this.screenData = data.result.recordset[0];
          let columnHeaders = data.result.recordset[2];
          if (columnHeaders && columnHeaders.length > 0) {

            this.displayedColumns = columnHeaders.map((s: any) => s.HeaderKey)
            columnHeaders.filter((s: any) => String(s.HeaderKey).startsWith("Headers_")).forEach((doc: any) => {
              this.displayedHeaders.push(doc.HeaderKey);
              this.displayedKeyValueHeaders.push(doc);
            });
            this.displayedHeaders.push("DetailedStatus");
            columnHeaders.filter((s: any) => !String(s.HeaderKey).startsWith("Headers_")).forEach((doc: any) => {
              this.displayedDetailedHeaders.push(doc.HeaderKey);
              this.displayedKeyValueDetailed.push(doc);
              this.detailedStatusColSpan += 1;
            })
          }

          this.dataSource = new MatTableDataSource(docs);
          this.columnNames = Object.keys(docs[0]);
          this.allButLastColumnNames = this.columnNames.slice(0, 1);
          this.rowSpans = this.rowSpanComputer.compute(data.result.recordset[1], this.allButLastColumnNames);
          if (id == 0) {
            this.datanotFound="No RCSA is in In-Progress";
          }
          else{
            this.datanotFound="";
          }

        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }


}
