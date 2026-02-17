import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { NewAssesmentComponent } from './new-assesment/new-assesment.component';


export interface RiskAssessment {
    Index: number,
    StartDate: string;
    EndDate: string;
    ReviewerName: string;
    UnitName: string;
    StatusID: number;
    SubmittedUnit: string;
    StatusName: string;
}

@Component({
    selector: 'app-risk-assessments',
    templateUrl: './risk-assessments.component.html',
    styleUrls: ['./risk-assessments.component.scss']
})

export class RiskAssessmentsComponent implements OnInit {
    displayedColumns: string[] = ['Index', 'FrameworkName', 'StartDate', 'EndDate', 'Quarter', 'ReviewerName', 'UnitName', 'SubmittedUnit', 'StatusName', 'Action'];
    dataSource!: MatTableDataSource<RiskAssessment>;
    frameworkDataResp : number = 0;
    [x: string]: any;

    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private service: RiskAssessmentService,
        private router: Router,
        public dialog: MatDialog,
        public utils: UtilsService,
        @Inject(DOCUMENT) private _document:any
    ) {

    }

    ngAfterViewInit() {
        // if (this.dataSource)
        //     this.dataSource.paginator = this.paginator
    }

    ngOnInit(): void {
        this.getRiskAssessments();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
    }

    getRiskAssessments(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "assessments": [
                        {
                            "CollectionScheduleID": "1",
                            "StartDate": "2022-07-20T13:23:28.490Z",
                            "EndDate": "2022-07-20T13:23:28.490Z",
                            "ReviewerGUID": "150067",
                            "ReviewerName": "Harish Garg",
                            "UnitID": "150068",
                            "UnitName": "Retail",
                            "StatusID": "1",
                            "StatusName": "In Progress",
                            "FWID": "10025",
                            "FrameworkName": "Framwork Name 1",
                            "FileID": "10025",
                            "FramWorkFileName": "Framwork Name 1.xlxs",
                            "PolicyFileName": "Policy Name 1.pdf",
                            "Quater":2,
                            "Year":2023,
                            "QuaterID":34
                        },
                        {
                            "CollectionScheduleID": "1",
                            "StartDate": "2022-07-20T13:23:28.490Z",
                            "EndDate": "2022-07-20T13:23:28.490Z",
                            "ReviewerGUID": "150067",
                            "ReviewerName": "Harish Garg",
                            "UnitID": "150068",
                            "UnitName": "Retail",
                            "StatusID": "1",
                            "StatusName": "Submitted",
                            "FWID": "10025",
                            "FrameworkName": "Framwork Name 1",
                            "FileID": "10025",
                            "FramWorkFileName": "Framwork Name 1.xlxs",
                            "PolicyFileName": "Policy Name 1.pdf",
                            "Quater":2,
                            "Year":2023,
                            "QuaterID":34
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.process(data);
        } else {
            this.service.getRiskAssessments().subscribe(res => {
                next:
                this.process(res);
            });
        }
    }

    getUserFullName(firstName: any, middleName: any, lastName: any) {
        let name = middleName ? firstName.concat(' ', middleName) : firstName;
        return lastName ? name.concat(' ', lastName) : name;
    }

    process(data: any): void {
        if (data.success == 1) {
            if (data.result.assessments.length > 0) {
                let docs = data.result.assessments;
                if (docs) {
                    let uniqueIds = new Set();
                    let filtered = docs.filter((doc: any) => {
                        if (!uniqueIds.has(doc.CollectionScheduleID)){
                            uniqueIds.add(doc.CollectionScheduleID);
                            return true;
                        }
                        return false;
                    });

                    let id = 0;
                    filtered.forEach((doc: any) => {
                        id++;
                        doc.Index = id;
                        doc.FullName = this.getUserFullName(doc.FirstName, doc.MiddleName, doc.LastName)
                    })
                    this.dataSource = new MatTableDataSource(filtered);
                    this.dataSource.paginator = this.paginator
                    this.dataSource.sort = this.sort
                }
            }
            if(data.result.frameworkData) {
                this.frameworkDataResp = data.result.frameworkData;
            }
        } else {
            if(data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    newAssesment(): void {
        const assesment = this.dialog.open(NewAssesmentComponent, {
            disableClose: true,
            width: "70vh",
            minHeight: "80vh",
            data: {
                "mode": "add"
            }
        })
        assesment.afterClosed().subscribe(result => {
            if(result)
                this.getRiskAssessments();
        })
    }

    editAssesment(row: any): void {
        row.mode = "edit";
        console.log("row", row)
        const assesment = this.dialog.open(NewAssesmentComponent, {
            disableClose: true,
            width: "70vh",
            minHeight: "80vh",
            data: row
        });

        assesment.afterClosed().subscribe(result => {
            if(result)
                this.getRiskAssessments();
        });
    }

    historical(): void {
        localStorage.setItem("AssessmentFilter", "Historical");
        this.router.navigate(['risk-assessments-historical']);
    }

}
