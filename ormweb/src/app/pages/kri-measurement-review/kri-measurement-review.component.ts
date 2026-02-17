import { Component, OnInit, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { KriSendEmailReminderDialogComponent } from kri-send-email-reminder-dialog/kri-send-email-reminder-dialog.component';
import { KriSendEmailReminderDialogComponent } from '../dashboards/kri/kri-measurement/kri-send-email-reminder-dialog/kri-send-email-reminder-dialog.component';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { CommentsComponent } from 'src/app/pages/risk-metrics/comments/comments.component';
import { RestService } from 'src/app/services/rest/rest.service';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
export interface KriScoring {
    Indicator: string;
    KriCode: number;
    MeasurementFrequency: string;
    Target: string;
    Kritype: string;
    ThresholdValue: number;
    Period: string;
    date: string;
    measurement: string;
    kri: string;
    Remarks: string;
    status: string;
    upload: string;
    prev: string;
    StatusName: string;
}

@Component({
    selector: 'app-kri-measurement-review',
    templateUrl: './kri-measurement-review.component.html',
    styleUrls: ['./kri-measurement-review.component.scss']
})
export class KriMeasurementReviewComponent implements OnInit {

    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = '';

    mainColumn: string[] = [];

    subColumn: string[] = [
        'tvalue-1',
        'tvalue-2',
        'tvalue-3',
        'tvalue-4',
        'tvalue-5',
        'Period',
        'date',
        'measurement',
        'kri'
    ];

    allColumnsForData: string[] = [];

    statusData = [
        { id: 'Approve', value: 2, isSelected: false },
        { id: 'Reject', value: 3, isSelected: false },
    ];
    dataSource: MatTableDataSource<KriScoring> = new MatTableDataSource();
    reportFrequencey: any;
    colorValues: any = "total"
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;
    @ViewChild(MatTable) myTable: MatTable<any> | any;
    groupID: any;
    unitID: any;
    groupSelected = 'all';
    unitSelected = 'all';
    department: any = "all";
    reportWithUnit: boolean = false;
    submited: any = false;
    remarksFilled: boolean = false
    completedata: any;
    model: any = '';
    isCollapsed = false;
    selectedRow: any;
    showPrevDataDetails: boolean = false;
    isShowModal: boolean = false;
    saveerror: string = "";
    commentBody: string = "";
    isReviewedStatus: boolean = false;
    selectedOption: string = '';
    approveChecked: boolean = false;
    rejectChecked: boolean = false;
    submitButton: boolean = false;
    KRIReviewData: any[] = []
    isPowerUserRole: boolean = false;
    isRiskManagementUnit: boolean = false;
    isStandardUser: boolean = false;
    isReadOnly: boolean = false;
    isExpanded: boolean = true;
    checkedAll: any = null
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });
    checkedData: any;
    allData: any;
    commentData: any;
    element: any;
    wait: any;
    dataHide: boolean = false
    isValid: boolean = false;
    isValidSave: boolean = false;
    isSaved: boolean = false;
    dataApprovedRejected: any[] = [];
    isDisabled: boolean = false
    disableData: any;
    dataRejected: any;
    dataApprove: any;
    allApprovedRejected: boolean = false
    isSubmit: boolean = false
    filterKRIData: any;
    isEnabledIcon: boolean = false
    rejectReported: boolean = false;
    rejectedMetrics: any;
    selectedStatus: any;
    toolTipButton: string = `Partial submission is not allowed. Review all reported metrics department-wise to enable the submit button. 
    Additionally, ensure that the approved/rejected filter is not selected and the Unit dropdown is selected.`;
    filteredStatus: any;
    filteredReportedStatus: any;
    filteredStatusALL: any
    selectedRowFrequency: any;

    constructor(
        public kriService: KriService,
        public utils: UtilsService,
        public router: Router,
        public DashboardService: DashboardService,
        public dialog: MatDialog,
        private rest: RestService,
        @Inject(DOCUMENT) private _document: any
    ) {
        // this.kriService.getkrireporteddata();
        this.isPowerUserRole = this.utils.isPowerUserRole();
        this.isRiskManagementUnit = this.utils.isRiskManagementUnit();
        this.isStandardUser = this.utils.isStandardUser();
        kriService.gotMeasurements.subscribe((value) => {
            if (value) {
                this.dataApprovedRejected = []
                if ((this.kriService.kriReviewerUser == true)) {
                    this.isReadOnly = false;
                } else if ((this.kriService.powerUser == true)) {
                    this.isReadOnly = true;
                } else if ((this.kriService.powerUser == false) && (this.kriService.kriReviewerUser == false)) {
                    this.dataHide = true;
                } else {
                    this.dataHide = true;
                }

                this.groupID = this.groupID > 0 ? this.groupID : "all"
                this.unitID = this.unitID > 0 ? this.unitID : "all"

                if (this.selectedRowFrequency && this.selectedRowFrequency !== 'total') {
                    if (this.groupID === 'all') {
                        this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
                    } else if (Number(this.groupID) > 0) {
                        this.dataSource.data = this.kriService?.kriMeasurments.filter((nn: any) => nn.GroupID === Number(this.groupID));
                    }
                    if (this.unitID !== 'all' && this.unitID > 0) {
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.UnitID === this.unitID);
                    }

                    this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

                    if (this.filteredStatus) {
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                    }
                    if (this.selectedRowFrequency) {
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.MeasurementFrequency === this.selectedRowFrequency);
                    }

                } else {
                    if (this.groupID === 'all') {
                        this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
                    } else if (Number(this.groupID) > 0) {
                        this.dataSource.data = this.kriService?.kriMeasurments.filter((nn: any) => nn.GroupID === Number(this.groupID));
                    }
                    if (this.unitID !== 'all' && this.unitID > 0) {
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.UnitID === this.unitID);
                    }
                    this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

                    if (this.filteredStatus) {
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                    }

                    this.reportWithUnit = true;
                }


                if (this.kriService.kriReviewerUser) {
                    this.allColumnsForData = [
                        'rejectApproveBtn',
                        'KriCode',
                        'Indicator',
                        'MeasurementFrequency',
                        'Target',
                        'KriType',
                        'tvalue-1',
                        'tvalue-2',
                        'tvalue-3',
                        'tvalue-4',
                        'tvalue-5',
                        'Period',
                        'date',
                        'measurement',
                        'kri',
                        'Remarks',
                        'status',
                        'upload',
                        'prev',
                        'sendEmail',
                        'checkerComments'
                    ]
                    this.mainColumn = [
                        'rejectApproveBtn',
                        'KriCode',
                        'Indicator',
                        'MeasurementFrequency',
                        'Target',
                        'KriType',
                        'threashold',
                        'periodT',
                        'Remarks',
                        'status',
                        'upload',
                        'prev',
                        'sendEmail',
                        'checkerComments'
                    ];
                    //   console.log('this.allColumnsForData -f '+this.allColumnsForData)
                } else {
                    this.allColumnsForData = [
                        'KriCode',
                        'Indicator',
                        'MeasurementFrequency',
                        'Target',
                        'KriType',
                        'tvalue-1',
                        'tvalue-2',
                        'tvalue-3',
                        'tvalue-4',
                        'tvalue-5',
                        'Period',
                        'date',
                        'measurement',
                        'kri',
                        'Remarks',
                        'status',
                        'upload',
                        'prev',
                        'sendEmail',
                        'checkerComments'
                    ]
                    this.mainColumn = [
                        'KriCode',
                        'Indicator',
                        'MeasurementFrequency',
                        'Target',
                        'KriType',
                        'threashold',
                        'periodT',
                        'Remarks',
                        'status',
                        'upload',
                        'prev',
                        'sendEmail',
                        'checkerComments'
                    ];
                }
                // this.kriService.kriMeasurments.forEach((ele: any) => {
                //     if (ele.ReportStatusID == 2 && ele.IsReviewed == false && ele.IsSaved == false) {
                //         console.log("if")
                //         this.isDisabled = true;
                //         console.log("🚀 ~ file: kri-measurement-review.component.ts:220 ~ KriMeasurementReviewComponent ~ this.kriService.kriMeasurments.forEach ~ this.isDisabled:", this.isDisabled)
                //     }else{
                //         console.log("else")
                //         this.isDisabled = false
                //     }
                // });
                //         if(this.kriService.kriMeasurments.filter((ele: any) => ele.IsSaved == true).length > 0){
                //             this.submitButton = true;
                //         }else{
                //             this.submitButton = false
                //         }
                // this.submitButton =  this.kriService.kriMeasurments.filter((ele: any) => ele.IsSaved == true && ele.KRI_Status != "Measured" && ele.KRI_Status != "Reported").length > 0;
                // console.log("🚀 ~ file: kri-measurement-review.component.ts:229 ~ KriMeasurementReviewComponent ~ kriService.gotMeasurements.subscribe ~  this.submitButton:",  this.submitButton)
                kriService.kriMeasurments.forEach((element: any) => {
                    if (element.KRI_Status === 'Reported') {
                        element.CommentBody = '';
                    }
                });

                kriService.kriMeasurments.forEach((element: any) => {
                    element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
                });


                this.emailEnable(kriService.kriMeasurments);

                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    // this.colorValues = 'total';
                }, 100);
            }

        });
    }
    ngOnInit(): void {
        this.dataApprovedRejected = []
        this.allApprovedRejected = this.dataSource.data.some((obj: any) => (obj.ReportStatusID == 2 || obj.ReportStatusID == 3) && obj.IsReviewed == true)

        
        

        this.kriService.getkrireporteddata();
        this.kriService?.kriMeasurments?.forEach((element: any) => {
            if (element.KRI_Status === 'Reported') {
                element.CommentBody = '';
            }
        });
    }
    showPrevData() {
        this.showPrevDataDetails = true;
    }

    closeWait(): void {
        this.wait.close();
    }

    changedRiskCategoryStatus(event: any) {
        this.reportWithUnit = false;
        this.groupSelected = 'all';
        this.unitSelected = 'all';
        if (event.checked == true) {
            this.department = 'own';
            this.kriService.getkrireporteddata();
        } else {
            this.department = 'all';
            this.kriService.getkrireporteddata();
        }

        var data = {
            value: 'all',
        };

        setTimeout(() => {
            this.filterGroups(data);
        }, 1000);
    }

    isUnitCount(): boolean {
        return this.kriService.unitCount == 1 || this.reportWithUnit;
    }
    dataNotMeasured(): boolean {
        var value = false;
        this.dataSource.data.forEach((kri: any) => {
            if (kri.StatusName == 'Not Measured') {
                if (value == false) {
                    value = true;
                }
            }
        });
        return value;
    }

    isReportedCount(): boolean {
        var value = false;
        this.dataSource.data.forEach((kri: any) => {
            if (
                kri.StatusName == 'Not Measured' ||
                kri.StatusName == 'Measured'
            ) {
                if (value == false) {
                    value = true;
                }
            }
        });
        return !value;
    }

    remarksNotNull(list: any, remarks: any): any {
        let v = list.length == remarks.length;
        this.remarksFilled = v;
        return !v;
    }

    getFilterOfTHreshouldValues(): any {
        let myList = [];
        let myRemark = [];
        this.dataSource.data;
        let service = this.dataSource.data;
        for (let i in service) {
            if (
                service[i].ThresholdValue < 5 &&
                service[i].StatusName === 'Measured'
            ) {
                myList.push(service[i]);
            }
        }
        let remarks = myList.filter((d) => d.Remarks !== null);
        return {
            data: this.dataSource.data.length,
            myList: myList.length,
            remark: this.remarksNotNull(myList, remarks),
        };
    }

    applyFilter(event: any = '', KRICode = '') {
        if (event) {
            this.dataSource.filter = (event.target as HTMLInputElement).value
                .trim()
                .toLocaleLowerCase();
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
            return;
        }
        if (KRICode) {
            this.dataSource.filter = KRICode.trim().toLocaleLowerCase();
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        }
    }

    filterGroups(data: any): any {
        // console.log('data: ', data);

        // console.log("Data Source Data: ", this.dataSource.data);

        this.allApprovedRejected = this.dataSource.data.every((obj: any) => (obj.ReportStatusID == 2 || obj.ReportStatusID == 3) && obj.IsReviewed == true)
        this.checkedAll = null;
        this.checkedData = null;

        this.unitSelected = '';
        this.groupID = data.value;
        this.groupID = this.groupID > 0 ? this.groupID : "all"
        this.unitID = this.unitID > 0 ? this.unitID : "all"
        // console.log('✌️ this.groupID ---> g',  this.groupID);
        // console.log('✌️  this.unitID  ---> g',   this.unitID );

        this.kriService.selectedMeasurementRowGroup = data.value;
        // console.log('✌️this.filteredStatus --->', this.filteredStatus);
        // console.log('✌️this.selectedRowFrequency --->', this.selectedRowFrequency);

        if (this.selectedRowFrequency && this.selectedRowFrequency !== 'total') {
            if (this.groupID == 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                }
                if (this.selectedRowFrequency) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.MeasurementFrequency === this.selectedRowFrequency);
                }
                this.completedata = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
            } else if (Number(this.groupID) > 0) {
                this.dataSource.data = this.kriService?.kriMeasurments.filter(
                    (nn: any) => nn.GroupID == Number(this.groupID)
                );
                this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                }
                if (this.selectedRowFrequency) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.MeasurementFrequency === this.selectedRowFrequency);
                }
            }
        } else {
            if (this.groupID == 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));

                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                }
                this.completedata = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));

            } else if (Number(this.groupID) > 0) {
                this.dataSource.data = this.kriService?.kriMeasurments.filter(
                    (nn: any) => nn.GroupID == Number(this.groupID)
                );
                this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
                }
            }
        }

        const key = 'UnitName';
        var unitCount;
        const arrayUniqueByKey = [
            ...new Map(
                this.dataSource.data.map((item: any) => [item[key], item])
            ).values(),
        ];
        unitCount = arrayUniqueByKey?.length;
        if (unitCount == 1) {
            this.reportWithUnit = true;
        } else {
            this.reportWithUnit = false;
        }
        this.rejectReported = this.dataSource.data.some((obj: any) => (obj.KRI_Status == "Rejected" || obj.KRI_Status == "Reported"))
        // console.log("this.rejectReported",this.rejectReported)
        this.allApprovedRejected = this.dataSource.data.every((obj: any) => (obj.KRI_Status == "Measured" || obj.KRI_Status == "Not Measured"))
        // console.log("this.allApprovedRejected",this.allApprovedRejected)
        this.rejectedMetrics = this.dataSource.data.every((obj: any) => ((obj.KRI_Status == "Rejected" && obj.IsReported == true && obj.IsSaved == false)))
        // console.log("this.rejectedMetrics",this.rejectedMetrics)
        this.dataRejectedSubmit()

    }

    filterUnits(data: any) {
        this.unitID = data.value;
        this.groupID = this.groupID > 0 ? this.groupID : "all"
        this.unitID = this.unitID > 0 ? this.unitID : "all"

        console.log("Data Source Data: ", this.dataSource.data);
        

        // console.log('✌️  this.unitID  --->',   this.unitID );
        // console.log('✌️ this.groupID --->',  this.groupID);

        this.kriService.selectedMeasurementRowGroup = data.value;

        if (this.selectedRowFrequency && this.selectedRowFrequency !== 'total') {
            if (this.groupID === 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
            } else if (Number(this.groupID) > 0) {
                this.dataSource.data = this.kriService?.kriMeasurments.filter((nn: any) => nn.GroupID === Number(this.groupID));
            }
            if (this.unitID !== 'all' && this.unitID > 0) {
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.UnitID === this.unitID);
            }

            this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

            if (this.filteredStatus) {
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
            }
            if (this.selectedRowFrequency) {
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.MeasurementFrequency === this.selectedRowFrequency);
            }

        } else {
            if (this.groupID === 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
            } else if (Number(this.groupID) > 0) {
                this.dataSource.data = this.kriService?.kriMeasurments.filter((nn: any) => nn.GroupID === Number(this.groupID));
            }
            if (this.unitID !== 'all' && this.unitID > 0) {
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.UnitID === this.unitID);
            }
            this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));

            if (this.filteredStatus) {
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.KRI_Status === this.filteredStatus);
            }

            this.reportWithUnit = true;
        }
        this.rejectReported = this.dataSource.data.some((obj: any) => (obj.KRI_Status == "Rejected" || obj.KRI_Status == "Reported"))
        // console.log("this.rejectReported",this.rejectReported)
        this.allApprovedRejected = this.dataSource.data.some((obj: any) => (obj.KRI_Status == "Measured" || obj.KRI_Status == "Not Measured"))
        // console.log("this.allApprovedRejected",this.allApprovedRejected)
        this.rejectedMetrics = this.dataSource.data.some((obj: any) => ((obj.KRI_Status == "Rejected" && obj.IsReported == true && obj.IsSaved == false)))
        this.selectedStatus = null;
        this.dataRejectedSubmit()
    }

    getUnitsNames(data: any): any {
        // console.log('data: ', data);
        // console.log('this.groupID: ', this.groupID);

        let list: any = [];
        for (let i in data) {
            if (data[i].GroupID == this.groupID) {
                list.push(data[i]);
            }
        }
        return list;
    }


    colorValue(data: any): any {
        return this.colorValues == data;
    }

    colorValueTotal(data: any, freq: any) {
        return this.colorValues == data + freq
    }

    colorValueData(frequency: any, data: any): any {
        return this.colorValues == data + frequency;
    }

    textColor(): any {
        return {
            color: 'black',
            'font-weight': '500',
        };
    }

    colorCode(): any {
        return {
            'background-image':
                'linear-gradient(to right, rgba(139, 233, 243, 0.947),rgba(244, 245, 154, 0.984))',
            color: 'black',
            'font-weight': '500',
            ' border': '1px solid black',
        };
    }

    /** Show % suffix only for PERCENTAGE type, or when type unknown and value <= 100. Never show for NUMBER or value > 100. */
    showMeasurementPercent(row: any): boolean {
        const t = (row?.ThresholdType ?? '').toString().toUpperCase();
        if (t === 'NUMBER') return false;
        const m = Number(row?.Measurement);
        if (t === 'PERCENTAGE') return m == null || Number.isNaN(m) || m <= 100;
        return m != null && !Number.isNaN(m) && m <= 100;
    }

    onChangeMeasurement(row: any): void {
        row.ThresholdValue = '';
        row.ColorCode = '#FFFFFF';
        if (row.ThresholdType === 'PERCENTAGE' && row.Measurement > 100) row.Measurement = 100;
        if (row.Measurement != null && row.Measurement >= 0) {
            switch (row.Target) {
                case 100:
                    if (row.Measurement == row.ThresholdValue5)
                        row.ThresholdValue = '5';
                    else if (row.Measurement >= row.ThresholdValue4)
                        row.ThresholdValue = '4';
                    else if (row.Measurement >= row.ThresholdValue3)
                        row.ThresholdValue = '3';
                    else if (row.Measurement >= row.ThresholdValue2)
                        row.ThresholdValue = '2';
                    else row.ThresholdValue = '1';
                    break;
                case 0:
                    if (row.Measurement == row.ThresholdValue5)
                        row.ThresholdValue = '5';
                    else if (row.Measurement <= row.ThresholdValue4)
                        row.ThresholdValue = '4';
                    else if (row.Measurement <= row.ThresholdValue3)
                        row.ThresholdValue = '3';
                    else if (row.Measurement <= row.ThresholdValue2)
                        row.ThresholdValue = '2';
                    else row.ThresholdValue = '1';
                    break;
            }
            let kris = this.kriService.kriThresholds.filter(
                (kri: any) => kri.Value == row.ThresholdValue
            );
            if (kris.length > 0) row.ColorCode = kris[0].ColorCode;
        }
    }

    isLastMonth(): boolean {
        let date = new Date();
        let isLast = false;
        switch (this.kriService.kriMeasurmentsReportingFrequncy) {
            case 'Monthly':
                isLast = true;
                break;
            case 'Quarterly':
                isLast = [2, 5, 8, 11].includes(date.getMonth());
                break;
            case 'Semi Annual':
                isLast = [5, 11].includes(date.getMonth());
                break;
            case 'Annually':
                isLast = [11].includes(date.getMonth());
                break;
        }
        return isLast;
    }

    getQuarter() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = 'Jan-Mar ' + year;
                break;
            case 2:
                finaltype = 'Apr-Jun ' + year;
                break;
            case 3:
                finaltype = 'Jul-Sep ' + year;
                break;
            case 4:
                finaltype = 'Oct-Dec ' + year;
                break;
            default:
                break;
        }
        return finaltype;
    }
    getSemiAnnual() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth() / 6) + 1;
        month -= month > 6 ? 6 : 0;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = 'Jan-Jun ' + year;
                break;
            case 2:
                finaltype = 'Jul-Dec ' + year;
                break;
            default:
                break;
        }
        return finaltype;
    }
    getMonth() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth()) + 1;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = 'Jan ' + year;
                break;
            case 2:
                finaltype = 'Feb ' + year;
                break;
            case 3:
                finaltype = 'Mar ' + year;
                break;
            case 4:
                finaltype = 'Apr ' + year;
                break;
            case 5:
                finaltype = 'May ' + year;
                break;
            case 6:
                finaltype = 'Jun ' + year;
                break;
            case 7:
                finaltype = 'Jul ' + year;
                break;
            case 8:
                finaltype = 'Aug ' + year;
                break;
            case 9:
                finaltype = 'Sep ' + year;
                break;
            case 10:
                finaltype = 'Oct ' + year;
                break;
            case 11:
                finaltype = 'Nov ' + year;
                break;
            case 12:
                finaltype = 'Dec ' + year;
                break;
            default:
                break;
        }
        return finaltype;
    }

    getAnnual() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth() / 12) + 1;
        month -= month > 6 ? 6 : 0;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = 'Jan-Dec ' + year;
                break;
            default:
                break;
        }
        return finaltype;
    }

    saveKRIs(): void {
        const data: any[] = [];
        this.dataSource.data.forEach((metric: any) => {
            if (
                metric?.Measurement != metric?.MeasurementOld ||
                metric?.Remarks != metric?.RemarksOld ||
                (metric?.evidences && metric?.evidences.length > 0
                    ? metric?.evidences.map((ele: any) => ele.EvidenceID).join()
                    : '') != metric?.evidencesOld
            ) {
                var periodType;
                if (metric.MeasurementFrequency == 'Monthly') {
                    periodType = this.getMonth();
                } else if (metric.MeasurementFrequency == 'Quarterly') {
                    periodType = this.getQuarter();
                } else if (metric.MeasurementFrequency == 'Semi Annual') {
                    periodType = this.getSemiAnnual();
                } else {
                    periodType = this.getAnnual();
                }
                data.push({
                    metricID: metric.MetricID,
                    period: periodType,
                    value: metric.Measurement,
                    remark: metric.Remarks,
                    IsReported: null,
                    EvidenceID:
                        metric?.evidences && metric?.evidences.length > 0
                            ? metric?.evidences
                                .map((ele: any) => ele.EvidenceID)
                                .join()
                            : '',
                });
            }
        });
        this.submited = true;
        this.kriService.setKriMetricsScoring(data, this.submited);
    }

    historical(): void {
        this.router.navigate(['kri-historical']);
    }

    reportKRIs(): void {
        const data = {
            metricIDs: this.dataSource.data
                .filter((metric: any) => metric.StatusName == 'Measured')
                .map((metric: any) => metric.MetricID)
                .toString(),
        };
        this.submited = true;
        this.kriService.setKriMetricsReport(data, this.submited);
    }

    cancel(): void {
        this.dataSource.data = JSON.parse(
            JSON.stringify(this.kriService.kriMeasurments)
        );
        this.dataSource.data = [...this.dataSource.data];
    }

    total(): any {
        let service;
        service = this.completedata;
        let data = 0;
        for (let i in service) {
            data++;
        }

        return data;
    }

    measuredData(mdata: any): any {
        let service;
        service = this.completedata;
        let data = 0;
        for (let i in service) {
            if (service[i].KRI_Status === mdata) {
                data++;
            }
        }
        return data;
    }

    filterMeasuredData(frequency: any, frequencyName: any): any {
        let service = this.dataSource.filteredData;
        let data = 0;
        for (let i in service) {
            if (
                service[i].StatusName == frequencyName &&
                service[i].MeasurementFrequency == frequency
            ) {
                data++;
            }
        }
        return data;
    }

    countFrequency(frequency: any): any {
        let service = this.completedata;
        let data = 0;
        for (let i in service) {
            if (service[i].MeasurementFrequency == frequency) {
                data++;
            }
        }
        return data;
    }

    totalData(): any {
        this.filteredStatusALL = "all"
        this.selectedStatus = ""
        this.selectedRowFrequency = ""
        this.filteredStatus = ""
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            listData.push(service[i]);
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }
        listData.forEach((element: any) => {
            element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
        });
        this.dataSource.data = listData;
        this.colorValues = 'total';
    }

    getRemarkData(data: any): any {
        let dbt = 0;
        let bol = true;
        if (data != null) {
            for (let i of data) {
                dbt += 1;
            }
        }
        if ((data == null || dbt <= 0)) {
            bol = true;
        } else {
            bol = false;
        }
        return bol;
    }

    measured(data: any): any {
        this.filteredStatus = data
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            if (service[i].KRI_Status === data) {
                listData.push(service[i]);
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }

        listData.forEach((element: any) => {
            element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
        });

        this.dataSource.data = listData;
        // this.dataSource.data.filter((rec:any) => rec.StatusName == data)
        this.colorValues = data;
        this.selectedRow = data;
    }

    measuredFrequency(frequency: any, data: any) {
        this.filteredStatus = data;
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            if (
                service[i].KRI_Status === data &&
                service[i].MeasurementFrequency === frequency
            ) {
                listData.push(service[i]);
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }
        listData.forEach((element: any) => {
            element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
        });
        this.dataSource.data = listData;
        this.colorValues = data + frequency;
        this.selectedRow = data + frequency;
        this.selectedRowFrequency = frequency;
    }

    measurementFrequencyData(data: any) {
        this.selectedRowFrequency = data;
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            if (service[i].MeasurementFrequency === data) {
                listData.push(service[i]);
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }
        listData.forEach((element: any) => {
            element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
        });
        this.dataSource.data = listData;
        this.colorValues = data;
        this.selectedRow = data;
        this.filteredStatus = ''
    }

    getOrderFrequency(data: any) {
        let list: any = [];
        let n = 7;
        for (let i of data) {
            if (i.MeasurementFrequency == 'Monthly') {
                i.idx = 1;
                list.push(i);
            } else if (i.MeasurementFrequency == 'Quartely') {
                i.idx = 2;
                list.push(i);
            } else if (i.MeasurementFrequency == 'Semi Annual') {
                i.idx = 3;
                list.push(i);
            } else if (i.MeasurementFrequency == 'Annually') {
                i.idx = 4;
                list.push(i);
            } else if (i.MeasurementFrequency == 'Adhoc') {
                i.idx = 5;
                list.push(i);
            } else if (i.MeasurementFrequency == 'Weekly') {
                i.idx = 6;
                list.push(i);
            } else if (i.measurementFrequency == 'Leap Year') {
                i.idx = 7;
                list.push(i);
            } else {
                i.idx = n + 1;
                list.push(i);
            }
        }
        return list.sort(function (a: any, b: any) {
            return a.idx - b.idx;
        });
    }

    measurementFrequencyTotal(): any {
        let listMeasurementFrequency: any = [];
        let measurementFrequencyData: any = [];
        let service;
        // if(this.dataSource.data.length > 0){
        service = this.completedata;
        // }else{
        // service = this.kriService?.kriMeasurments
        // }
        // let service = this.kriService?.kriMeasurments
        for (let i in service) {
            measurementFrequencyData.push(service[i].MeasurementFrequency);
        }
        let setMeasurementFrequency = new Set(measurementFrequencyData);
        for (let i of setMeasurementFrequency) {
            let obj = {
                MeasurementFrequency: i,
                Measured: this.filterMeasuredData(i, 'Measured'),
                NotMeasured: this.filterMeasuredData(i, 'Not Measured'),
                Count: this.countFrequency(i),
            };
            listMeasurementFrequency.push(obj);
        }

        return this.getOrderFrequency(listMeasurementFrequency);
    }

    measurementFrequency(): any {
        let listMeasurementFrequency: any = [];
        let measurementFrequencyData: any = [];
        let service;
        // if(this.dataSource.data.length > 0){
        service = this.completedata;
        // }else{
        // service = this.kriService?.kriMeasurments
        // }
        for (let i in service) {
            measurementFrequencyData.push(service[i].MeasurementFrequency);
        }
        let setMeasurementFrequency = new Set(measurementFrequencyData);
        for (let i of setMeasurementFrequency) {
            let obj = {
                MeasurementFrequency: i,
                Measured: this.filterMeasuredData(i, 'Measured'),
                NotMeasured: this.filterMeasuredData(i, 'Not Measured'),
                Count: this.countFrequency(i),
            };
            listMeasurementFrequency.push(obj);
        }
        return this.getOrderFrequency(listMeasurementFrequency);
    }

    notMeasuredData(): any {
        let service = this.kriService?.kriMeasurments;
        let data = 0;
        for (let i in service) {
            if (service[i].StatusName === 'Not Measured') {
                data++;
            }
        }
        return data;
    }

    measuredFrequencyCount(dat: any): any {
        // MeasurementFrequency
        // let service = this.kriService?.kriMeasurments
        let service;
        // if(this.dataSource.data.length > 0){
        service = this.completedata;
        // }else{
        // service = this.kriService?.kriMeasurments
        // }
        // let service = this.dataSource.data;
        let data = 0;
        for (let i in service) {
            if (service[i].MeasurementFrequency === dat) {
                data++;
            }
        }
        return data;
    }
    MeasuredCount(dat: any, measured: any): any {
        // console.log('measured: ', measured);

        // let service;
        // if(this.dataSource.data.length > 0){
        //     service = this.dataSource.data
        // }else{
        // service = this.kriService?.kriMeasurments
        // }
        let service = this.completedata;
        let data = 0;
        for (let i in service) {
            if (
                service[i].MeasurementFrequency === dat &&
                service[i].KRI_Status === measured
            ) {
                data++;
            }
        }
        return data;
    }

    exportAsExcel() {
        var filteredData = this.dataSource.filteredData.map(function (
            item: any,
            index: any
        ) {
            delete item.UnitID,
                delete item.MetricID,
                delete item.KriTypeID,
                delete item.GroupID,
                delete item.MeasurementFrequencyID;
            var obj = {
                'Sl No': index + 1,
                'KRI Code': item.KriCode,
                'Group Name': item.GroupName,
                'Unit Name': item.Unit_Name,
                Indicator: item.Indicator,
                'Measurement Frequency': item.MeasurementFrequency,
                Target: item.Target ? item.Target.toString() + '%' : '0%',
                'KRI Type': item.KriType,
                "Threshold Value 1": item.ThresholdValue1 >= 0 ? (item.ThresholdValue1 <= item.ThresholdValue2 ? ">=" : "<=") + item.ThresholdValue1.toString() + '%' : '',
                'Threshold Value 2': item.ThresholdValue2 ? (item.ThresholdValue2 <= item.ThresholdValue3 ? ">=" : "<=") + item.ThresholdValue2.toString() + '%' : '',
                'Threshold Value 3': item.ThresholdValue3 ? (item.ThresholdValue3 <= item.ThresholdValue4 ? ">=" : "<=") + item.ThresholdValue3.toString() + '%' : '',
                'Threshold Value 4': item.ThresholdValue4 ? (item.ThresholdValue4 <= item.ThresholdValue5 ? ">=" : "<=") + item.ThresholdValue4.toString() + '%' : '',
                'Threshold Value 5': item.ThresholdValue5 ? item.ThresholdValue5.toString() + '%' : '0%',
                Period: item.Period,
                Date: item.Date
                    ? new Date(item.Date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                    })
                    : '',
                Measurement:
                    item.Measurement != null
                        ? item.Measurement.toString()?.length > 0
                            ? item.Measurement.toString() + '%'
                            : ''
                        : '',
                'KRI Value': item.ThresholdValue,
                'ColorCode': item.ColorCode,
                Remarks: item.Remarks,
                Status: item.KRI_Status,
                'Checker Comments': item.CommentBody,
            };
            return obj;
        });
        // console.log('filtered Data for Excel file : ', filteredData);
        this.kriService.exportAsExcelFile(filteredData, 'KRI_Review_Report');
    }

    isDataModified(): boolean {
        return this.dataSource.data.some(
            (kri: any) =>
                kri?.Measurement != kri?.MeasurementOld ||
                kri?.Remarks != kri?.RemarksOld
        );
    }

    OnfilesdataOP(evt: any) {
        let fileEvidences = evt.Evidences;
        if (fileEvidences) {
            fileEvidences.forEach((ele: any) => {
                if (!ele.MetricID) {
                    ele['MetricID'] = evt.inputData.MetricID;
                }
            });
            this.dataSource.data.forEach((metric: any) => {
                if (metric.MetricID == evt.inputData.MetricID) {
                    metric.evidences = fileEvidences;
                }
            });
        }
    }

    getPreviousScoring(row: any) {
        if (
            row &&
            row.PreviousScoring &&
            row.PreviousScoring.length > 0 &&
            row.PreviousScoring
        ) {
            return row.PreviousScoring.sort(
                (a: any, b: any) =>
                    new Date(b.Date).getTime() - new Date(a.Date).getTime()
            );
        } else {
            return null;
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
    }

    sendBulkRemainder() {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            id: 'InfoComponent',
            disableClose: true,
            minWidth: '300px',
            panelClass: 'dark',
            data: {
                title: 'Confirm Reminder',
                content: 'Are you sure you want to send the reminder?',
            },
        });
        confirm.afterClosed().subscribe((result) => {
            if (result) {
                this.kriService.sendBulkRemainder().subscribe((res) => {
                    next: if (res.success == 1) {
                        this.saveSuccess(res.message);
                    } else {
                        if (res.error.errorCode == 'TOKEN_EXPIRED')
                            this.utils.relogin(this._document);
                        else this.saveerror = res.error.errorMessage;
                    }
                    error: console.log('err::', 'error');
                });
            }
        });
    }

    saveSuccess(content: string): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: 'InfoComponent',
            disableClose: true,
            minWidth: '5vh',
            panelClass: 'success',
            data: {
                title: 'Success',
                content: content,
            },
        });
        confirm.afterOpened().subscribe((result) => {
            setTimeout(() => {
                this.dataApprovedRejected = []
                this.kriService.getkrireporteddata();
                // this.colorValues = 'total';
                // this.selectedRow = 'total';
                this.refreshTable();
                confirm.close();
            }, timeout);
        });
    }

    sendIndividualEmailReminder(metricId: number) {
        // console.log("🚀 ~ file: kri-measurement-review.component.ts:1090 ~ KriMeasurementReviewComponent ~ sendIndividualEmailReminder ~ metricId:", metricId)
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            id: 'InfoComponent',
            disableClose: true,
            minWidth: '300px',
            panelClass: 'dark',
            data: {
                title: 'Confirm Reminder',
                content: 'Are you sure you want to send the reminder?',
            },
        });
        confirm.afterClosed().subscribe((result) => {
            let data = {
                metricID: Number(metricId),
            };
            if (result) {
                this.kriService
                    .sendIndividualRemainder(data)
                    .subscribe((res) => {
                        next: if (res.success == 1) {
                            this.saveSuccess(res.message);
                        } else {
                            if (res.error.errorCode == 'TOKEN_EXPIRED')
                                this.utils.relogin(this._document);
                            else this.saveerror = res.error.errorMessage;
                        }
                        error: console.log('err::', 'error');
                    });
            }
        });
    }

    openDialog(): void {
        this.dataRejected = this.kriService.kriMeasurments.filter((x: any) => x.isChecked == false && x.ReportStatusID == 2 && x.IsSaved).some((y: any) => y.CommentBody.length == 0)
        // console.log("Data Rejected KRI Measurement Review Component: ", this.dataRejected);
        this.dataApprove = this.kriService.kriMeasurments.filter((x: any) => x.isChecked == true && x.ReportStatusID == 3 && x.IsSaved).some((y: any) => y.CommentBody.length == 0)
        // console.log("Data Approve KRI Measurement Review Component: ", this.dataApprove);
        this.allData = this.dataSource.data.filter(
            (x: any) => ['Approved', 'Rejected'].includes(x.KRI_Status)
        );
        if (this.dataRejected || this.dataApprove) {
            //console.log("inside if")
            const dialog = this.dialog.open(
                KriSendEmailReminderDialogComponent,
                {
                    disableClose: true,
                    maxWidth: '50vw',
                    panelClass: 'full-screen-modal',
                    data: {
                        allData: this.allData,
                        id: this.checkedData,
                        save: this.isSubmit
                    },
                }
            );
            dialog.afterClosed().subscribe((result) => {
                if (result) {
                    this.isSubmit = true
                }

            });
        } else {
            const metricIds: string = this.allData.filter((ele: any) => ele.IsSaved == true && ele.isChecked != null).map((metric: any) => metric.MetricID).join(',');
            const confirm = this.dialog.open(ConfirmDialogComponent, {
                id: 'InfoComponent',
                disableClose: true,
                minWidth: '300px',
                panelClass: 'dark',
                data: {
                    title: 'Confirm Submission',
                    content: "Are you sure you want to Submit the KRI's?",
                },
            });
            confirm.afterClosed().subscribe((result) => {
                if (result) {
                    this.kriService.submitReviewerDetails({ metricIDs: metricIds }).subscribe(
                        (res: any) => {
                            if (res.success === 1) {
                                this.saveSuccess(res.message);
                                this.isSubmit = true;
                            } else {
                                if (
                                    res.error.errorCode === 'TOKEN_EXPIRED'
                                ) {
                                    this.utils.relogin(this._document);
                                } else {
                                    this.saveerror = res.error.errorMessage;
                                }
                            }
                        },
                        (error: any) => {
                            console.log('err::', error);
                        }
                    );
                }
            });
        }
        this.allApprovedRejected = this.dataSource.data.every((obj: any) => obj.ReportStatusID == 2 || obj.ReportStatusID == 3)
    }

    approvedRejectedDetails(event: any, value: string, rowData: any) {
        if (value == 'rejected') {
            this.dataSource.data.forEach((metric: any) => {
                if (metric.MetricID == rowData.MetricID) {
                    metric.IsReviewedData = false;
                }
            });
        } else if (value == 'approved') {
            this.dataSource.data.forEach((metric: any) => {
                if (metric.MetricID == rowData.MetricID) {
                    metric.IsReviewedData = true;
                }
            });
        }
        this.isReviewedStatus = true;
    }

    saveReviewerDetails(): void {
        this.isSaved = true;
        // if (!this.dataSource.data.filter((x: any) => x.isChecked == false && x.ReportStatusID == 1).every((y: any) => y.CommentBody.length > 0)
        // ) {
        //     return;
        // }
        // console.log('✌️  this.dataApprovedRejected --->',   this.dataApprovedRejected);
        this.dataApprovedRejected.forEach((metric: any) => {
            if (metric.isChecked !== null) {
                this.KRIReviewData.push({
                    metricID: metric.MetricID,
                    measurementID: metric.MeasurementID,
                    commentBody: metric.CommentBody ? metric.CommentBody : '',
                    isApproved: metric.isChecked == null ? metric.IsReviewedData : metric.isChecked == true ? '1' : '0',
                });
            }
        });
        this.dataApprovedRejected.forEach((metric: any) => {
            metric.isSavedSubmit = false
        });
        // console.log("🚀 ~ file: kri-measurement-review.component.ts:1215 ~ KriMeasurementReviewComponent ~ this.dataApprovedRejected.forEach ~ this.dataApprovedRejected:", this.dataApprovedRejected)
        // this.dataApprovedRejected = []
        if (this.dataApprovedRejected.length > 0) {
            // this.KRIReviewData = this.KRIReviewData.filter((ele:any) => ele.commentBody.trim() != "")
            this.kriService.saveReviewerDetails(this.KRIReviewData).subscribe((res: any) => {
                next: {
                    if (res.success == 1) {
                        this.dataApprovedRejected.splice(0, this.dataApprovedRejected.length);
                        // console.log(" this.KRIReviewData",this.KRIReviewData)
                        this.saveSuccess(res.message);
                    } else {
                        if (res.error.errorCode == 'TOKEN_EXPIRED')
                            this.utils.relogin(this._document);
                        else this.saveerror = res.error.errorMessage;
                    }
                    error: console.log('err::', 'error');
                }
                this.KRIReviewData = [];
                this.isSubmit = false;
            })
        } else {
            this.popupInfo("Information", "Data was not changed", false, null);
        }

        // if(this.KRIReviewData.length > 0){
        //     this.submitButton = this.kriService.kriMeasurments.filter((ele: any) => ele.IsSaved == true).length > 0;
        // }else{
        //     this.submitButton = false
        // }

        this.isReviewedStatus = false;
    }
    popupInfo(title: string, content: string, refresh: boolean = false, res: any): void {
        const info = this.dialog.open(InfoComponent, {
            // disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: content
            }
        });
        info.afterOpened().subscribe(result => {
            setTimeout(() => {
                info.close()
            }, 3000)
        });
    }
    countReportStatus(measurementFrequency: string, status: any): number {

        let reportStatusCount: any[] = [];
        if (this.kriService.kriReviewerUser) {
            // console.log('this.kriService.kriReviewerUser - if'+this.kriService.kriReviewerUser)
            if (this.completedata?.length) {
                if (measurementFrequency === 'total') {
                    reportStatusCount = this.completedata.filter((data: any) => data.KRI_Status === status);
                } else {
                    reportStatusCount = this.completedata.filter((data: any) => data.MeasurementFrequency === measurementFrequency &&
                        data.KRI_Status === status);
                }
            }
        } else {
            // console.log('this.kriService.kriReviewerUser - else'+this.kriService.kriReviewerUser)
            if (this.completedata?.length) {
                if (measurementFrequency === 'total') {
                    reportStatusCount = this.completedata.filter((data: any) => data.KRI_Status === status);
                } else {
                    reportStatusCount = this.completedata.filter((data: any) => data.MeasurementFrequency === measurementFrequency &&
                        data.KRI_Status === status);
                }
            }
        }

        return reportStatusCount.length;
    }

    onRadioClick(selectedStatus: string, row: any): void {
        // Update the selectedStatus property of the clicked row
        row.selectedStatus = selectedStatus;
    }

    isRadioDisabled(row: any): boolean {
        // Add your conditions to determine if the radio buttons should be disabled
        return (
            this.kriService.kriReviewerUser == false ||
            this.department == 'own' ||
            (this.kriService?.kriReviewerUser == true &&
                (row.StatusName == 'Measured' ||
                    row.StatusName == 'Not Measured'))
        );
    }

    reportedStatus(val: any, data: any): any {
        this.filteredStatus = data;
        // console.log('this.filteredStatus: ', this.filteredStatus);
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        if (val == 'total') {
            for (let i in service) {
                if (service[i].KRI_Status === data) {
                    listData.push(service[i]);
                    setTimeout(
                        () => (this.dataSource.paginator = this.paginator)
                    );
                }
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
        } else {
            for (let i in service) {
                if (
                    service[i].KRI_Status === data &&
                    service[i].MeasurementFrequency === val
                ) {
                    listData.push(service[i]);
                    setTimeout(
                        () => (this.dataSource.paginator = this.paginator)
                    );
                }
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
        }
        // console.log('listData: ', listData);

        listData.forEach((element: any) => {
            element.CommentBody = !(element.IsVisible && element.IsSaved) ? element.CommentBody : '';
        });


        this.dataSource.data = listData;
        this.colorValues = data + val;
        this.selectedRow = data + val;

        this.selectedRowFrequency = val;
        this.selectedStatus = data;
    }

    reject(data: any, value: boolean) {
        this.isSubmit = true
        if (data.isChecked == false && data.IsSaved == true) {
            // console.log("inside if")
            this.popupCheckBox()
        }
        // Remove any existing record with the same metric ID
        this.dataSource.data.forEach((x: any) => {
            if (x.MetricID === data.MetricID) {
                if (x.isChecked === null || x.isChecked == true) {
                    x.isChecked = value;
                    x.isSavedSubmit = true;
                    this.dataApprovedRejected.push(x);
                } else {
                    x.isChecked = null;
                }
            }
        });
        this.removeMetricFromApprovedRejected(data);

    }

    approve(data: any, value: boolean) {
        this.isSubmit = true
        if (data.isChecked == true && data.IsSaved == true) {
            this.popupCheckBox()
        }
        // Remove any existing record with the same metric ID
        this.dataSource.data.forEach((x: any) => {
            if (x.MetricID === data.MetricID) {
                if (x.isChecked === null || x.isChecked == false) {
                    x.isChecked = value;
                    x.isSavedSubmit = true;
                    this.dataApprovedRejected.push(x);
                } else {
                    x.isChecked = null;
                }
            }
        });
        this.removeMetricFromApprovedRejected(data);


    }


    removeMetricFromApprovedRejected(metric: any) {
        let latestMetricIndex = -1;
        // Find the latest occurrence of the metric ID
        this.dataApprovedRejected.forEach((x: any, index: number) => {
            if (x.MetricID === metric.MetricID) {
                latestMetricIndex = index;
            }
        });

        // Remove all occurrences of the metric ID except the latest one
        if (latestMetricIndex !== -1) {
            this.dataApprovedRejected = this.dataApprovedRejected.filter((x: any, index: number) => index === latestMetricIndex || x.MetricID !== metric.MetricID);
        }
        // console.log("🚀 ~ file: kri-measurement-review.component.ts:1378 ~ KriMeasurementReviewComponent ~ removeMetricFromApprovedRejected ~   this.dataApprovedRejected:", this.dataApprovedRejected)

    }

    popupCheckBox(): MatDialogRef<AlertComponent> {
        const dialogRef = this.dialog.open(AlertComponent, {
            width: '250px',
            panelClass: 'dark',
            data: {
                title: '',
                content: `As particular KRI is already saved Please select Approve or Reject`
            }
        });

        return dialogRef;
    }


    setApproveAll(data: any, value: boolean) {
        this.isSubmit = true
        this.checkedData = value;
        this.dataSource.data.forEach((x: any) => {
            if (x.KRI_Status != 'Measured' && x.KRI_Status != 'Not Measured' && x.KRI_Status != null && x.IsSaved != false ) {
                if (data == null || data != value) {
                    this.checkedAll = value;
                    x.isChecked = value;
                    x.isSavedSubmit = true;
                    const existingIndex = this.dataApprovedRejected.findIndex((item: any) => item.MetricID === x.MetricID);
                    if (existingIndex === -1) {
                        this.dataApprovedRejected.push(x);
                    } else {
                        this.dataApprovedRejected[existingIndex] = { ...x };
                    }
                } else if (data == value && x.isChecked !== true) {
                    this.checkedAll = null;
                    x.isChecked = null;
                } else if (data == value && x.isChecked == true) {
                    this.checkedAll = null;
                    x.isChecked = null;
                }
            }
        });
        this.removeMetricFromApprovedRejected(data);
    }

    setRejectAll(data: any, value: boolean) {
        this.isSubmit = true
        this.checkedData = value;
        this.dataSource.data.forEach((x: any) => {
            if (x.KRI_Status != 'Measured' && x.KRI_Status != 'Not Measured' && x.KRI_Status != null && x.IsSaved != false) {
                
                
                if (data == null || data != value) {
                    this.checkedAll = value;
                    
                    x.isChecked = value;
                    
                    x.isSavedSubmit = true;

                    const existingIndex = this.dataApprovedRejected.findIndex((item: any) => item.MetricID === x.MetricID);
                    if (existingIndex === -1) {
                        this.dataApprovedRejected.push(x);
                    } else {
                        this.dataApprovedRejected[existingIndex] = { ...x };
                    }
                } else if (data == value && data.isChecked !== true) {
                    // console.log("🚀 ~ file: kri-measurement-review.component.ts:1517 ~ KriMeasurementReviewComponent ~ this.dataSource.data.forEach ~ this.checkedAll:", this.checkedAll)
                    this.checkedAll = null;
                    
                    
                    x.isChecked = null;
                    
                    this.dataApprovedRejected = this.dataApprovedRejected.filter((item: any) => item.MetricID !== x.MetricID);
                }
            }
        });
        this.removeMetricFromApprovedRejected(data);
        this.dataSource.data.every((x: any) => x.KRI_Status == 'Not Measured' || x.KRI_Status == 'Measured')
    }

    viewPreviousComments(element: any): void {
        let comments = element.CommentData
            ? element.CommentData.filter((x: any) => x.IsVisible && x.CommentBody != "") || []
            : [];
        const info = this.dialog.open(CommentsComponent, {
            minWidth: '28vw',
            maxWidth: '60vw',
            minHeight: '30vh',
            maxHeight: '60vh',
            panelClass: 'dark',
            data: {
                title: 'Previous Comments',
                comments: comments,
            },
        });
    }


    toggleMenu() {
        this.isExpanded = !this.isExpanded;
    }

    getTooltipMessage(element: any): any {
        if (element.KRI_Status === 'Measured' || element.KRI_Status === 'Not Measured') {
            return 'Button is disabled as this KRI has not been Reported';
        } else if (element.IsSaved === false && (element.ReportStatusID === 3 || element.ReportStatusID === 2)) {
            return 'This KRI has been already  reviewed and submitted';
        } else {
            return ''
        }
    }

    commentDataInput(ele: any) {
        this.isSubmit = true

        this.dataSource.data.forEach((x: any) => {
            if (x.MetricID === ele.MetricID) {
                x.CommentBody = ele.CommentBody;
                this.dataApprovedRejected.push(x);
                this.dataApprovedRejected.push(x);
            }
        });
        this.removeMetricFromApprovedRejected(ele);

    }

    dataRejectedSubmit(): any {
        // if (this.selectedRowFrequency) {
        //     return true;
        // } else if ((this.selectedStatus === 'Approved' || this.selectedStatus === 'Rejected') && this.completedata.filter((ob: any) => ob.KRI_Status == this.selectedStatus)?.some((ele: any) => (ele.KRI_Status == "Approved" && ele.IsReviewed == true) || (ele.IsReviewed == false && ele.IsSaved == true) || (ele.KRI_Status == "Reported" || ele.KRI_Status == "Not Measured" || ele.KRI_Status == "Measured") && (ele.IsReviewed == false || ele.IsReviewed == null))) {
        //     return true;
        // } else if (this.dataSource.data.some((ele: any) => (ele.KRI_Status == "Reported" || ele.KRI_Status == "Not Measured" || ele.KRI_Status == "Measured") && (ele.IsReviewed == false || ele.IsReviewed == null))) {
        //     return true;
        // } else if (this.dataSource.data.some((ele: any) => (ele.KRI_Status == "Rejected") && (ele.IsReviewed == false || ele.IsReviewed == null) && ele.IsSaved == false)) {
        //     return true;
        // } else if (this.dataSource.data.some((ele: any) => (ele.KRI_Status == "Rejected") && (ele.IsReviewed == false || ele.IsReviewed == null) && ele.IsSaved == true)) {
        //     return false;
        // } else if ((this.groupID != 0 && this.unitID != 0) && this.filteredStatusALL == "all" && (this.dataSource.data.some((ele: any) => (ele.KRI_Status == "Rejected") && (ele.IsReviewed == false || ele.IsReviewed == null) && ele.IsSaved == true))) {
        //     return false;
        // } else {
        //     return false;
        // }
        const hasApprovedOrRejected = this.dataSource.data.some(
            (x: any) => ['Approved', 'Rejected'].includes(x.KRI_Status)
        );
        return !hasApprovedOrRejected;
    }


    shouldDisableCheckbox(element: any): boolean {
        this.disableData = ((element.ReportStatusID == 2 && element.IsReviewed == false && element.IsSaved == false) || (element.ReportStatusID == 3 && element.IsReviewed == true && element.IsSaved == false) || this.isReadOnly || (element.KRI_Status === 'Measured' || element.KRI_Status === 'Not Measured') || element.IsReviewed === true);
        return this.disableData
    }

    bulkSelectionDisable () {

    }

    refreshTable() {
        // Call renderRows() to refresh the table
        this.myTable.renderRows();
    }

    emailEnable(data: any) {
        this.filterKRIData = data.filter((ele: any) => {
            if (ele.KRI_EmailStatus == null && this.kriService.kriReviewerUser) {
                let curDate = new Date();
                let currMonth = curDate.getMonth() + 1;
                let currDay = curDate.getDate();

                let triggerMonth = this.kriService.emailTrigger[0].Month;
                let triggerDay = this.kriService.emailTrigger[0].Day;

                if ((ele.KRI_EmailStatus == null && (currMonth >= triggerMonth && currDay >= triggerDay))) {

                    this.isEnabledIcon = true;
                } else if ((currMonth >= triggerMonth || currMonth == triggerMonth) && currDay >= triggerDay) {
                    this.isEnabledIcon = true;
                } else {
                    this.isEnabledIcon = false;
                }
            }
        })
    }

    getBulkRejectTooltipMessage() {
        if (this.groupSelected == 'all' || this.unitSelected == '' || this.unitSelected == 'all') {
            return ''
        } else if ((this.groupSelected != 'all' && this.unitSelected != 'all' && this.unitSelected != '')) {
            return "Select to Bulk Reject"
        } else if (this.allApprovedRejected && (this.unitSelected == 'all' || this.unitSelected != '') && this.rejectedMetrics) {
            return "No KRI is submitted for review "
        } else if (this.rejectedMetrics) {
            return "No KRI's is submitted for review "
        } else {
            return ""
        }
    }

    get isRejectedValid(): boolean {
        // (this.isReadOnly || this.groupSelected === 'all' || this.rejectedMetrics || this.unitSelected == '' || this.unitSelected == 'all');
        return (this.isReadOnly || this.groupSelected === 'all' || this.unitSelected == '' || this.unitSelected == 'all');
    }    

    getBulkApproveTooltipMessage() {
        if (this.groupSelected == 'all' || this.unitSelected == '' || this.unitSelected == 'all') {
            return ''
        } else if ((this.groupSelected != 'all' && this.unitSelected != 'all' && this.unitSelected != '')) {
            return "Select to Bulk Approve"
        } else if (this.allApprovedRejected && (this.unitSelected == 'all' || this.unitSelected != '' || this.rejectedMetrics)) {
            return "No KRI is submitted for review "
        } else if (this.rejectedMetrics) {
            return "No KRI's is submitted for review "
        } else {
            return ""
        }
    }

    get isApprovedValid(): boolean {
        // (this.isReadOnly || this.groupSelected === 'all' || !this.allApprovedRejected || this.rejectedMetrics || this.unitSelected == '' || this.unitSelected == 'all');
        return (this.isReadOnly || this.groupSelected === 'all' || this.unitSelected == '' || this.unitSelected == 'all');
    }    

    resetFilter() {
        this.groupSelected = "all";
        this.dataSource.filter = "";
        this.colorValues = "total"
        this.selectedRowFrequency = "total"
        this.unitSelected = "all";
        this.model = ""
        this.filteredStatus = "";
        // this.filterGroups({value:this.groupSelected})
        // this.filterUnits({value:this.unitSelected})
        this.kriService.getkrireporteddata();
        this.groupID = 'all';
        this.unitID = 'all';
        this.completedata = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));

        this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
        this.checkedAll = null

    }

    getCommentBody(element: any): string {
        return element.isVisible && element.isSaved ? element.CommentBody : '';
    }


}
