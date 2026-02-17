import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { KriPopupComponent } from '../kri-popup/kri-popup.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
    selector: 'app-kri-chart',
    templateUrl: './kri-chart.component.html',
    styleUrls: ['./kri-chart.component.scss'],
})
export class KriChartComponent implements OnInit, OnChanges {
    @Input() chartValue: any;
    @Input() datacount: any;
    @Input() quarterFilter:any
    // container: any;
    options: any;
    kriCharts: any;

    measured: any = [];
    notMeasured: any = [];
    reported: any = [];

    values: any;
    chartData: any;
    clicked: any;
    quaterData: undefined;
    yearData: any;
    KRIStatus: any;

    period: any;
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    testdataNotMeasured: any;
    testDataMeasured: any;
    testDataReported: any;
    constructor(
        public dialog: MatDialog,
        public DashboardService: DashboardService
    ) { }
    ngOnChanges(changes: SimpleChanges): void {

        // if(this.chartValue?.length > 0) {
            if(changes['chartValue'].firstChange || (JSON.stringify(changes['chartValue'].currentValue) != JSON.stringify(changes['chartValue'].previousValue))) {
                // setTimeout(() => {
                    this.values = this.chartValue;
                    var ReportingFrequencyID;
                    if (this.values > 0) {
                        if (this.values[0].Frequency == 'Monthly') {
                            ReportingFrequencyID = 1
                        } else if (this.values[0].Frequency == 'Quarterly') {
                            ReportingFrequencyID = 2
                        } else if (this.values[0].Frequency == 'Semi Annual') {
                            ReportingFrequencyID = 3
                        } else {
                            ReportingFrequencyID = 4
                        }
                        this.getPeriod(ReportingFrequencyID);
                    } else {
                        this.period = ""
                    }

                    this.testdataNotMeasured = this.values.filter((ele:any)=> ele.Quater == 'Q4-23' && ele.KRI_Status == 'Not Measured' ).length
                    console.log("🚀 ~ file: kri-overall.component.ts:186 ~ this.DashboardService.gotYearQuater.subscribe ~  this.testdataNotMeasured:",  this.testdataNotMeasured)
                    this.testDataMeasured = this.values.filter((ele:any)=> ele.Quater == 'Q4-23' && ele.KRI_Status == 'Measured' ).length
                    console.log("🚀 ~ file: kri-overall.component.ts:188 ~ this.DashboardService.gotYearQuater.subscribe ~ this.testDataMeasured:", this.testDataMeasured)
                    this.testDataReported = this.values.filter((ele:any)=> ele.Quater == 'Q4-23' && ele.KRI_Status == 'Reported' ).length
                    console.log("🚀 ~ file: kri-overall.component.ts:190 ~ this.DashboardService.gotYearQuater.subscribe ~ this.testDataReported:", this.testDataReported)

                    this.reported = []
                    this.measured = []
                    this.notMeasured = []

                    this.measured=this.values.filter((dat:any)=> dat.KRI_Status=='Measured')
                    this.notMeasured=this.values.filter((dat:any)=> dat.KRI_Status=='Not Measured')
                   this.reported=this.values.filter((dat:any)=> dat.KRI_Status=='Reported')



                    this.values.forEach((kri: any) => {


                        // if (kri.IsReported == "True") {
                        //     kri.KRIStatus = 'Reported';
                        // } else if (kri.Date != null && kri.MeasurementValue != null && kri.Remark != '' && kri.Remark != null) {
                        //     kri.KRIStatus = "Measured";
                        // } else {
                        //     kri.KRIStatus = "Not Measured";
                        //     kri.Period = null;
                        //     kri.Date = null;
                        //     if (kri.MeasurementValue == null) {
                        //         kri.KRI_Value = null
                        //     }
                        // }

                        var singlePerid;
                        var date = kri.Date;

                        var currentDateObj = new Date(date);
                        var numberOfMlSeconds = currentDateObj.getTime();
                        // var addMlSeconds = 60 * 60 * 1000;
                        // var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
                        var newDateObj = new Date(numberOfMlSeconds);
                        let month = new Date(newDateObj).getMonth();
                        let year = ' ' + new Date(date).getFullYear() + ' '
                        if (kri.Frequency == 'Monthly') {
                            singlePerid = this.months[month] + year;
                        } else if (kri.Frequency == 'Quarterly') {
                            singlePerid = this.getQuarternew(newDateObj)
                        } else if (kri.Frequency == 'Semi Annual') {
                            singlePerid = month < 6 ? 'Jan-Jun ' + year : 'Jul-Dec ' + year;
                        } else {
                            singlePerid = 'Jan-Dec ' + year;
                        }
                        // if(this.period != singlePerid || kri.Measurement == null){
                        //     kri.Measurement = null;
                        //     kri.ThresholdValue = null;
                        //     kri.Remark = null;
                        //     kri.KRIStatus = "Not Measured";
                        // }
                        // if(kri.Remark == null || kri.Remark == ""){
                        //     kri.KRIStatus = "Not Measured";
                        // }
                        // if(kri.KRIStatus == "Not Measured" || kri.KRIStatus == "Measured"){
                        //     kri.Period = null;
                        // }

                        // if (kri.KRIStatus == 'Reported') {

                        //     this.reported.push(kri)
                        // } else if (kri.KRIStatus == 'Measured') {
                        //     this.measured.push(kri)
                        // } else {
                        //     this.notMeasured.push(kri)
                        // }
                    })


                // }, 2000);
            // }
        }
                    this.callinData();

    }
    ngOnInit(): void {
        this.DashboardService.gotYearQuater.subscribe((value) => {
            if (value == true) {
                this.yearData = this.DashboardService.yearValue;
                this.quaterData = this.DashboardService.quaterValue;
            }
            // this.yearData = this.DashboardService.yearValue
            // this.quaterData = this.DashboardService.
            let currentDate = new Date(); // Get the current date
            let currMonth = currentDate.getMonth() + 1;
            let currQuarter = Math.ceil(currMonth / 3);
            let quarterFilter =
                'Q' +
                (this.quaterData !== undefined && this.quaterData > 0
                    ? this.quaterData
                    : currQuarter) +
                '-' +
                this.yearData.toString().substr(2, 2);
        });
        console.log("🚀 ~ file: kri-chart.component.ts:146 ~ KriChartComponent ~ ngOnInit ~ this.values:", this.values)
        // setTimeout(() => {

        // },1000);
        // setTimeout(() => {
        //      this.values=this.chartValue
            //  this.measured=this.values.filter((dat: { KRIStatus: string; })=>dat.KRIStatus=='Measured').length
            //  this.notMeasured=this.values.filter((dat: { KRIStatus: string; })=>dat.KRIStatus=='Not Measured').length
            //  this.reported=this.values.filter((dat: { KRIStatus: string; })=>dat.KRIStatus=='Reported').length
        //     // console.log(this.values.filter((dat: { KRIStatus: string; })=>dat.KRIStatus!=='Measured' && dat.KRIStatus!=='Not Measured'))
        //     this.callinData()
        // }, 1000);
    }

    getQuarternew(newDateObj: any) {
        var finaltype;
        var date = new Date(newDateObj);
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = "Jan-Mar " + year;
                break;
            case 2:
                finaltype = "Apr-Jun " + year;
                break;
            case 3:
                finaltype = "Jul-Sep " + year
                break;
            case 4:
                finaltype = "Oct-Dec " + year
                break;
            default:
                break;
        }
        return finaltype;
    }
    getQuarter() {
        var finaltype;
        var date = new Date();
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        var year = date.getFullYear();
        switch (month) {
            case 1:
                finaltype = "Jan-Mar " + year;
                break;
            case 2:
                finaltype = "Apr-Jun " + year;
                break;
            case 3:
                finaltype = "Jul-Sep " + year
                break;
            case 4:
                finaltype = "Oct-Dec " + year
                break;
            default:
                break;
        }
        return finaltype;
    }
    getPeriod(id: any) {
        let frequencyId = id;
        var currentDateObj = new Date();
        var numberOfMlSeconds = currentDateObj.getTime();
        // var addMlSeconds = 60 * 60 * 1000;
        // var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
        var newDateObj = new Date(numberOfMlSeconds);
        let month = new Date(newDateObj).getMonth();
        let year = ' ' + new Date().getFullYear() + ' '
        switch (frequencyId) {
            case 1:
                this.period = this.months[month] + year;
                break;
            case 2:
                this.period = this.getQuarter();
                break;
            case 3:
                this.period = month < 6 ? 'Jan-Jun' + year : 'Jul-Dec ' + year
                break;
            case 4:
                this.period = 'Jan-Dec ' + year
                break;
        };
    }
    callinData() {
        this.options = {
            chart: {
                type: 'column',
            },
            title: {
                align: 'left',
                text: ' ',
            },
            subtitle: {
                align: 'left',
                text: '',
            },
            accessibility: {
                enabled: false,
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: '',
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                column: { colorByPoint: true },
                series: {
                    pointWidth: 15,
                    borderWidth: 0,
                    minPointLength: 3,
                    // outerWidth: 3,
                    borderRadius: 6,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },

            tooltip: {
                formatter: function () {
                    return 'view more information';
                },
            },

            series: [
                // cursor: 'pointer',

                {
                    data: this.getAllData(),
                },
            ],
        };
        this.kriCharts = Highcharts.chart('statusContainer', this.options);
    }
    getAllData() {
        let measure = this.measured.length;
        console.log("🚀 ~ file: kri-chart.component.ts:293 ~ KriChartComponent ~ getAllData ~ measure:", measure)
        let reported = this.reported.length;
        console.log("🚀 ~ file: kri-chart.component.ts:295 ~ KriChartComponent ~ getAllData ~ reported:", reported)
        let notMeasure = this.notMeasured.length;
        console.log("🚀 ~ file: kri-chart.component.ts:297 ~ KriChartComponent ~ getAllData ~ notMeasure:", notMeasure)
        return [
            {
                name: `<span style="color:black;font-family: Roboto Condensed; font-size:1.7vh;font-weight:600;">Measured</span>`,
                y: measure,
                // setInterval(()=>{})/
                color: {
                    linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#F2F2F2'],
                        [1, '#CBCBCB'],
                    ],
                },
                cursor: 'pointer',
                events: {
                    click: () => this.clickBars(this.measured),
                },
                // cursor : pointer,
            },
            {
                name: '<span style="color:red;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Not Measured</span>',
                y: notMeasure,
                color: {
                    linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#E7E7E7'],
                        [1, '#FF6868'],
                    ],
                },
                events: {
                    click: () => this.clickBars(this.notMeasured),
                },
            },
            {
                name: '<span style="color:#82E090;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Reported</span>',
                y: reported,
                color: {
                    linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#E7E7E7'],
                        [1, '#0FB766'],
                    ],
                },
                // cursor:Highcharts.Pointer,
                events: {
                    click: () => this.clickBars(this.reported),
                },
            },
        ];
    }

    getCount() {
        return this.values.length;
    }

    getIndex(dt: any, mst: any) {
        let index = 1;
        let list = [];
        for (let i of dt) {
            i.sno = index;
            i.KRIStatus = mst
            list.push(i);
            index++;
        }
        // console.log(list)
        return list;
    }

    clickBars(m: any) {
        console.log(this.values);
        if (m == this.measured) {
            m = m
            this.KRIStatus = 'Measured';
        } else if (m == this.notMeasured) {
            m = m
            this.KRIStatus = 'Not Measured';
        } else if (m == this.reported) {
            m = m
            this.KRIStatus = 'Reported';
        }
        // const result = this.values.filter((da: { KRIStatus : any;}) => da.KRIStatus== m)
        // console.log("result",result)
        // const data=this.getIndex(result)
        // console.log(m);
        const kriPopup = this.dialog.open(KriPopupComponent, {
            disableClose: false,
            height: '80vh',
            width: '70vw',
            data: {
                data: this.getIndex(m, this.KRIStatus),
                name: this.KRIStatus
            },
        });
    }
}
