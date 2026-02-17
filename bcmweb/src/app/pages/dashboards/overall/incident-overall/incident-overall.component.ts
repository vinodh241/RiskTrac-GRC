import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CwPopupComponent } from '../../incident/incident-popups/cw-popup/cw-popup.component';
import { DashboardComponent } from '../../dashboard.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-incident-overall',
    templateUrl: './incident-overall.component.html',
    styleUrls: ['./incident-overall.component.scss'],
})
export class IncidentOverallComponent implements OnInit {
    incidentCharts: any;
    options: any;
    INCData: any;
    yearData: any;
    quaterData: any;
    quarterFilter: any;
    allData: any;
    incidentAllData: any;
    metricGroupData: any;
    listdata: any;
    dataArr: any = [];
    lossAmount: any;
    totalLossAmount: any;
    values: any;
    high: any;
    medium: any;
    low: any;
    currency: any = environment.currency;
    constructor(public dashboardservice: DashboardService,public dialog: MatDialog, public DashboardComponent: DashboardComponent) {}

    ngOnInit(): void {
        this.dashboardservice.getYearQuarterData();
        // this.dashboardservice.getOverallDashbardData();
        this.dashboardservice.gotOverallDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.INCData = this.dashboardservice.dashboardINCMaster;
                console.log('INCdata', this.INCData);
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                    this.yearData = this.dashboardservice.yearValue;
                    this.quaterData = this.dashboardservice.quaterValue;
                    let currentDate = new Date(); // Get the current date
                    let currMonth = currentDate.getMonth() + 1;
                    let currQuarter = Math.ceil(currMonth / 3);
                    // console.log("currQuarter",currQuarter)
                    this.quarterFilter =
                        'Q' +
                        (this.quaterData !== undefined && this.quaterData > 0
                            ? this.quaterData
                            : currQuarter) +
                        '-' +
                        this.yearData.toString().substr(2, 2);

                    let currentQuarter =
                        'Q' +
                        Math.ceil((currentDate.getMonth() + 1) / 3) +
                        '-' +
                        currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter
                    this.listdata = this.INCData.filter(
                        (data: any) => data.StatusID != 1
                    );
                    console.log('this.quarterFilter', this.quarterFilter);
                    this.allData = this.INCData.filter((data: any) =>  data.Quater === this.quarterFilter && (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 && data.StatusID != 14 && data.StatusID != 15 && data.StatusID != 16)); // Filter the object based on the current quarter
                    console.log(' this.allData', this.allData);
                    this.incidentAllData = this.allData.length;
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
                    this.incidentGraphData();
                    }, 2000);
                    this.getGraphCount();
                });
            }
        });
    }
    incidentGraphData() {
        console.log('123');
        this.options = {
            chart: {
                type: 'column',
                // borderWidth: 1, // Set the border width
                // borderColor: '#ccc' // Set the border color
                plotBorderColor: '#ccc', // Set the border color for the plot area
                plotBorderWidth: 0.5 // Set the border width for the plot area
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
                tickInterval: 10,

            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                column: { colorByPoint: true },
                series: {
                    cursor: 'pointer',
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
                            fontSize: '12px',
                            textOutline: 'none'
                        },
                    },
                },
            },

            tooltip: {
                enabled: false,
            },

            series: [
                // cursor: 'pointer',

                {
                    data: this.getAllData(),
                },
            ],
        };
        this.incidentCharts = Highcharts.chart('containerdata', this.options);
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
                        [0, '#B10000'],
                        [1, '#B10000'],
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
                        [0, '#FF6E05'],
                        [1, '#FF6E05'],
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
                        [0, '#0B9A45'],
                        [1, '#0B9A45'],
                    ],
                },
                // cursor:Highcharts.Pointer,
                events: {
                    click: () => this.clickBars('Low'),
                },
            },
        ];
    }
    getGraphCount() {
        this.totalLossAmount = 0;

        this.allData.forEach((item: any) => {
            if (item.LossAmount !== null) {
                this.totalLossAmount += item.LossAmount;
            }
        });
        console.log('Total Loss Amount:', this.totalLossAmount);
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
    navigatePage(){
        this.DashboardComponent.openMenu('incident','same');
    }
}
