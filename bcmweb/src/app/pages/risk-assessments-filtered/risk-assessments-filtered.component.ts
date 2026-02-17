import { jsDocComment } from '@angular/compiler';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { RiskAppetiteService } from 'src/app/services/risk-appetite/risk-appetite.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RiskMetricsComponent } from '../risk-metrics/risk-metrics.component';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

export interface RiskAssessment {
    Index: number,
    StartDate: string;
    EndDate: string;
    ReviewerName: string;
    UnitName: string;
    FrameworkName: string;
    StatusID: number;
    StatusName: string;
}

@Component({
    selector: 'app-risk-assessments-filtered',
    templateUrl: './risk-assessments-filtered.component.html',
    styleUrls: ['./risk-assessments-filtered.component.scss']
})
export class RiskAssessmentsFilteredComponent implements OnInit {
    [x: string]: any;
    displayedColumns: string[] = [];
    dataSource!: MatTableDataSource<RiskAssessment>;
    type = ""
    title = ""

    constructor(
        private service: RiskAssessmentService,
        private _dialog: MatDialog,
        private _riskAppetiteService: RiskAppetiteService,
        public utils: UtilsService,
        public notificationService: NotificationsService,
        @Inject(DOCUMENT) private _document: any
    ) { }

    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    ngAfterViewInit() {

    }

    ngOnInit(): void {
        this.type = localStorage.getItem("AssessmentFilter") || "Submitted"
        this.title = this.type + " Risk Assessments"
        if(this.type == 'Historical') {
            this.displayedColumns = ['Index', 'FrameworkName', 'StartDate', 'EndDate', 'Quarter', 'Reviewer', 'Units', 'RAFPolicyApplied', 'PdfFile','Status', 'Action'];
        } else {
            this.displayedColumns = ['Index', 'FrameworkName', 'StartDate', 'EndDate', 'Quarter','SubmittedUnits', 'Reviewer', 'Units', 'RAFPolicyApplied', 'PdfFile', 'Status', 'Action'];           
        }
        
        this.getRiskAssessments()
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    processDownload(fileData: any, fileMetaDetails: string) {
        // const FileType = res["result"][0][0].FileContent.type;
        const TYPED_ARRAY = new Uint8Array(fileData);
        const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        const fileMetaType = fileMetaDetails;
        const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
        const blob = new Blob([blobData], { type: fileMetaType });
        return blob;
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

    downloadFile(rowData: any, fileType: string) {
        console.log(rowData);
        if (fileType === 'Policy') {
            const fileData = {
                "fileId": rowData.FileID,
                "fileType": fileType
            }
            this._riskAppetiteService.downloadRiskAppetite(fileData).subscribe(res => {
                console.log(res);
                saveAs(this.processDownload(res.result[0][0].PolicyFileContent.data, 'application/pdf'), rowData.PolicyFileName.trim() + '.pdf');
            });
        } else {
            const fileData = {
                "fileId": rowData.FileID,
                "fileType": fileType
            }
            this._riskAppetiteService.downloadRiskAppetite(fileData).subscribe(res => {
                console.log(res);
                saveAs(this.processDownload(res.result[0][0].FrameworkFileContent.data, 'application/xlsx'), rowData.FrameworkFileName.trim() + '.xlsx');
            });
        }
    }

    getRiskAssessments(): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "assessments": [{
                        "CollectionScheduleID": "240181",
                        "StartDate": "2023-12-01T00:00:00.000Z",
                        "EndDate": "2023-12-31T00:00:00.000Z",
                        "ReviewerGUID": "DE3A62E5-3B8B-ED11-BAC6-000C29A8F9E1",
                        "FirstName": "mo_bank_11",
                        "MiddleName": "",
                        "LastName": "",
                        "ReviewerEmailID": "mo_bank_11@secureyesdev.com",
                        "UnitID": null,
                        "UnitName": null,
                        "StatusID": 3,
                        "StatusName": "Partially Submitted ",
                        "FWID": 39287,
                        "FrameworkName": "limit value check",
                        "FileID": "220250",
                        "FrameworkFileName": "Risk Appetite Framework New Limit.xlsx",
                        "PolicyFileName": "Risk_Appetite_Policy.pdf",
                        "QuaterID": "36",
                        "Quater": 4,
                        "Year": 2023,
                        "UnitIDs": "12",
                        "UnitNames": "Legal",
                        "ReminderDate": "2023-12-07T00:00:00.000Z"
                    },
                    {
                        "CollectionScheduleID": "240180",
                        "StartDate": "2023-12-01T00:00:00.000Z",
                        "EndDate": "2023-12-31T00:00:00.000Z",
                        "ReviewerGUID": "DE3A62E5-3B8B-ED11-BAC6-000C29A8F9E1",
                        "FirstName": "mo_bank_11",
                        "MiddleName": "",
                        "LastName": "",
                        "ReviewerEmailID": "mo_bank_11@secureyesdev.com",
                        "UnitID": null,
                        "UnitName": null,
                        "StatusID": 5,
                        "StatusName": "Completed",
                        "FWID": 39286,
                        "FrameworkName": "14-12 risk metric issue",
                        "FileID": "220249",
                        "FrameworkFileName": "Risk Appetite Framework New Limit.xlsx",
                        "PolicyFileName": "Risk Appetite Policy (2).pdf",
                        "QuaterID": "36",
                        "Quater": 4,
                        "Year": 2023,
                        "UnitIDs": null,
                        "UnitNames": null,
                        "ReminderDate": "2023-12-27T00:00:00.000Z"
                    },
                    {
                        "CollectionScheduleID": "240178",
                        "StartDate": "2023-12-02T00:00:00.000Z",
                        "EndDate": "2023-12-31T00:00:00.000Z",
                        "ReviewerGUID": "DE3A62E5-3B8B-ED11-BAC6-000C29A8F9E1",
                        "FirstName": "mo_bank_11",
                        "MiddleName": "",
                        "LastName": "",
                        "ReviewerEmailID": "mo_bank_11@secureyesdev.com",
                        "UnitID": null,
                        "UnitName": null,
                        "StatusID": 5,
                        "StatusName": "Completed",
                        "FWID": 39281,
                        "FrameworkName": "test in-app-email RA - 2",
                        "FileID": "220244",
                        "FrameworkFileName": "Risk Appetite Framework_4 - Copy 1 (1).xlsx",
                        "PolicyFileName": "Risk Appetite Policy (1) (2) (1).pdf",
                        "QuaterID": "36",
                        "Quater": 4,
                        "Year": 2023,
                        "UnitIDs": "1, 12",
                        "UnitNames": "Cyber Security, Legal",
                        "ReminderDate": "2023-12-25T00:00:00.000Z"
                    },
                    {
                        "CollectionScheduleID": "240181",
                        "StartDate": "2023-12-01T00:00:00.000Z",
                        "EndDate": "2023-12-31T00:00:00.000Z",
                        "ReviewerGUID": "DE3A62E5-3B8B-ED11-BAC6-000C29A8F9E1",
                        "FirstName": "mo_bank_11",
                        "MiddleName": "",
                        "LastName": "",
                        "ReviewerEmailID": "mo_bank_11@secureyesdev.com",
                        "UnitID": null,
                        "UnitName": null,
                        "StatusID": 3,
                        "StatusName": "Partially Submitted ",
                        "FWID": 39287,
                        "FrameworkName": "limit value check",
                        "FileID": "220250",
                        "FrameworkFileName": "Risk Appetite Framework New Limit.xlsx",
                        "PolicyFileName": "Risk_Appetite_Policy.pdf",
                        "QuaterID": "36",
                        "Quater": 4,
                        "Year": 2023,
                        "UnitIDs": "12",
                        "UnitNames": "Legal",
                        "ReminderDate": "2023-12-07T00:00:00.000Z"
                    }]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.process(data);
        } else {

            if(this.type == 'Historical') {
                this.service.getRiskAssessments().subscribe(res => {
                    next:
                    this.process(res);
                    this.notificationService.getNotifications();
                });
            } else {
                this.service.getRiskAssessmentsViewSubmitted().subscribe(res => {
                    next:
                    this.process(res);
                    this.notificationService.getNotifications();
                });
            }
            
        }
    }

    getUserFullName(firstName: any, middleName: any, lastName: any) {
        let name = middleName ? firstName.concat(' ', middleName) : firstName;
        return lastName ? name.concat(' ', lastName) : name;
    }

    // process(data: any): void {

    //     let res = null;
    //     if (data.success == 1) {
    //         if (data.result.assessments.length > 0) {
    //             let filter = [3, 4]
    //             if(this.type == 'Historical')
    //                 filter = [5]
    //             let docs = data.result.assessments;
    //             if (docs) {
    //                 let filtered = docs.filter((doc: any) => filter.includes(doc.StatusID));
    //                 let id = 0;
    //                 filtered.forEach((obj: any) => {
    //                     id++;
    //                     obj.Index = id;
    //                     obj.FullName = this.getUserFullName(obj.FirstName, obj.MiddleName, obj.LastName)
    //                 })
    //                 this.dataSource = new MatTableDataSource(filtered)
    //                 this.dataSource.paginator = this.paginator
    //             }
    //         }
    //     } else {
    //         if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
    //             this.utils.relogin(this._document);
    //     }
    // }

    process(data: any): void {
        let res = null;
        if (data.success == 1) {
            if (data.result.assessments.length > 0) {
                let docs = data.result.assessments;

                if (this.type == 'Historical') {
                    docs = docs.filter((ob:any) => [5].includes(ob.StatusID))
                } else {
                    if(data.result.reviewedData[0]?.IsReviwedByReviewer === 1) {
                        docs = docs.filter((ob:any) => [2, 3, 4].includes(ob.StatusID))
                    } else {
                        docs = docs.filter((ob:any) => [3, 4].includes(ob.StatusID))
                    }
                }

                if (docs) {
                    let uniqueIds = new Set();
                    let filtered = docs.filter((doc: any) => {
                        if (!uniqueIds.has(doc.CollectionScheduleID)) {
                            uniqueIds.add(doc.CollectionScheduleID);
                            return true;
                        }
                        return false;
                    });
    
                    let id = 0;
                    filtered.forEach((obj: any) => {
                        id++;
                        obj.Index = id;
                        obj.FullName = this.getUserFullName(obj.FirstName, obj.MiddleName, obj.LastName);
                    });
    
                    this.dataSource = new MatTableDataSource(filtered);
                    this.dataSource.paginator = this.paginator;
                }
            }
        } else {
            if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED") {
                this.utils.relogin(this._document);
            }
        }
    }
    

    viewAssessment(row: any): void {
        console.log('row: '+ JSON.stringify(row))
        this._dialog.open(RiskMetricsComponent, {
            id: "RiskMetricsComponent",
            disableClose: true,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: "full-screen-modal",
            data: {
                mode: "history",
                collectionScheduleID: row.CollectionScheduleID
            }
        })
    }

}
