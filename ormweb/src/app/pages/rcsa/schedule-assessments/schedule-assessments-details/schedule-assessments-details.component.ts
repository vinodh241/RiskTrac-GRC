import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

export interface DataModel {
  RowNumber: number;
  Description: string;
}

@Component({
  selector: 'app-schedule-assessments-details',
  templateUrl: './schedule-assessments-details.component.html',
  styleUrls: ['./schedule-assessments-details.component.scss']
})

export class ScheduleAssessmentsDetailsComponent implements OnInit {

  displayedColumns: string[] = ['RowNumber', 'Description'];
  dataSource!: MatTableDataSource<DataModel>;
  saveerror: string = "";
  summaryGroupHeadText: string = "In Progress";
  summaryGroupHeadSubText: string = "Details";
  unitCount: any;
  dialogText: any;

  // data = [
  //   { RowNumber: 1, Description: 'Corporate Business'},
  //   { RowNumber: 2, Description: 'Operations' },
  //   { RowNumber: 3, Description: 'Admin & Procurement'},
  //   { RowNumber: 4, Description: 'Product Development' } 
  // ];

  constructor(private service: ScheduleAssessmentsService,
    public utils: UtilsService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any
  ) {

  }

  ngOnInit(): void {

    this.getgriddata();

  }


  getgriddata(): void {
    if (environment.dummyData) {
      let obj = {
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "status": 1,
          "recordset": [
            {
              "UnitName": "Financial Reporting & Planning"
            }
          ],
          "errorMsg": null,
          "procedureSuccess": true,
          "procedureMessage": "GetSnapshotForInprogressScheduleAssessmentDetails fetched successfully"
        },
        "token": "q1w2e3r4",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      };
      this.data.IsInprogress = true;
      this.process(obj);
    } else {
      if (this.data.IsInprogress) {
    
        //To calculate the Units        
        if (this.data.InfoID == 0){
          this.unitCount = this.data.Legend1Value;
          this.dialogText = this.data.Legend1Text;
        }
        else{
          this.unitCount = this.data.Legend2Value;
          this.dialogText = this.data.Legend2Text;
        }
        let req = {
          groupID: this.data.GroupID,
          id: this.data.ScheduleAssesmentID,
          info: this.data.InfoID
        };
        ""
        this.service.getSnapInprogressDetails(req).subscribe(res => {
          next:
          this.process(res);
        });
      }
      else {
    
        if (this.data.InfoID == 0){
          this.unitCount = this.data.Legend1Value;
          this.dialogText = this.data.Legend1Text;
        }
        else if (this.data.InfoID == 1){
          this.unitCount = this.data.Legend2Value;
          this.dialogText = this.data.Legend2Text;
        }
        else if (this.data.InfoID == 2){
          this.unitCount = this.data.Legend3Value;
          this.dialogText = this.data.Legend3Text;
        }
        let req = {
          groupID: this.data.GroupID,
          id: this.data.ScheduleAssesmentID,
          info: this.data.InfoID
        };
        this.service.getSnapCompletedDetails(req).subscribe(res => {
          next:
          this.process(res);
        });
      }
    }
  }

  process(data: any): void {

    if (data.success == 1) {
      if (data.result.recordset.length > 0) {
        let docs = data.result.recordset;
        if (docs) {
          let id = 0;
          docs.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
            if (this.data.IsInprogress) {
              doc.Description = doc.UnitName;
            }
            else {
              doc.Description = doc.IdentifiedAction;
            }
          })
          this.dataSource = new MatTableDataSource(docs);
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
    //this.dataSource = new MatTableDataSource(data);
  }
}
