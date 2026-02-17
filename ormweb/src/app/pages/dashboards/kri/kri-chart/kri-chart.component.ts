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
    @Input() quarterFilter: any
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
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    testdataNotMeasured: any;
    testDataMeasured: any;
    testDataReported: any;

    constructor(
        public dialog: MatDialog,
        public DashboardService: DashboardService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['chartValue'].firstChange || (JSON.stringify(changes['chartValue'].currentValue) != JSON.stringify(changes['chartValue'].previousValue))) {
            this.values = this.chartValue ?? [];
            this.testdataNotMeasured = this.values?.filter((ele: any) => ele.Quater == 'Q4-23' && ele.KRI_Status == 'Not Measured').length
            this.testDataMeasured = this.values?.filter((ele: any) => ele.Quater == 'Q4-23' && ele.KRI_Status == 'Measured').length
            this.testDataReported = this.values?.filter((ele: any) => ele.Quater == 'Q4-23' && ele.KRI_Status == 'Reported').length
            this.reported = []
            this.measured = []
            this.notMeasured = []
            this.measured = this.values?.filter((dat: any) => dat.KRI_Status == 'Measured')
            this.notMeasured = this.values?.filter((dat: any) => dat.KRI_Status == 'Not Measured')
            this.reported = this.values?.filter((dat: any) => dat.KRI_Status == 'Reported');
        }
        this.callinData();
    }

    ngOnInit(): void {
        this.DashboardService.gotYearQuater.subscribe((value) => {
            if (value == true) {
                this.yearData = this.DashboardService.yearValue;
                this.quaterData = this.DashboardService.quaterValue;
            }
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
        let reported = this.reported.length;
        let notMeasure = this.notMeasured.length;

        return [
            {
                name: `<span style="color:black;font-family: Roboto Condensed; font-size:1.7vh;font-weight:600;">Measured</span>`,
                y: measure,
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
        return this.values?.length;
    }

    getIndex(dt: any, mst: any) {
        let index = 1;
        let list = [];
        for (let i of dt) {
            i['sno'] = index;
            i.KRIStatus = mst
            list.push(i);
            index++;
        }
        return list;
    }

    clickBars(m: any) {
        // console.log(this.values);
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