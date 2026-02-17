import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CwPopupComponent } from '../incident-popups/cw-popup/cw-popup.component';

@Component({
    selector: 'app-incident-mspl-graph',
    templateUrl: './incident-mspl-graph.component.html',
    styleUrls: ['./incident-mspl-graph.component.scss'],
})
export class IncidentMsplGraphComponent implements OnInit {
    maxHighRiskchart: any;
    // @Input() potentialLossCount: any
    @Input() allData: any;
    listdata: any;
    quarterList: any;
    totalReportedlist: any;
    maxHighRiskoptions: any;
    allDataLength: any;
    lossdataRecords: any;
    potentialLossCount: any;
    potentialLossCountPercentage: any;
    RawData: any;
    incidentAllData: any;
    yearData: any;
    quaterData: any;

    constructor(
        public dashboardservice: DashboardService,
        public dialog: MatDialog
    ) {
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                // this.allDataLength = this.allData.length
                this.RawData = this.dashboardservice.dashboardIncMaster;
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                    this.yearData = this.dashboardservice.yearValue
                    this.quaterData = this.dashboardservice.quaterValue
                let currentDate = new Date(); // Get the current date
                let currMonth = currentDate.getMonth() + 1;
                let currQuarter = Math.ceil(currMonth / 3);
                // console.log("currQuarter",currQuarter)
               let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);

                // let currentDate = new Date(); // Get the current date

                let currentQuarter =
                    'Q' +
                    Math.ceil((currentDate.getMonth() + 1) / 3) +
                    '-' +
                    currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter

                this.allData = (Array.isArray(this.RawData) ? this.RawData : []).filter(
                    (data: any) => data.Quater === quarterFilter &&  (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                         data.StatusID != 14 && data.StatusID != 15 &&
                         data.StatusID != 16)
                ); // Filter the object based on the current quarter
                // console.log('this.allData', this.allData);
                this.incidentAllData = this.allData.length;
                let potentialArr:any = [];

                this.allData.forEach((element:any) => {
                    let arr = element.IncidentType.split(',');

                    potentialArr = [...potentialArr, ...arr];
                });
                this.potentialLossCount = potentialArr.filter((x:any) => x == 'Near Miss or Potential Loss').length

                this.potentialLossCountPercentage = ( this.potentialLossCount / this.incidentAllData )* 100
                // console.log("🚀 ~ file: incident.component.ts:293 ~ IncidentDashboardComponent ~ potentialLossData ~ this.potentialLossCountPercentage:", this.potentialLossCountPercentage)
                this.pieGraph();
        setTimeout(() => {
            this.displayChart();
        }, 4000);
    });
            }
        });
    }

    ngOnInit(): void {

    }
    pieGraph() {
        this.maxHighRiskoptions = {
            chart: {
                type: 'pie',
                backgroundColor: "rgba(194, 182, 182, 0.3)",
                plotWidth: 1000,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
                plotShadow : false
            },
            title: {
                verticalAlign: 'middle',
                text: undefined,
            },
            tooltip: {
                enabled: true,
                pointFormat: '<b>{point.y}</b><br/>',
                headerFormat: '',
                footerFormat: ''
              },
            plotOptions: {
                pie: {
                    size:'100%',
                    innerSize: 70,
                    depth: 0,
                    dataLabels: {
                        enabled: false,
                    },
                    showInLegend:false,
                    colors: [
                        {
                            linearGradient: {
                                x1: 0,
                                x2: 0,
                                y1: 1,
                                y2: 0,
                            },
                            stops: [
                                [0, '#FFAA2E'],
                                [1, '#CB4900'],
                            ],
                        },
                        {
                            linearGradient: {
                                x1: 0,
                                x2: 1,
                                y1: 0,
                                y2: 1,
                            },
                            stops: [
                                [0, '#97DABA'],
                                [1, '#96C9D9'],
                            ],
                        }
                        // '#a8e2e9',
                    ],
                },
            },
            series: [
                {
                    // data: this.potentialLossCount
                    data: [
                        ['', this.potentialLossCount,this.potentialLossCountPercentage],
                        ['', this.incidentAllData - this.potentialLossCount],
                        // ['',this.potentialLossCountPercentage]
                    ],
                    states: {
                        hover: {
                          enabled: false
                        },
                        inactive: {
                            opacity: 1
                        }
                      }
                },
            ],
        };
    }
    displayChart() {
        if (this.maxHighRiskoptions) {
            (Highcharts as any).chart(
                'potentialLossIncidentContainer',
                this.maxHighRiskoptions
            );
        }
    }
    // clickBars(data: any) {
    //     const dialog = this.dialog.open(CwPopupComponent, {
    //         disableClose: true,
    //         maxWidth: '100vw',
    //         maxHeight: '80vh',
    //         // height: '100%',
    //         // width: '100%',
    //         panelClass: 'full-screen-modal',
    //         // data: {
    //         data: this.listdata.filter(
    //             (ele: any) => ele.IncidentType == 'Near Miss or Potential Loss'
    //         ),
    //         // },
    //     });
    //     dialog.afterClosed().subscribe((result) => {});
    // }
}
