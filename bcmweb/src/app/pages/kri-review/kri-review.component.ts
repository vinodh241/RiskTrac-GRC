import { Component, OnInit, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
// import { KriSendEmailReminderDialogComponent } from './kri-send-email-reminder-dialog/kri-send-email-reminder-dialog.component';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

// import { ValidExtension } from '../incident-list/incident/file-upload/evidence-files/evidence-file.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { KriSendEmailReminderDialogComponent } from '../dashboards/kri/kri-measurement/kri-send-email-reminder-dialog/kri-send-email-reminder-dialog.component';
import { CommentsComponent } from '../risk-metrics/comments/comments.component';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { RestService } from 'src/app/services/rest/rest.service';
export interface KriScoring {
  ThresholdValue: number;
  Kricard: string,
  Indicator: string,
  MeasurementFrequency: string,
  Reportingfrequency: string,
  Target: string,
  Kritype: string,
  Measurmentdata: string,
  Measurmentperiod: string,
  Currentvalue: string,
  Krivalue: string,
  Remarks: string,
  Period: string,
  action: string,
  status: string,
  StatusName: string,
  tresholdvalue: string,
  Lastchangedby: string,
  MeasurementDataList: any[]
}
@Component({
    selector: 'app-kri-review',
    templateUrl: './kri-review.component.html',
    styleUrls: ['./kri-review.component.scss'],
})
export class KriReviewComponent implements OnInit {
    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = '';

    displayedColumns: string[] = [
        'rejectApproveBtn',
        'kricode',
        'indicator',
        'Measurmentfrequency',
        'Target',
        'Kritype',
        'tvalue-1',
        'tvalue-2',
        'tvalue-3',
        'tvalue-4',
        'tvalue-5',
        'period',
        'date',
        'measurement',
        'krivalue',
        'Remarks',
        'status',
        'upload',
        'action',
        'sendEmail',
        'checkerComments',
    ];
    statusData = [
        { id: 'Approve', value: 2, isSelected: false },
        { id: 'Reject', value: 3, isSelected: false },
    ];

    dataSource: MatTableDataSource<KriScoring> = new MatTableDataSource();
    reportFrequencey: any;
    colorValues: any = 'total';
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;
    groupID: any;
    unitID: any;
    groupSelected = 'all';
    unitSelected = 'all';
    department: any = 'all';
    reportWithUnit: boolean = false;
    submited: any = false;
    remarksFilled: boolean = false;
    completedata: any;
    model: any = '';
    isCollapsed = false;
    selectedRow: any;
    showPrevDataDetails: boolean = false;
    isShowModal: boolean = false;
    saveerror: string = '';
    commentBody: string = '';
    isReviewedStatus: boolean = false;
    selectedOption: string = '';
    approveChecked: boolean = false;
    rejectChecked: boolean = false;
    submitButton: boolean = false;
    KRIReviewData: any[] = [];
    isPowerUserRole: boolean = false;
    isRiskManagementUnit: boolean = false;
    isStandardUser: boolean = false;
    isReadOnly: boolean = false;
    isValid: boolean = false;
    isValidSave: boolean = false;
    isSaved: boolean = false;

    checkedAll: any = null;
    public uploader: FileUploader = new FileUploader({
        isHTML5: true,
    });
    checkedData: any;
    allData: any;
    commentData: any;
    element: any;
    wait: any;
    dataHide: boolean = false;

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
                if (
                    this.kriService.powerUser &&
                    this.kriService.kriReviewerUser
                ) {
                    this.isReadOnly = false;
                } else if (
                    (this.isPowerUserRole && this.isRiskManagementUnit) ||
                    (this.isStandardUser && this.isRiskManagementUnit)
                ) {
                    this.isReadOnly = true;
                } else {
                    this.dataHide = true;
                }
                if (this.groupID && this.unitID) {
                    let list: any = [];
                    for (let i of this.kriService?.kriMeasurments) {
                        if (
                            i.GroupID == this.groupID &&
                            i.UnitID == this.unitID
                        ) {
                            list.push(i);
                        }
                    }
                    this.dataSource.data = list;

                    this.completedata = list;
                } else if (this.groupID) {
                    let list: any = [];
                    for (let i of this.kriService?.kriMeasurments) {
                        if (i.GroupID == this.groupID) {
                            list.push(i);
                        }
                    }
                    this.dataSource.data = list;
                    this.completedata = list;
                } else {
                    this.dataSource.data = JSON.parse(
                        JSON.stringify(kriService.kriMeasurments)
                    );
                    this.completedata = kriService.kriMeasurments;
                }
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.colorValues = 'total';
                }, 100);
            }
        });
    }

    showPrevData() {
        this.showPrevDataDetails = true;
    }

    ngOnInit(): void {
        console.log('headers', this.displayedColumns);
        // let listGroup: any[] = []
        // listGroup.push({
        //     groupID : "all",
        //     unitID : "all",
        //     selectedStatus : null,
        //     selectedFrequency : "total",
        //     IsOwnUnitData : 1
        //    })
        // this.kriService.getkrireporteddata(listGroup[0]);
        this.kriService.getkrireporteddata();
        this.submitButton =
            this.kriService.kriMeasurments.filter(
                (ele: any) => ele.IsSaved == true
            ).length > 0;
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
            // let listGroup: any[] = []
            // listGroup.push({
            //     groupID : "all",
            //     unitID : "all",
            //     selectedStatus : null,
            //     selectedFrequency : "total",
            //     IsOwnUnitData : 1
            //    })
            // this.kriService.getkrireporteddata(listGroup[0]);
            this.kriService.getkrireporteddata();
        } else {
            this.department = 'all';
            // let listGroup: any[] = []
            // listGroup.push({
            //     groupID : "all",
            //     unitID : "all",
            //     selectedStatus : null,
            //     selectedFrequency : "total",
            //     IsOwnUnitData : 1
            //    })
            // this.kriService.getkrireporteddata(listGroup[0]);
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
        console.log('data in if', data.value);
        if (data.value == 'all') {
            this.dataSource.data = this.kriService?.kriMeasurments;
            this.completedata = this.kriService?.kriMeasurments;
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        } else {
            console.log('inside else part');
            let list: any = [];
            let service = this.kriService?.kriMeasurments;
            this.groupID = data.value;
            console.log('groupId in groups', this.groupID);
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == data.value) {
                    list.push(i);
                    setTimeout(
                        () => (this.dataSource.paginator = this.paginator)
                    );
                }
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            this.dataSource.data = list;
            this.completedata = list;
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
    }

    getUnitsNames(data: any): any {
        // console.log("data", data, this.groupID);
        let list: any = [];
        for (let i in data) {
            if (data[i].GroupID == this.groupID) {
                list.push(data[i]);
            }
        }
        //   console.log("data", list);
        return list;
    }

    filterUnits(data: any) {
        if (data.value == 'all') {
            let list: any = [];
            let service = this.kriService?.kriMeasurments;
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == this.groupID) {
                    list.push(i);
                    setTimeout(
                        () => (this.dataSource.paginator = this.paginator)
                    );
                }
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            this.dataSource.data = list;
            this.completedata = list;
        } else {
            let list: any = [];
            let service = this.kriService?.kriMeasurments;
            this.unitID = data.value;
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == this.groupID && i.UnitID == this.unitID) {
                    list.push(i);
                    setTimeout(
                        () => (this.dataSource.paginator = this.paginator)
                    );
                }
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            this.dataSource.data = list;
            this.reportWithUnit = true;
            this.completedata = list;
        }
    }

    colorValue(data: any): any {
        return this.colorValues == data;
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

    onChangeMeasurement(row: any): void {
        row.ThresholdValue = '';
        row.ColorCode = '#FFFFFF';
        if (row.Measurement > 100) row.Measurement = 100;
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
        // if(this.dataSource.data.length > 0){
        service = this.completedata;
        // }else{
        //     service = this.kriService?.kriMeasurments
        // }
        // let service = this.kriService.kriMeasurments
        // let service = this.dataSource.data
        let data = 0;
        for (let i in service) {
            data++;
        }
        return data;
    }

    measuredData(mdata: any): any {
        // console.log('✌️mdata --->', mdata);
        let service;
        // if(this.dataSource.data.length > 0){
        service = this.completedata;
        // console.log('✌️service --->', service);
        // }else{
        //     service = this.kriService?.kriMeasurments
        // }
        // let service = this.kriService.kriMeasurments
        // let service = this.dataSource.data
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
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            listData.push(service[i]);
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }
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
        this.dataSource.data = listData;
        // this.dataSource.data.filter((rec:any) => rec.StatusName == data)
        this.colorValues = data;
        this.selectedRow = data;
    }

    measuredFrequency(frequency: any, data: any) {
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        for (let i in service) {
            console.log(service[i]);
            if (
                service[i].KRI_Status === data &&
                service[i].MeasurementFrequency === frequency
            ) {
                listData.push(service[i]);
                setTimeout(() => (this.dataSource.paginator = this.paginator));
            }
            setTimeout(() => (this.dataSource.paginator = this.paginator));
        }
        this.dataSource.data = listData;
        this.colorValues = data + frequency;
        this.selectedRow = data + frequency;
    }

    measurementFrequencyData(data: any) {
        console.log(data);
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
        this.dataSource.data = listData;
        this.colorValues = data;
        this.selectedRow = data;
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
            if (service[i].MeasurementFrequency === dat.MeasurementFrequency) {
                data++;
            }
        }
        return data;
    }
    MeasuredCount(dat: any, measured: any): any {
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
                service[i].MeasurementFrequency === dat.MeasurementFrequency &&
                service[i].KRI_Status === measured
            ) {
                data++;
            }
        }
        return data;
    }

    exportAsExcel() {
        // console.log('this.dataSource.filteredData: ',this.dataSource.filteredData)
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
                'Threshold Value 1': item.ThresholdValue1
                    ? (item.Target == 0 ? '>' : '<') +
                      item.ThresholdValue1.toString() +
                      '%'
                    : '',
                'Threshold Value 2': item.ThresholdValue2
                    ? (item.Target == 0 ? '<=' : '>=') +
                      item.ThresholdValue2.toString() +
                      '%'
                    : '',
                'Threshold Value 3': item.ThresholdValue3
                    ? (item.Target == 0 ? '<=' : '>=') +
                      item.ThresholdValue3.toString() +
                      '%'
                    : '',
                'Threshold Value 4': item.ThresholdValue4
                    ? (item.Target == 0 ? '<=' : '>=') +
                      item.ThresholdValue4.toString() +
                      '%'
                    : '',
                'Threshold Value 5': item.ThresholdValue5
                    ? item.ThresholdValue5.toString() + '%'
                    : '0%',
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
                'Color Code': item.ColorCode,
                Remarks: item.Remarks,
                Status: item.StatusName,
                //'Previous Scoring': item.PreviousScoring
            };
            // console.log("obj",obj)
            return obj;
        });
        this.kriService.exportAsExcelFile(filteredData, 'kriscore');
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
                
                this.kriService.getkrireporteddata();
                confirm.close();
            }, timeout);
        });
    }

    sendIndividualEmailReminder(metricId: number) {
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
                metricID: 3,
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
        console.log('insdie');
        //   this.commentData = this.dataSource.data.filter((metric: any) => metric.CommentData.length > 1)
        console.log(
            '🚀 ~ file: kri-review.component.ts:992 ~ KriReviewComponent ~ openDialog ~ this.commentData:',
            this.commentData
        );
        if (this.checkedData == false) {
            this.allData = this.dataSource.data.filter(
                (ele: any) => ele.isChecked == false
            );
            console.log('🚀 ~ this.allData', this.allData);
            const dialog = this.dialog.open(
                KriSendEmailReminderDialogComponent,
                {
                    disableClose: true,
                    maxWidth: '50vw',
                    panelClass: 'full-screen-modal',
                    data: {
                        allData: this.allData,
                        id: this.checkedData,
                    },
                }
            );

            console.log('dialog:  ' + JSON.stringify(dialog));
            dialog.afterClosed().subscribe((result) => {});
        } else {
            const metricIds: string = this.kriService.kriMeasurments
                .filter((ele: any) => ele.IsSaved == true)
                .map((metric: any) => metric.MetricID)
                .join(',');
            console.log(
                '🚀 ~ file: kri-review.component.ts:1026 ~ KriReviewComponent ~ openDialog ~ metricIds:',
                metricIds
            );
            this.kriService
                .submitReviewerDetails({ metricIDs: metricIds })
                .subscribe(
                    (res: any) => {
                        if (res.success === 1) {
                            this.saveSuccess(res.message);
                        } else {
                            if (res.error.errorCode === 'TOKEN_EXPIRED') {
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

            console.log('inside save details', metricIds);

            // console.log("insdie save details", KRIReviewData);
        }
    }

    approvedRejectedDetails(event: any, value: string, rowData: any) {
        console.log('insdie event', event, event.target.checked);
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
        if (
            !this.dataSource.data
                .filter(
                    (x: any) => x.isChecked == false && x.ReportStatusID == 1
                )
                .every((y: any) => y.CommentBody.length > 0)
        ) {
            return;
        }
        console.log('this.dataSource.data', this.dataSource.data);
        this.dataSource.data.forEach((metric: any) => {
            console.log(
                'this.kriService.kriMeasurments.find((x: any) => metric.MetricID == x.MetricID )',
                this.kriService.kriMeasurments.find(
                    (x: any) => metric.MetricID == x.MetricID
                ).isChecked,
                metric.isChecked
            );
            if (
                this.kriService.kriMeasurments.find(
                    (x: any) => metric.MetricID == x.MetricID
                ).isChecked != metric.isChecked
            ) {
                console.log('measurementid', metric);
                this.KRIReviewData.push({
                    metricID: metric.MetricID,
                    measurementID: metric.MeasurementID,
                    commentBody: metric.CommentBody,
                    isApproved:
                        metric.isChecked == null
                            ? metric.IsReviewedData
                            : metric.isChecked == true
                            ? '1'
                            : '0',
                });
                console.log('KRIReviewData', this.KRIReviewData);
            } else {
                return;
            }
        });
        //   KRIReviewData.filter((ele : any)=> ele.commentBody != "")
        this.kriService
            .saveReviewerDetails(this.KRIReviewData)
            .subscribe((res: any) => {
                next: if (res.success == 1) {
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == 'TOKEN_EXPIRED')
                        this.utils.relogin(this._document);
                    else this.saveerror = res.error.errorMessage;
                }
                error: console.log('err::', 'error');
            });
        this.submitButton =
            this.kriService.kriMeasurments.filter(
                (ele: any) => ele.IsSaved == true
            ).length > 0;
        console.log('insdie save details', this.KRIReviewData);
        this.isReviewedStatus = false;
    }

    countReportStatus(measurementFrequency: string, status: any): number {
        let reportStatusCount: any[] = [];
        if (this.completedata.length) {
            if (measurementFrequency === 'total') {
                reportStatusCount = this.completedata.filter(
                    (data: any) => data.ReportStatusName === status
                );
            } else {
                reportStatusCount = this.completedata.filter(
                    (data: any) =>
                        data.MeasurementFrequency === measurementFrequency &&
                        data.ReportStatusName === status
                );
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
        this.model = '';
        this.dataSource.filter = ' ';
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
        let listData: any = [];
        let service = this.completedata;
        if (val == 'total') {
            for (let i in service) {
                if (service[i].ReportStatusName === data) {
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
                    service[i].ReportStatusName === data &&
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

        this.dataSource.data = listData;
        // this.dataSource.data.filter((rec:any) => rec.StatusName == data)
        this.colorValues = data;
        this.selectedRow = data;
    }

    reject(data: any, value: boolean) {
        console.log(
            '🚀 ~ file: kri-review.component.ts:1128 ~ KriReviewComponent ~ reject ~ value:',
            value
        );
        console.log('datar', data);
        // if(data.CommentBody.length == 0 && value == false){
        //     this.isValidSave = false
        //     this.isValid = true
        // }else{
        //     this.isValidSave = true
        // }
        this.dataSource.data.forEach((x: any) => {
            if (x.MetricID === data.MetricID) {
                if (x.isChecked === null) {
                    x.isChecked = value;
                } else {
                    x.isChecked = null;
                }
            }
        });

        // this.dataSource.data = this.kriService.kriMeasurments;

        console.log('this.kriService.kriMeasurments', this.dataSource.data);
    }

    approve(data: any, value: boolean) {
        console.log(
            '🚀 ~ file: kri-review.component.ts:1132 ~ KriReviewComponent ~ approve ~ value:',
            value
        );
        console.log('data', data);
        this.dataSource.data.forEach((x: any) => {
            if (x.MetricID === data.MetricID) {
                if (x.isChecked === null || x.isChecked == false) {
                    x.isChecked = value;
                } else {
                    x.isChecked = null;
                }
            }
        });
        console.log('this.dataSource.data11', this.dataSource.data);

        //   this.dataSource.data = this.kriService.kriMeasurments;
    }

    setApproveAll(data: any, value: boolean) {
        this.checkedData = value;this.kriService.kriMeasurments.forEach((x: any) => {
            if (x.ReportStatusID != 2 && x.ReportStatusID != 3 && x.KRI_Status != 'Measured' && x.KRI_Status != 'Not Measured' &&  x.KRI_Status != null) {
                console.log('approve------all')
                if (data == null || data != value) {
                    this.checkedAll = value;
                    x.isChecked = value;
                } else if (data == value) {
                    this.checkedAll = null;
                    x.isChecked = null;
                }
            }
        });
        this.dataSource.data = this.kriService.kriMeasurments;
    }

    setRejectAll(data: any, value: boolean) {
        this.checkedData = value;
        this.kriService.kriMeasurments.forEach((x: any) => {
            if (x.ReportStatusID != 3 && x.KRI_Status != 'Measured' &&  x.KRI_Status != 'Not Measured' &&  x.KRI_Status != null  ) {
                console.log('reject------all')
                if (data == null || data != value) {
                    this.checkedAll = value;
                    x.isChecked = value;
                } else if (data == value && data.isChecked != true) {
                    this.checkedAll = null;
                    x.isChecked = null;
                } 
            }
        });
        this.dataSource.data = this.kriService.kriMeasurments;
    }

    viewPreviousComments(element: any): void {
        console.log('element:  ' + JSON.stringify(element));
        let comments = element.CommentData
            ? element.CommentData.filter((x: any) => x.IsVisible) || []
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
}
