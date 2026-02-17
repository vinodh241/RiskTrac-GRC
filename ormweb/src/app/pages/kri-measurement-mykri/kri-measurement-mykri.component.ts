import { Component, OnInit, ChangeDetectorRef, ElementRef, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommentsComponent } from 'src/app/pages/risk-metrics/comments/comments.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { take } from 'rxjs/operators';

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
    selector: 'app-kri-measurement-mykri',
    templateUrl: './kri-measurement-mykri.component.html',
    styleUrls: ['./kri-measurement-mykri.component.scss']
})
export class KriMeasurementMykriComponent implements OnInit {
    mainColumn: string[] = [
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
        'checkerComments'
    ];
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
    allColumnsForData: string[] = [
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
        'checkerComments'
    ];
    dataSource: MatTableDataSource<KriScoring> = new MatTableDataSource();
    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = "";
    reportFrequencey: any;
    colorValues: any = "total"
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;
    groupID: any;
    unitID: any;
    groupSelected = 'all';
    unitSelected = 'all';
    department: any = "own";
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
    isExpanded: boolean = true;
    isPopoverVisible = false;
    tooltipMessage: any;
    isInRange: boolean = false;
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });
    isToolTip: any;
    filteredStatus: any;
    selectedRowFrequency: any;
    private readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    ReportKRIValidationtxt = `Only KRI's marked as measured will be reported (Button will be enabled with either "Total or Measured" filter being selected)`;

    constructor(
        public kriService: KriService,
        public utils: UtilsService,
        public router: Router,
        public DashboardService: DashboardService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any,
    ) {
        kriService.gotMeasurements.subscribe(value => {
            if (value) {
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
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
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
                        this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
                    }
                }
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator
                }, 100);
            }
        });
    }

    ngOnInit(): void {
        this.kriService.getKriMeasurementsNewData(1);
        this.submited = false;
        if (this.DashboardService.KeyRiskIndicatorScore.length > 0) {
            this.model = this.DashboardService.KeyRiskIndicatorScore[0]
            this.DashboardService.KeyRiskIndicatorScore = []
            if (this.model) {
                this.applyFilter("", this.model)
            }
        }
    }

    showPrevData() {
        this.showPrevDataDetails = true;
    }

    changedRiskCategoryStatus(event: any) {
        this.reportWithUnit = false;
        this.groupSelected = 'all';
        this.unitSelected = 'all';
        this.department = "own";
        this.kriService.getKriMeasurementsNewData(1);
        var data = {
            value: 'own'
        };
        setTimeout(() => {
            this.filterGroups(data);
        }, 1000);
    }

    isUnitCount(): boolean {
        return this.kriService.unitCount == 1 || this.reportWithUnit;
    }

    dataNotMeasured(): boolean {
        var value = false
        this.completedata.forEach((kri: any) => {
            if (kri.StatusName == "Not Measured" || kri.StatusName == "Rejected") {
                if (value == false) {
                    value = true;
                }
            }
        });
        return value;
    }

    dataRejected(): boolean {
        var value = false
        this.dataSource.data.forEach((kri: any) => {
            if (kri.StatusName == "Rejected") {
                if (value == false) {
                    value = true;
                }
            }
        });
        return value;
    }

    isReportedCount(): boolean {
        var value = false
        this.completedata.forEach((kri: any) => {
            if (kri.StatusName == "Not Measured" || kri.StatusName == "Measured") {
                if (value == false) {
                    value = true;
                }
            }
        });
        return !value;
    }

    remarksNotNull(list: any, remarks: any): any {
        let v = list.length == remarks.length
        this.remarksFilled = v
        return !v
    }

    getFilterOfTHreshouldValues(): any {
        let myList = []
        let myRemark = []
        this.dataSource.data
        let service = this.dataSource.data
        for (let i in service) {
            if (service[i].ThresholdValue < 5 && service[i].StatusName === 'Measured') {
                myList.push(service[i])
            }
        }
        let remarks = myList.filter(d => (d.Remarks !== null))
        return { 'data': this.dataSource.data.length, 'myList': myList.length, 'remark': this.remarksNotNull(myList, remarks) }
    }

    applyFilter(event: any = "", KRICode = "") {
        if (event) {
            this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase()
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage()
            }
            return
        }
        if (KRICode) {
            this.dataSource.filter = KRICode.trim().toLocaleLowerCase()
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage()
            }
        }
    }

    filterGroups(data: any): any {
        this.unitSelected = '';
        this.groupID = data.value;
        this.groupID = this.groupID > 0 ? this.groupID : "all"
        this.unitID = this.unitID > 0 ? this.unitID : "all"
        this.kriService.selectedMeasurementRowGroup = data.value;
        if (this.selectedRowFrequency && this.selectedRowFrequency !== 'total') {
            if (this.groupID == 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
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
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
                }
                if (this.selectedRowFrequency) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.MeasurementFrequency === this.selectedRowFrequency);
                }
            }
        } else {
            if (this.groupID == 'all') {
                this.dataSource.data = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
                }
                this.completedata = JSON.parse(JSON.stringify(this.kriService?.kriMeasurments));
            } else if (Number(this.groupID) > 0) {
                this.dataSource.data = this.kriService?.kriMeasurments.filter((nn: any) => nn.GroupID == Number(this.groupID));
                this.completedata = JSON.parse(JSON.stringify(this.dataSource.data));
                if (this.filteredStatus) {
                    this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
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
    }

    filterUnits(data: any) {
        this.unitID = data.value;
        this.groupID = this.groupID > 0 ? this.groupID : "all"
        this.unitID = this.unitID > 0 ? this.unitID : "all"
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
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
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
                this.dataSource.data = this.dataSource.data.filter((nn: any) => nn.StatusName === this.filteredStatus);
            }
        }
    }

    getUnitsNames(data: any): any {
        let list: any = []
        for (let i in data) {
            if (data[i].GroupID == this.groupID) {
                list.push(data[i])
            }
        }
        return list
    }

    colorValue(data: any): any {
        return this.colorValues == data
    }

    colorValueTotal(data: any, freq: any) {
        return this.colorValues == data + freq
    }

    colorValueData(frequency: any, data: any): any {
        return this.colorValues == data + frequency
    }

    textColor(): any {
        return {
            'color': 'black',
            'font-weight': '500'
        }
    }

    colorCode(): any {
        return {
            'background-image': 'linear-gradient(to right, rgba(139, 233, 243, 0.947),rgba(244, 245, 154, 0.984))',
            'color': 'black',
            'font-weight': '500',
            ' border': '1px solid black',
        }
    }

    onChangeMeasurement(row: any): void {
        row.ThresholdValue = "";
        row.ColorCode = "#FFFFFF";
        if (row.Measurement > 100)
            row.Measurement = 100
        if (row.Measurement != null && row.Measurement >= 0) {
            switch (row.Target) {
                case 100:
                    if (row.Measurement == row.ThresholdValue5) row.ThresholdValue = "5"
                    else if (row.Measurement >= row.ThresholdValue4) row.ThresholdValue = "4"
                    else if (row.Measurement >= row.ThresholdValue3) row.ThresholdValue = "3"
                    else if (row.Measurement >= row.ThresholdValue2) row.ThresholdValue = "2"
                    else row.ThresholdValue = "1"
                    break
                case 0:
                    if (row.Measurement == row.ThresholdValue5) row.ThresholdValue = "5"
                    else if (row.Measurement <= row.ThresholdValue4) row.ThresholdValue = "4"
                    else if (row.Measurement <= row.ThresholdValue3) row.ThresholdValue = "3"
                    else if (row.Measurement <= row.ThresholdValue2) row.ThresholdValue = "2"
                    else row.ThresholdValue = "1"
                    break
            }
            let kris = this.kriService.kriThresholds.filter((kri: any) => kri.Value == row.ThresholdValue)
            if (kris.length > 0)
                row.ColorCode = kris[0].ColorCode
        }
    }

    isLastMonth(): boolean {
        // const now = new Date();
        // const bufferRaw = this.kriService?.BufferDays;
        // const gracePeriodDays = Number.isFinite(bufferRaw) ? Number(bufferRaw) : 0;
        // const freq = (this.kriService?.kriMeasurmentsReportingFrequncy || "").trim();
        // console.log('isLastMonth-freq::', freq);
        // console.log('isLastMonth-gracePeriodDays::', gracePeriodDays);
        // let periodStart: Date | null = null;
        // let periodEnd: Date | null = null;
        // switch (freq) {
        //     case "Monthly": {
        //         // Last completed month: start = first day of previous month, end = last day of previous month
        //         const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        //         periodStart = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1);
        //         periodEnd = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0); // last day prev month
        //         break;
        //     }
        //     case "Quarterly": {
        //         // Determine which quarter the previous completed month belonged to
        //         // Find current month index (0-11). We want previous quarter (the quarter that ended before the current month).
        //         // Compute previous-month date, then quarter containing that month.
        //         const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        //         const monthIdx = prevMonth.getMonth();
        //         const quarter = Math.floor(monthIdx / 3); // 0..3
        //         const quarterStartMonth = quarter * 3;
        //         periodStart = new Date(prevMonth.getFullYear(), quarterStartMonth, 1);
        //         periodEnd = new Date(prevMonth.getFullYear(), quarterStartMonth + 3, 0); // last day of quarter
        //         break;
        //     }
        //     case "Semi Annual": {
        //         // Two halves: Jan-Jun, Jul-Dec. Use the half that contains previous month.
        //         const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        //         const m = prevMonth.getMonth();
        //         const halfStartMonth = m < 6 ? 0 : 6; // 0 or 6
        //         periodStart = new Date(prevMonth.getFullYear(), halfStartMonth, 1);
        //         periodEnd = new Date(prevMonth.getFullYear(), halfStartMonth + 6, 0); // last day of half
        //         break;
        //     }
        //     case "Annually": {
        //         // Previous calendar year
        //         const prevYear = now.getFullYear() - 1;
        //         periodStart = new Date(prevYear, 0, 1); // Jan 1 last year
        //         periodEnd = new Date(prevYear, 12, 0);   // Dec 31 last year
        //         break;
        //     }
        //     default:
        //         return false;
        // }
        // if (!periodStart || !periodEnd) return false;
        // // Compute grace end: periodEnd + gracePeriodDays, but set to end-of-day
        // const graceEnd = new Date(periodEnd);
        // graceEnd.setDate(graceEnd.getDate() + gracePeriodDays);
        // graceEnd.setHours(23, 59, 59, 999); // inclusive through the end of that day
        // // Normalize now to current timestamp (no change, but explicit)
        // const nowTs = now.getTime();
        // // Return true only if now is within [periodStart (00:00:00.000), graceEnd (23:59:59.999)]
        // const startOfPeriod = new Date(periodStart);
        // startOfPeriod.setHours(0, 0, 0, 0);
        // console.log("nowTs (Local):", new Date(nowTs).toLocaleString());
        // console.log("startOfPeriod (Local):", new Date(startOfPeriod).toLocaleString());
        // console.log("graceEnd (Local):", new Date(graceEnd).toLocaleString());
        // console.log("isLastMonth", nowTs >= startOfPeriod.getTime() && nowTs <= graceEnd.getTime());
        // console.log("this.filteredStatus:", this.filteredStatus);
        // console.log("this.colorValues:", this.colorValues);
        // return nowTs >= startOfPeriod.getTime() && nowTs <= graceEnd.getTime();
        return true;
    }

    saveKRIs(): void {
        const data: any[] = []
        this.dataSource.data.forEach((metric: any) => {
            if (metric?.Measurement != metric?.MeasurementOld
                || metric?.Remarks != metric?.RemarksOld
                || (metric?.evidences && metric?.evidences.length > 0 ? (metric?.evidences.map((ele: any) => ele.EvidenceID)).join() : '') != metric?.evidencesOld) {
                const FrequencyID = metric?.MeasurementFrequencyID;
                const reportFrequencyData = this.kriService.reportFrequencyData;
                const matchedFrequency = reportFrequencyData?.find(
                    (item: any) => item.FrequencyID === FrequencyID
                );

                // console.log('saveKRIs-matchedFrequency::', matchedFrequency);
                const periodType = matchedFrequency?.Period;
                if (
                    metric?.Measurement != null &&
                    metric.Measurement.toString().trim() !== ''
                ) {
                    data.push({
                        metricID: metric.MetricID,
                        period: periodType,
                        value: metric.Measurement,
                        remark: metric.Remarks,
                        IsReported: null,
                        EvidenceID: metric?.evidences?.length
                            ? metric.evidences.map((ele: any) => ele.EvidenceID).join(',')
                            : ''
                    });
                }
            }
        });
        this.submited = true;
        this.kriService.setKriMetricsScoring(data, this.submited);
    }

    historical(): void {
        this.router.navigate(['kri-historical']);
    }

    reportKRIs(): void {
        const data1 = {
            "metricIDs": this.dataSource.data.filter((metric: any) => metric.StatusName == "Measured").map((metric: any) => metric.MetricID).toString()
        }
        this.submited = true;
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: "Confirm Reporting",
                content: "Are you sure you want to Report the KRI's?"
            }
        });
        confirm.afterClosed().subscribe(result => {
            if (result) {
                this.kriService.setKriMetricsReport(data1, this.submited);
                return;
            }
        })
    }

    cancel(): void {
        this.dataSource.data = JSON.parse(JSON.stringify(this.kriService.kriMeasurments));
        this.dataSource.data = [...this.dataSource.data];
    }

    total(): any {
        let service;
        service = this.completedata;
        let data = 0
        for (let i in service) {
            data++
        }
        return data
    }

    measuredData(mdata: any): any {
        let service;
        service = this.completedata;
        let data = 0
        if (mdata != '') {
            for (let i in service) {
                if (service[i].StatusName === mdata) {
                    data++
                }
            }
        } else {
            data = service.length;
        }
        return data
    }

    reportedStatus(val: any, data: any): any {
        this.filteredStatus = data;
        this.model = ''
        this.dataSource.filter = " "
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        if (val == 'total') {
            for (let i in service) {
                let status = service[i].StatusName
                if (status === data) {
                    listData.push(service[i])
                    setTimeout(() => this.dataSource.paginator = this.paginator);
                }
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
        } else {
            for (let i in service) {
                let status = service[i].StatusName
                if (status === data && service[i].MeasurementFrequency === val) {
                    listData.push(service[i])
                    setTimeout(() => this.dataSource.paginator = this.paginator);
                }
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
        }
        this.dataSource.data = listData
        this.colorValues = data + val;
        this.selectedRow = data + val;
        this.selectedRowFrequency = val;
    }

    countReportStatus(measurementFrequency: string, status: any): any {
        let reportStatusCount;
        if (measurementFrequency === 'total') {
            reportStatusCount = this.completedata?.filter((data: any) => data.StatusName === status);
        } else {
            reportStatusCount = this.completedata?.filter((data: any) => data.MeasurementFrequency === measurementFrequency && data.StatusName === status);
        }
        return reportStatusCount?.length;
    }

    filterMeasuredData(frequency: any, frequencyName: any): any {
        let service = this.dataSource.filteredData
        let data = 0
        for (let i in service) {
            if (service[i].StatusName == frequencyName && service[i].MeasurementFrequency == frequency) {
                data++
            }
        }
        return data
    }

    countFrequency(frequency: any): any {
        let service = this.completedata;
        let data = 0
        for (let i in service) {
            if (service[i].MeasurementFrequency == frequency) {
                data++
            }
        }
        return data
    }

    totalData(): any {
        this.selectedRowFrequency = ''
        let listData: any = []
        this.filteredStatus = ""
        let service = this.completedata;
        for (let i in service) {
            listData.push(service[i])
            setTimeout(() => this.dataSource.paginator = this.paginator);
        }
        this.dataSource.data = listData
        this.colorValues = "total"
    }

    getRemarkData(data: any): any {
        let dbt = 0
        let bol = true
        if (data != null) {
            for (let i of data) {
                dbt += 1
            }
        }
        if (data == null || dbt <= 0) {
            bol = true
        } else {
            bol = false
        }
        return bol
    }

    measured(data: any): any {
        this.filteredStatus = data
        if (data != '') {
            this.model = ''
            this.dataSource.filter = " "
            if (this.dataSource.paginator)
                this.dataSource.paginator.firstPage()
            let listData: any = []
            let service = this.completedata;
            for (let i in service) {
                if (service[i].StatusName === data) {
                    listData.push(service[i])
                    setTimeout(() => this.dataSource.paginator = this.paginator);
                }
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
            this.dataSource.data = listData
            this.colorValues = data;
            this.selectedRow = data;
        }
        else {
            this.dataSource.data = this.completedata;
            this.colorValues = data;
            this.selectedRow = data;
        }
    }

    measuredFrequency(frequency: any, data: any) {
        this.filteredStatus = data;
        this.model = '';
        this.dataSource.filter = " ";
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            if (service[i].StatusName === data && service[i].MeasurementFrequency === frequency) {
                listData.push(service[i])
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
            setTimeout(() => this.dataSource.paginator = this.paginator);
        }
        this.dataSource.data = listData;
        this.colorValues = data + frequency
        this.selectedRow = data + frequency
        this.selectedRowFrequency = frequency;
    }

    measurementFrequencyData(data: any) {
        this.selectedRowFrequency = data;
        this.kriService.selectedMeasurementRowFrequency = data;
        this.model = '';
        this.dataSource.filter = " ";
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            if (service[i].MeasurementFrequency === data) {
                listData.push(service[i])
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
            setTimeout(() => this.dataSource.paginator = this.paginator);
        }
        this.dataSource.data = listData
        this.colorValues = data;
        this.selectedRow = data;
        this.filteredStatus = '';
    }

    getOrderFrequency(data: any) {
        let list: any = []
        let n = 7
        for (let i of data) {
            if (i.MeasurementFrequency == "Monthly") {
                i.idx = 1
                list.push(i)
            } else if (i.MeasurementFrequency == "Quartely") {
                i.idx = 2
                list.push(i)
            } else if (i.MeasurementFrequency == "Semi Annual") {
                i.idx = 3
                list.push(i)
            }
            else if (i.MeasurementFrequency == "Annually") {
                i.idx = 4
                list.push(i)
            }
            else if (i.MeasurementFrequency == "Adhoc") {
                i.idx = 5
                list.push(i)
            }
            else if (i.MeasurementFrequency == "Weekly") {
                i.idx = 6
                list.push(i)
            } else if (i.measurementFrequency == "Leap Year") {
                i.idx = 7
                list.push(i)
            } else {
                i.idx = n + 1
                list.push(i)
            }
        }
        return list.sort(function (a: any, b: any) {
            return a.idx - b.idx
        })
    }

    measurementFrequencyTotal(): any {
        let listMeasurementFrequency: any = []
        let measurementFrequencyData: any = []
        let service;
        service = this.completedata;
        for (let i in service) {
            measurementFrequencyData.push(service[i].MeasurementFrequency)
        }
        let setMeasurementFrequency = new Set(measurementFrequencyData)
        for (let i of setMeasurementFrequency) {
            let obj = { "MeasurementFrequency": i, "Measured": this.filterMeasuredData(i, "Measured"), "NotMeasured": this.filterMeasuredData(i, "Not Measured"), "Count": this.countFrequency(i) }
            listMeasurementFrequency.push(obj)
        }
        return this.getOrderFrequency(listMeasurementFrequency)
    }

    measurementFrequency(): any {
        let listMeasurementFrequency: any = []
        let measurementFrequencyData: any = []
        let service;
        service = this.completedata;
        for (let i in service) {
            measurementFrequencyData.push(service[i].MeasurementFrequency)
        }
        let setMeasurementFrequency = new Set(measurementFrequencyData)
        for (let i of setMeasurementFrequency) {
            let obj = { "MeasurementFrequency": i, "Measured": this.filterMeasuredData(i, "Measured"), "NotMeasured": this.filterMeasuredData(i, "Not Measured"), "Count": this.countFrequency(i) }
            listMeasurementFrequency.push(obj)
        }
        return this.getOrderFrequency(listMeasurementFrequency)
    }

    notMeasuredData(): any {
        let service = this.kriService?.kriMeasurments
        let data = 0
        for (let i in service) {
            if (service[i].StatusName === "Not Measured") {
                data++
            }
        }
        return data
    }

    measuredFrequencyCount(dat: any): any {
        let service;
        service = this.completedata;
        let data = 0
        for (let i in service) {
            if (service[i].MeasurementFrequency === dat) {
                data++
            }
        }
        return data
    }

    MeasuredCount(dat: any, measured: any): any {
        let service = this.completedata;
        let data = 0
        for (let i in service) {
            if (service[i].MeasurementFrequency === dat && service[i].StatusName === measured) {
                data++
            }
        }
        return data
    }

    exportAsExcel() {
        var filteredData = this.dataSource.filteredData.map(function (item: any, index: any) {
            delete item.UnitID,
                delete item.MetricID,
                delete item.KriTypeID,
                delete item.GroupID,
                delete item.MeasurementFrequencyID
            var obj = {
                'Sl No': index + 1,
                "KRI Code": item.KriCode,
                "Group Name": item.GroupName,
                "Unit Name": item.Unit_Name,
                Indicator: item.Indicator,
                "Measurement Frequency": item.MeasurementFrequency,
                Target: item.Target ? item.Target.toString() + '%' : '0%',
                "KRI Type": item.KriType,
                "Threshold Value 1": item.ThresholdValue1 >= 0 ? (item.ThresholdValue1 <= item.ThresholdValue2 ? ">=" : "<=") + item.ThresholdValue1.toString() + '%' : '',
                'Threshold Value 2': item.ThresholdValue2 ? (item.ThresholdValue2 <= item.ThresholdValue3 ? ">=" : "<=") + item.ThresholdValue2.toString() + '%' : '',
                'Threshold Value 3': item.ThresholdValue3 ? (item.ThresholdValue3 <= item.ThresholdValue4 ? ">=" : "<=") + item.ThresholdValue3.toString() + '%' : '',
                'Threshold Value 4': item.ThresholdValue4 ? (item.ThresholdValue4 <= item.ThresholdValue5 ? ">=" : "<=") + item.ThresholdValue4.toString() + '%' : '',
                'Threshold Value 5': item.ThresholdValue5 ? item.ThresholdValue5.toString() + '%' : '0%',
                Period: item.Period,
                Date: item.Date ? new Date(item.Date).toLocaleDateString('en-US', {
                    month: '2-digit', day: '2-digit', year: 'numeric'
                }) : '',
                Measurement: item.Measurement != null ? item.Measurement.toString()?.length > 0 ? item.Measurement.toString() + '%' : '' : '',
                "KRI Value": item.ThresholdValue,
                "ColorCode": item.ColorCode,
                Remarks: item.Remarks,
                'Status': item.StatusName,
                'Checker Comments': item.CommentBody,
            }
            return obj;
        });
        this.kriService.exportAsExcelFile(filteredData, 'KRI_Measurement_Report');
    }

    isDataModified(): boolean {
        return this.dataSource.data.some((kri: any) => kri?.Measurement != kri?.MeasurementOld || kri?.Remarks != kri?.RemarksOld);
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
        if (row && row.PreviousScoring && row.PreviousScoring.length > 0 && row.PreviousScoring[0].PreviousData) {
            return row.PreviousScoring[0].PreviousData.sort((a: any, b: any) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        } else {
            return null;
        }
    }

    showComments(element: any): void {
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
        }
        );
    }

    showFrequency(): MatDialogRef<AlertComponent> {
        let frequency = `
            <p><strong>Reporting Frequency Monthly:</strong> Button will be enabled once all KRIs are reported.</p>
            <p><strong>Reporting Frequency Quarterly:</strong> Button will be enabled in the last month of the quarter once all KRIs are reported.</p>
            <p><strong>Reporting Frequency Semi-Annually:</strong> Button will be enabled in the last month of the semi-annual period once all KRIs are reported.</p>
            <p><strong>Reporting Frequency Annually:</strong> Button will be enabled in the last month of the annual period once all KRIs are reported.</p>
        `;
        const dialogRef = this.dialog.open(AlertComponent, {
            width: '462px',
            maxWidth: '60vw',
            minHeight: '27vh',
            maxHeight: '60vh',
            panelClass: 'dark',
            data: {
                title: 'More Information',
                content: frequency
            }
        });
        return dialogRef;
    }

    toggleMenu() {
        this.isExpanded = !this.isExpanded;
    }

    togglePopover() {
        this.isPopoverVisible = !this.isPopoverVisible;
    }

    isMeasurementInRange(val: any): boolean {
        let inRange = false;
        let rawValue = val.Measurement;
        if (rawValue === null || rawValue === undefined || rawValue === '') {
            val.remarkdisable = true;
            val.Measurement = null;
            return false;
        }
        const value = Number(rawValue);
        if (Number.isNaN(value)) {
            val.remarkdisable = true;
            val.Measurement = null;
            return false;
        }
        const t1 = val?.ThresholdValue1 ?? null;
        const t5 = val?.ThresholdValue5 ?? null;
        if (t1 === null || t5 === null || t1 === undefined || t5 === undefined) {
            val.remarkdisable = true;
            val.Measurement = null;
            return false;
        }
        const thresh1 = Number(t1);
        const thresh5 = Number(t5);
        if (Number.isNaN(thresh1) || Number.isNaN(thresh5)) {
            val.remarkdisable = true;
            val.Measurement = null;
            return false;
        }
        const minRange = Math.min(thresh1, thresh5);
        const maxRange = Math.max(thresh1, thresh5);
        inRange = value >= minRange && value <= maxRange;
        if (inRange) {
            val.remarkdisable = false;
            return true;
        }
        this.popupInfo(minRange, maxRange).afterClosed().pipe(take(1)).subscribe(() => {
            val.remarkdisable = true;
            val.Measurement = null;
        });
        return false;
    }

    popupInfo(Value1: any, Value5: any): MatDialogRef<AlertComponent> {
        const dialogRef = this.dialog.open(AlertComponent, {
            width: '250px',
            panelClass: 'dark',
            data: {
                title: '',
                content: `Please select the measurement value in the range of ${Value1} - ${Value5}`
            }
        });
        return dialogRef;
    }

    isReportKRI() {
        return (
            this.isLastMonth() &&
            !this.utils.isReadOnlyUserORM() &&
            this.isUnitCount() &&
            this.colorValues !== 'total' &&
            this.filteredStatus !== 'Measured' &&
            this.filteredStatus !== ''
        );
    }

    resetFilter() {
        this.groupSelected = "all";
        this.dataSource.filter = "";
        this.unitSelected = "all";
        this.model = ""
        this.colorValues = "total"
        this.filteredStatus = "";
        this.filterGroups(this.groupSelected)
        this.filterUnits(this.unitSelected)
        this.kriService.getKriMeasurementsNewData(1);
        this.selectedRowFrequency = ''
    }
}