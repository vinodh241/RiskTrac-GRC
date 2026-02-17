import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CwPopupComponent } from '../incident-popups/cw-popup/cw-popup.component';
import { IncidentCwComponent } from '../incident-popups/incident-cw/incident-cw.component';

@Component({
    selector: 'app-incident-cw-graph',
    templateUrl: './incident-cw-graph.component.html',
    styleUrls: ['./incident-cw-graph.component.scss'],
})
export class IncidentCwGraphComponent implements OnInit {
    @Input() allData: any;
    maxHighRiskchart: any;

    listdata: any;
    quarterList: any;
    totalReportedlist: any;
    maxHighRiskoptions: any;
    statusList: any;
    criticalWise: any = [];
    count: any;
    totalWiseData: any;
    totalHighData: any;
    totalMediumData: any;
    totalLowData: any;
    values: any;
    // container: any;
    options: any;
    kriCharts: any;

    high: number = 0;
    medium: number = 0;
    low: number = 0;
    chartData: any;
    clicked: any;
    RawData: any;
    yearData: any;
    quaterData: any;
    constructor(
        public dashboardservice: DashboardService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RawData = this.dashboardservice.dashboardIncMaster;
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                this.yearData = this.dashboardservice.yearValue
                this.quaterData = this.dashboardservice.quaterValue
                let currentDate = new Date(); // Get the current date
                let currMonth = currentDate.getMonth() + 1;
                let currQuarter = Math.ceil(currMonth / 3);
                // console.log("currQuarter",currQuarter)
               let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);

                let currentQuarter =
                    'Q' +
                    Math.ceil((currentDate.getMonth() + 1) / 3) +
                    '-' +
                    currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter

                this.allData = this.RawData.filter(
                    (data: any) =>
                        data.Quater === quarterFilter &&  (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                             data.StatusID != 14 && data.StatusID != 15 &&
                             data.StatusID != 16)
                ); // Filter the object based on the current quarter
                console.log("this.allData",this.allData)
                let wiseData = [];
                for (let i = 0; i < this.allData.length; i++) {
                    if (
                        wiseData.lastIndexOf(
                            this.allData[i].CriticalityName
                        ) === -1
                    ) {
                        wiseData.push(this.allData[i].CriticalityName);
                        this.count = this.allData.filter(
                            (ele: any) =>
                                ele.CriticalityName ==
                                this.allData[i].CriticalityName
                        );
                        if (this.count && this.count.length) {
                            this.criticalWise.push({
                                name: this.count[0].CriticalityName,
                                y: this.count.length,
                            });
                        }
                    }
                }
                setTimeout(() => {
                    this.values = this.allData;
                    this.high = this.values.filter(
                        (dat: { CriticalityName: string }) =>
                            dat.CriticalityName == 'High'
                    ).length;
                    // console.log("high",this.high)
                    this.medium = this.values.filter(
                        (dat: { CriticalityName: string }) =>
                            dat.CriticalityName == 'Medium'
                    ).length;
                    // console.log("🚀 ~ file: incident-cw-graph.component.ts:79 ~ IncidentCwGraphComponent ~ this.dashboardservice.gotincidentDashboardMaster.subscribe ~ this.medium :", this.medium )
                    this.low = this.values.filter(
                        (dat: { CriticalityName: string }) =>
                            dat.CriticalityName == 'Low'
                    ).length;
                    // console.log("🚀 ~ file: incident-cw-graph.component.ts:84 ~ IncidentCwGraphComponent ~ this.dashboardservice.gotincidentDashboardMaster.subscribe ~ this.low:", this.low)
                    // console.log('ti');
                    this.callinData();
                }, 2000);
            });


            }

        });
        // this.callinData();

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
                plotLines: [
                    {
                        color: '#CCCCCC',
                        width: 1,
                        value: -0.5, // Add plot line at the start side of the graph
                        zIndex: 5,
                    },

                    {
                        color: 'rgba(204, 204, 204, 0.3)', // Lighter color with transparency
                        width: 1, // Adjust the width as desired
                        value: 2.5, // Add plot line at the end side of the graph
                        zIndex: 5,
                    },
                ],
            },
            yAxis: {
                title: {
                    text: '',
                },
                tickInterval: 20,
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                column: { colorByPoint: true },
                series: {
                    pointWidth: 15,
                    borderWidth: 0,
                    // outerWidth: 3,
                    borderRadius: 6,
                    dataLabels: {
                        enabled: true,
                        backgroundColor: 'transparent',
                        top: true,
                        inside: false,
                        verticalAlign: 'top', // Align the data labels to the top
                        y: -20,
                        crop: false, // Disable cropping of labels
                        overflow: 'allow',
                        style: {
                            color: 'black',
                            fontSize: '8px',
                            textOutline: 'none'
                        },
                        // format: '{point.y}',
                    },
                },
            },

            tooltip: {
                enabled: true,
                pointFormat: '<b>Click here to view more information.</b><br/>',
                headerFormat: '',
                footerFormat: ''
              },

            series: [
                // cursor: 'pointer',

                {
                    data: this.getAllData(),
                },
            ],
        };
        this.kriCharts = Highcharts.chart('cwContainer', this.options);
    }
    getAllData() {
        return [
            {
                name: `<span style="color:red">High</span>`,
                y: this.high,
                // setInterval(()=>{})/
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, '#FF9494'],
                        [1, '#830000'],
                    ],
                },
                cursor: 'pointer',
                events: {
                    click: () => this.clickBars('High'),
                },
                // cursor : pointer,
            },
            {
                name: '<span style="color:orange">Medium</span>',
                y: this.medium,
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, '#E7E7E7'],
                        [1, '#FF9494'],
                    ],
                },
                events: {
                    click: () => this.clickBars('Medium'),
                },
            },
            {
                name: '<span style="color:#b1b114d9">Low</span>',
                y: this.low,
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, '#E7E7E7'],
                        [1, '#FFEC8A'],
                    ],
                },
                // cursor:Highcharts.Pointer,
                events: {
                    click: () => this.clickBars('Low'),
                },
            },
        ];
    }

    getCount() {
        return this.values.length;
    }

    getIndex(dt: any) {
        let index = 1;
        let list = [];
        for (let i of dt) {
            i.sno = index;
            list.push(i);
            index++;
        }
        // console.log('listdataa', list);
        return list;
    }

    clickBars(m: any) {
        // console.log(this.values);
        const result = this.values!.filter(
            (da: { CriticalityName: any }) => da.CriticalityName == m
        );
        const data = this.getIndex(result);
        // console.log(m);
        const kriPopup = this.dialog.open(CwPopupComponent, {
            disableClose: false,
            height: '80vh',
            width: '70vw',
            data: {
                data: data,
                title:m
            },
        });
    }
}
