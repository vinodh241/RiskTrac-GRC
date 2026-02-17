import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ValidExtension } from 'src/app/core-shared/file-upload/evidence-files/evidence-file.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
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
    selector: 'app-kri-scoring',
    templateUrl: './kri-scoring.component.html',
    styleUrls: ['./kri-scoring.component.scss']
})
export class KriScoringComponent implements OnInit {
    uploadFilename: any;
    uploadFile: FormData = new FormData();
    filename: any = '';
    invalidfile: boolean = false;
    invalidfilesize = false;
    uploaderror: string = "";
    selectedRow: any;
    displayedColumns: string[] = [
        'kricode', 'indicator', 'Measurmentfrequency', 'Target', 'Kritype', 'tvalue-1', 'tvalue-2', 'tvalue-3',
        'tvalue-4', 'tvalue-5', 'period', 'date', 'measurement', 'krivalue', 'Remarks', 'status',
        'upload', 'action'
    ];

    dataSource: MatTableDataSource<KriScoring> = new MatTableDataSource();
    reportFrequencey: any;
    colorValues: any = "total"
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;
    groupID: any;
    unitID: any;
    groupSelected = 'all';
    unitSelected = 'all';
    department:any = "all";
    reportWithUnit: boolean = false;
    submited:any = false;
    remarksFilled: boolean = false
    completedata: any;
    model: any = ''

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    constructor(
        public kriService: KriService,
        public utils: UtilsService,
        public router: Router,
        public DashboardService: DashboardService
    ) {
        kriService.gotMeasurements.subscribe(value => {
            if (value) {
                if (this.groupID && this.unitID) {
                    let list: any = [];
                    for (let i of this.kriService?.kriMeasurments) {
                        if (i.GroupID == this.groupID && i.UnitID == this.unitID) {
                            list.push(i)
                        }
                    }
                    this.dataSource.data = list;

                    this.completedata = list;
                }
                else if (this.groupID) {
                    let list: any = [];
                    for (let i of this.kriService?.kriMeasurments) {
                        if (i.GroupID == this.groupID) {
                            list.push(i)
                        }
                    }
                    this.dataSource.data = list
                    this.completedata = list;
                }
                else {
                    this.dataSource.data = JSON.parse(JSON.stringify(kriService.kriMeasurments));
                    this.completedata = kriService.kriMeasurments;
                }
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator
                    this.colorValues = "total"
                }, 100);
            }
        });
    }

    ngOnInit(): void {

        if(this.submited == true){
            this.kriService.getKriMeasurementsNewData(1);
            this.submited = false;

        }else{
            this.kriService.getKriMeasurements();
        }
        if (this.DashboardService.KeyRiskIndicatorScore.length > 0) {
            this.model = this.DashboardService.KeyRiskIndicatorScore[0]
            this.DashboardService.KeyRiskIndicatorScore = []
            if (this.model) {
                this.applyFilter("", this.model)
            }
        }

    }
    changedRiskCategoryStatus(event:any){
        this.reportWithUnit = false;
        this.groupSelected = 'all';
        this.unitSelected = 'all';
        if(event.checked == true){
            this.department="own";
            this.kriService.getKriMeasurementsNewData(1);
        }else{
            this.department="all";
            this.kriService.getKriMeasurementsNewData(null);
        }

        var data = {
            value: 'all'
        };

        setTimeout(() =>{
            this.filterGroups(data);
        },1000);
    }

    isUnitCount(): boolean{
        return this.kriService.unitCount == 1 || this.reportWithUnit;
    }
    dataNotMeasured(): boolean{
        var value = false
        this.dataSource.data.forEach((kri: any) => {
            if(kri.StatusName == "Not Measured"){
                if(value == false){
                    value = true;
                }
            }
        });
        return value;
    }

    isReportedCount(): boolean{
        var value = false
        this.dataSource.data.forEach((kri: any) => {
            if(kri.StatusName == "Not Measured" || kri.StatusName == "Measured"){
                if(value == false){
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
        if (data.value == 'all') {
            this.dataSource.data = this.kriService?.kriMeasurments;
            this.completedata = this.kriService?.kriMeasurments;
            setTimeout(() => this.dataSource.paginator = this.paginator );
        }
        else {
            let list: any = []
            let service = this.kriService?.kriMeasurments
            this.groupID = data.value
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == data.value) {
                    list.push(i)
                    setTimeout(() => this.dataSource.paginator = this.paginator );
                }
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            this.dataSource.data = list
            this.completedata = list;
        }

        const key = 'UnitName';
        var unitCount;
        const arrayUniqueByKey = [...new Map(this.dataSource.data.map((item:any) =>
        [item[key], item])).values()];
        unitCount = arrayUniqueByKey?.length;
        if(unitCount==1){
            this.reportWithUnit = true;
        }else{
            this.reportWithUnit = false;
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

    filterUnits(data: any) {
        if (data.value == 'all') {
            let list: any = []
            let service = this.kriService?.kriMeasurments
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == this.groupID) {
                    list.push(i)
                    setTimeout(() => this.dataSource.paginator = this.paginator );
                }
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            this.dataSource.data = list;
            this.completedata = list;
        }
        else {
            let list: any = []
            let service = this.kriService?.kriMeasurments
            this.unitID = data.value;
            for (let i of this.kriService?.kriMeasurments) {
                if (i.GroupID == this.groupID && i.UnitID == this.unitID) {
                    list.push(i)
                    setTimeout(() => this.dataSource.paginator = this.paginator );
                }
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            this.dataSource.data = list;
            this.reportWithUnit = true;
            this.completedata = list;
        }
    }

    colorValue(data: any): any {
        return this.colorValues == data
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
        let date = new Date()
        let isLast = false
        switch (this.kriService.kriMeasurmentsReportingFrequncy) {
            case "Monthly":
                isLast = true
                break
            case "Quarterly":
                isLast = [2, 5, 8, 11].includes(date.getMonth())
                break
            case "Semi Annual":
                isLast = [5, 11].includes(date.getMonth())
                break
            case "Annually":
                isLast = [11].includes(date.getMonth())
                break
        }
        return isLast
    }

    getQuarter() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        var year = date.getFullYear();
        switch(month) {
            case 1:
                finaltype =  "Jan-Mar " + year;
                break;
            case 2:
                finaltype =  "Apr-Jun " + year;
                break;
            case 3:
                finaltype =  "Jul-Sep " + year
                break;
            case 4:
                finaltype =  "Oct-Dec " + year
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
          switch(month) {
              case 1:
                  finaltype =  "Jan-Jun " + year;
                  break;
              case 2:
                  finaltype =  "Jul-Dec " + year;
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
            switch(month) {
                case 1:
                    finaltype =  "Jan " + year;
                    break;
                case 2:
                    finaltype =  "Feb " + year;
                    break;
                case 3:
                    finaltype =  "Mar " + year;
                    break;
                case 4:
                    finaltype =  "Apr " + year;
                    break;
                case 5:
                    finaltype =  "May " + year;
                    break;
                case 6:
                    finaltype =  "Jun " + year;
                    break;
                case 7:
                    finaltype =  "Jul " + year;
                    break;
                case 8:
                    finaltype =  "Aug " + year;
                    break;
                case 9:
                    finaltype =  "Sep " + year;
                    break;
                case 10:
                    finaltype =  "Oct " + year;
                    break;
                case 11:
                    finaltype =  "Nov " + year;
                    break;
                case 12:
                    finaltype =  "Dec " + year;
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
        switch(month) {
            case 1:
                finaltype =  "Jan-Dec " + year;
                break;
            default:
                break;
        }
        return finaltype;
      }

    saveKRIs(): void {
        const data: any[] = []
        this.dataSource.data.forEach((metric: any) => {
            if (metric?.Measurement != metric?.MeasurementOld
                || metric?.Remarks != metric?.RemarksOld
                || (metric?.evidences && metric?.evidences.length > 0 ? (metric?.evidences.map((ele: any) => ele.EvidenceID)).join() : '') != metric?.evidencesOld) {
                    var periodType;
                    if(metric.MeasurementFrequency == 'Monthly'){
                        periodType = this.getMonth();
                    }else if(metric.MeasurementFrequency == 'Quarterly'){
                        periodType = this.getQuarter();
                    }else if(metric.MeasurementFrequency == 'Semi Annual'){
                        periodType = this.getSemiAnnual();
                    }else{
                        periodType = this.getAnnual();
                    }
                    data.push({
                        "metricID": metric.MetricID,
                        "period": periodType,
                        "value": metric.Measurement,
                        "remark": metric.Remarks,
                        "IsReported": null,
                        "EvidenceID": metric?.evidences && metric?.evidences.length > 0 ? (metric?.evidences.map((ele: any) => ele.EvidenceID)).join() : ''
                    })
            }
        });
        this.submited = true;
        this.kriService.setKriMetricsScoring(data,this.submited);
    }

    historical(): void {
        this.router.navigate(['kri-historical']);
    }

    reportKRIs(): void {
        const data = {
            "metricIDs": this.dataSource.data.filter((metric: any) => metric.StatusName == "Measured").map((metric: any) => metric.MetricID).toString()
        }
        this.submited = true;
        this.kriService.setKriMetricsReport(data,this.submited);
    }

    cancel(): void {
        this.dataSource.data = JSON.parse(JSON.stringify(this.kriService.kriMeasurments));
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
        let data = 0
        for (let i in service) {
            data++
        }
        return data
    }

    measuredData(mdata: any): any {
        let service;
        // if(this.dataSource.data.length > 0){
            service = this.completedata;
        // }else{
        //     service = this.kriService?.kriMeasurments
        // }
        // let service = this.kriService.kriMeasurments
        // let service = this.dataSource.data
        let data = 0
        for (let i in service) {
            if (service[i].StatusName === mdata) {
                data++
            }
        }
        return data
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
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            listData.push(service[i])
            setTimeout(() => this.dataSource.paginator = this.paginator );
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
        this.model = ''
        this.dataSource.filter = " "
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            if (service[i].StatusName === data) {
                listData.push(service[i])
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            setTimeout(() => this.dataSource.paginator = this.paginator );
        }
        this.dataSource.data = listData
        // this.dataSource.data.filter((rec:any) => rec.StatusName == data)
        this.colorValues = data

    }

    measuredFrequency(frequency: any, data: any) {
        this.model = ''
        this.dataSource.filter = " "
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            console.log(service[i])
            if (service[i].StatusName === data && service[i].MeasurementFrequency === frequency) {
                listData.push(service[i])
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            setTimeout(() => this.dataSource.paginator = this.paginator );
        }
        this.dataSource.data = listData
        this.colorValues = data + frequency
    }

    measurementFrequencyData(data: any) {
        console.log(data)
        this.model = ''
        this.dataSource.filter = " "
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        for (let i in service) {
            if (service[i].MeasurementFrequency === data) {
                listData.push(service[i])
                setTimeout(() => this.dataSource.paginator = this.paginator );
            }
            setTimeout(() => this.dataSource.paginator = this.paginator );
        }
        this.dataSource.data = listData
        this.colorValues = data
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
        // if(this.dataSource.data.length > 0){
            service = this.completedata;
        // }else{
            // service = this.kriService?.kriMeasurments
        // }
        // let service = this.kriService?.kriMeasurments
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
        // if(this.dataSource.data.length > 0){
            service = this.completedata;
        // }else{
            // service = this.kriService?.kriMeasurments
        // }
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
        // MeasurementFrequency
        // let service = this.kriService?.kriMeasurments
        let service;
        // if(this.dataSource.data.length > 0){
            service = this.completedata;
        // }else{
            // service = this.kriService?.kriMeasurments
        // }
        // let service = this.dataSource.data;
        let data = 0
        for (let i in service) {
            if (service[i].MeasurementFrequency === dat.MeasurementFrequency) {
                data++
            }
        }
        return data

    }
    MeasuredCount(dat: any, measured: any): any {
        // let service;
        // if(this.dataSource.data.length > 0){
        //     service = this.dataSource.data
        // }else{
            // service = this.kriService?.kriMeasurments
        // }
        let service = this.completedata;
        let data = 0
        for (let i in service) {
            if (service[i].MeasurementFrequency === dat.MeasurementFrequency && service[i].StatusName === measured) {
                data++
            }
        }
        return data
    }



    exportAsExcel() {
        // console.log('this.dataSource.filteredData: ',this.dataSource.filteredData)
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
                // "Threshold Value 1": item.ThresholdValue1 ? (item.Target == 0 ? ">" : "<") + item.ThresholdValue1.toString() + '%' : '',
                "Threshold Value 1": item.ThresholdValue1 >= 0 ? (item.ThresholdValue1 <= item.ThresholdValue2 ? ">=" : "<=") + item.ThresholdValue1.toString() + '%' : '',
                "Threshold Value 2": item.ThresholdValue2 ? (item.Target == 0 ? "<=" : ">=") + item.ThresholdValue2.toString() + '%' : '',
                "Threshold Value 3": item.ThresholdValue3 ? (item.Target == 0 ? "<=" : ">=") + item.ThresholdValue3.toString() + '%' : '',
                "Threshold Value 4": item.ThresholdValue4 ? (item.Target == 0 ? "<=" : ">=") + item.ThresholdValue4.toString() + '%' : '',
                "Threshold Value 5": item.ThresholdValue5 ? item.ThresholdValue5.toString() + '%' : '0%',
                Period: item.Period,
                Date: item.Date ? new Date(item.Date).toLocaleDateString('en-US', {
                    month: '2-digit', day: '2-digit', year: 'numeric'
                }) : '',
                Measurement: item.Measurement != null ? item.Measurement.toString()?.length > 0 ? item.Measurement.toString() + '%' : '' : '',
                "KRI Value": item.ThresholdValue,
                "Color Code": item.ColorCode,
                Remarks: item.Remarks,
                'Status': item.StatusName,
                //'Previous Scoring': item.PreviousScoring

            }
            // console.log("obj",obj)
            return obj;

        });
        this.kriService.exportAsExcelFile(filteredData, 'kriscore');
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
            return row.PreviousScoring[0].PreviousData.sort((a:any, b:any) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        } else {
            return null;
        }
    }

    reportedStatus(val: any, data: any): any {
        this.model = ''
        this.dataSource.filter = " "
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage()
        let listData: any = []
        let service = this.completedata;
        if (val == 'total') {
            for (let i in service) {
                if (service[i].ReportStatusName === data) {
                    listData.push(service[i])
                    setTimeout(() => this.dataSource.paginator = this.paginator);
                }
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
        } else {
            for (let i in service) {
                if (service[i].ReportStatusName === data && service[i].MeasurementFrequency === val) {
                    listData.push(service[i])
                    setTimeout(() => this.dataSource.paginator = this.paginator);
                }
                setTimeout(() => this.dataSource.paginator = this.paginator);
            }
        }

        this.dataSource.data = listData
        this.colorValues = data;
        this.selectedRow = data;
    }

    countReportStatus(measurementFrequency: string, status: any): any {
        let reportStatusCount;
        if (measurementFrequency === 'total') {
            reportStatusCount = this.completedata.filter((data: any) => data.ReportStatusName === status);

        } else {
            reportStatusCount = this.completedata.filter((data: any) => data.MeasurementFrequency === measurementFrequency && data.ReportStatusName === status);

        }

        return reportStatusCount.length;
    }

}


