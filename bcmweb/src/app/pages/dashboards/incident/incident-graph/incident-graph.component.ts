import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { IncidentRecordsComponent } from '../incident-popups/incident-records/incident-records.component';

@Component({
    selector: 'app-incident-graph',
    templateUrl: './incident-graph.component.html',
    styleUrls: ['./incident-graph.component.scss'],
})
export class IncidentGraphComponent implements OnInit {
    @Input() allData: any;
    maxHighRiskchart: any;

    listdata: any;
    quarterList: any;
    totalReportedlist: any;
    maxHighRiskoptions: any;
    clicked: any;
    update: any;
    presentQuarter: any;
    count: any;
    quarterData: any = [];
    onclick = false;
    RawData: any;
    yearData: any;
    quaterSelectedValue: any;

    constructor(
        public dashboardservice: DashboardService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RawData = this.dashboardservice.dashboardIncMaster;
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                    this.yearData = this.dashboardservice.yearValue;
                    this.quaterSelectedValue = this.dashboardservice.quaterValue;
                    this.allData = this.RawData.filter(
                        (data: any) =>  (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                             data.StatusID != 14 && data.StatusID != 15 &&
                             data.StatusID != 16)
                    );
                    this.quarterData = [];
                    const currentDate = new Date();

                    const currentQuarter = Math.ceil(
                        (currentDate.getMonth() + 1) / 3
                    );

                    const previousQuarters = [];
                    let quarter : any;
                    let year:any
                    let obj: any = {};
                    for (let i = 0; i <= 3; i++) {
                        if (this.quaterSelectedValue == undefined ) {
                            quarter = currentQuarter - i;
                            year = currentDate.getFullYear();
                        } else {
                            quarter = this.quaterSelectedValue - i;
                            year = this.yearData;
                        }
                        if (quarter <= 0) {
                            quarter += 4;
                            year--;
                            obj[`Q${quarter}-${year}`] = `Q${quarter}-${year
                                .toString()
                                .slice(-2)}`;
                        }
                        previousQuarters.push(
                            `Q${quarter}-${year.toString().slice(-2)}`
                        );
                    }

                    // console.log('previousQuarters', previousQuarters);

                    for (const quarter of previousQuarters) {
                        const filteredData = this.allData.filter(
                            (item: any) => item.Quater === quarter
                        );
                        this.quarterData.push({
                            name: quarter,
                            y: filteredData.length,
                            countdata: filteredData,
                        });
                    }

                    // let uniqueQuarter = [];
                    // for (let i = 0; i < this.allData.length; i++) {
                    //     if (
                    //         uniqueQuarter.lastIndexOf(this.allData[i].Quater) === -1
                    //     ) {
                    //         uniqueQuarter.push(this.allData[i].Quater);
                    //         this.count = this.allData.filter(
                    //             (ele: any) => ele.Quater == this.allData[i].Quater
                    //         );
                    //         // console.log("count",this.count)
                    //         if (this.count && this.count.length) {
                    //             this.quarterData.push({
                    //                 name: this.count[0].Quater,
                    //                 y: this.count.length,
                    //                 countdata: this.count,
                    //             });
                    //         }
                    //     }
                    // }
                    this.barGraph();
                    setTimeout(() => {
                        this.displayChart();
                    }, 2000);
                });
            }
        });
    }

    barGraph() {
        let selectedPoint: any;
        const self = this;
        this.maxHighRiskoptions = {
            chart: {
                type: 'column',
                events: {
                    load: function (): any {
                        selectedPoint = (this as any).series[0].data[0];

                        // console.log('selectedPoint', selectedPoint);

                        selectedPoint.update({ color: 'red' });
                        selectedPoint.select(true, true);
                    },
                },
            },
            credits: {
                enabled: false,
            },
            title: {
                text: undefined,
            },
            subtitle: {
                text: undefined,
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: [
                {
                    type: 'category',
                    labels: {
                        style: {
                          fontSize: '12px', // Specify the font size here
                          fontWeight: 400
                        }
                      },
                    lineWidth: 0,

                    tickWidth: 0,

                    minPadding: 0,

                    maxPadding: 0,

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

                            value: 3.5, // Add plot line at the end side of the graph

                            zIndex: 5,
                        },
                    ],
                },
            ],
            yAxis: [
                {
                    title: {
                        enabled: false,
                    },

                    tickInterval: 20,
                },
            ],
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            select: function () {
                                (this as any).update({ color: 'red' });
                            },

                            unselect: function () {
                                (this as any).update({ color: '' });
                            },

                            click: (event: any) => {
                                const point = event.point;

                                // console.log('point :', point.name);

                                this.viewAll(point.name);
                            },
                        },
                    },
                    pointWidth: 15,
                    borderWidth: 0,
                    borderRadius: 8,
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
                            // color: 'black',
                            fontSize: '10px',
                            textOutline: 'none',
                        },
                        // format: '{point.y}',
                    },
                    style: {
                        width: '20px',
                    },
                    states: {
                        select: {
                            color: {
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
                        },
                    },
                    allowPointSelect: true,
                },
            },
            tooltip: {
                enabled: true,
                pointFormat: '<b>Click here to view more information.</b><br/>',
                headerFormat: '',
                footerFormat: '',
            },
            series: [
                {
                    color: {
                        linearGradient: {
                            x1: 0,

                            x2: 0,

                            y1: 1,

                            y2: 0,
                        },

                        stops: [
                            [0, '#CBCBCB'],

                            [1, ' #F2F2F2'],
                        ],
                    },

                    data: this.quarterData,
                },
            ],
        };
    }

    viewAll(barName: string): void {
        // console.log('quarterDatagraph', this.quarterData);
        // console.log(
        //     'barName',
        //     this.quarterData.filter((ele: any) => ele.barName == ele.Quater)
        // );
        let data;
        for (let key in this.quarterData) {
            if (this.quarterData[key].name == barName) {
                data = this.quarterData[key].countdata;
            }
        }
        // console.log(data);
        const dialog = this.dialog.open(IncidentRecordsComponent, {
            disableClose: true,

            maxWidth: '100vw',

            maxHeight: '80vh', // height: '100%', // width: '100%',

            panelClass: 'full-screen-modal',

            data: {
                id: data,
                title: barName,
            },
        });

        dialog.afterClosed().subscribe((result) => {});
    }

    displayChart() {
        if (this.maxHighRiskoptions) {
            (Highcharts as any).chart(
                'quarterWiseIncidentContainer',
                this.maxHighRiskoptions
            );
        }
    }

    clickBars(event: any) {
        this.clicked = event;
        // console.log('event', event);
    }
}
