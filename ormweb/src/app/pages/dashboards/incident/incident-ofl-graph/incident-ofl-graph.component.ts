import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { OflGrphPopupComponent } from '../incident-popups/ofl-grph-popup/ofl-grph-popup.component';
import { environment } from 'src/environments/environment';
declare module 'highcharts' {
    interface ChartClickEvent extends Event {
        point: Point;
    }
}
@Component({
    selector: 'app-incident-ofl-graph',
    templateUrl: './incident-ofl-graph.component.html',
    styleUrls: ['./incident-ofl-graph.component.scss'],
})
export class IncidentOflGraphComponent implements OnInit {
    @Input() allData: any;
    maxHighRiskchart: any;

    listdata: any;
    quarterList: any;
    totalReportedlist: any;
    maxHighRiskoptions: any;
    filterData: any;
    quarterdata: any;
    clicked: any;
    update: any;
    presentQuarter: any;
    count: any;
    quarterData: any = [];
    quarterArray: any = [];
    barHtmlContent: any;
    metricGroup: any = [];
    lossData: any = [];
    dataArr: any = [];
    text: any;
    onclick = false;
    operationalRisk: any;
    prevQuarter: string[] = [];
    metricdata: any;
    selectedValue: any;
    metricGroupData: any = [];
    RawData: any;
    allLossAmount: any;
    metricGroupData1: any = [];
    records: any = [];
    unitId: any;
    quarter: any;
    quaterData: any;
    yearData: any;
    quarterFilter: any;
    currency = environment.currency;

    constructor(public dashboardservice: DashboardService,
        public dialog: MatDialog) {}

    ngOnInit(): void {
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RawData = this.dashboardservice.dashboardIncMaster;
                this.currency = (Array.isArray(this.RawData) && this.RawData.length > 0) ? this.RawData[0].Currency : '';
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                    this.yearData = this.dashboardservice.yearValue
                    this.quaterData = this.dashboardservice.quaterValue
                    // console.log("this.yearData",this.yearData)
                    // console.log("this.quaterData",this.quaterData)

                let currentDate = new Date(); // Get the current date
                let currMath = (Math.ceil((currentDate.getMonth() + 1) / 3))

                // let quarterFilter ='Q' + ((this.quaterData ?? 0) > 0 ? currMath : (this.quaterData ?? 0)) + '-' + this.yearData.toString().substr(2, 2)

                let currMonth = currentDate.getMonth() + 1;

                let currQuarter = Math.ceil(currMonth / 3);

                // console.log("currQuarter",currQuarter)




                this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
                // console.log("currQuarter",currQuarter)
                // let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
                // console.log("🚀 ~ file: incident-ofl-graph.component.ts:68 ~ IncidentOflGraphComponent ~ this.dashboardservice.gotYearQuater.subscribe ~ quarterFilter:", this.quarterFilter)

                this.listdata = (Array.isArray(this.RawData) ? this.RawData : []).filter(
                    (data: any) =>   (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                         data.StatusID != 14 && data.StatusID != 15 &&
                         data.StatusID != 16)
                );
                this.metricdata= []
                this.selectedValue  = [];

                this.metricGroupData = [];
                this.barGraph(0);
                setTimeout(() => {
                    this.displayChart();
                }, 1000);
                this.getIncidentLossAmount();
                this.getGraphCount();
            });
                // this.countIncidentTypes(this.listdata)
            }
        });

        this.quarterArray = this.createQuarters();
    }

    barGraph(i: any) {
        this.metricGroup.sort(function (a: any, b: any) {
            return b - a;
        });

        let self = this;
        // console.log('self', self);
        this.maxHighRiskoptions = {
            chart: {
                type: 'bar',
                borderWidth: 0,
        borderColor: 'transparent',
                events: {
                    load: function (event: any): any {
                        var selectedPoint = (this as any).series[0].data[
                            i
                        ].select(true, true);
                        let barID = (this as any).series[0].data[i];
                        let text = document.getElementById('data');
                        // (this as any).showPopup(barID);
                        // let barID = event.point.name;
                        //             let text = document.getElementById('data');
                        //             (this as any).showPopup(barID);
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
                            fontSize: '10px', // Adjust the font size as per your requirement
                        },
                        gridLineWidth: 0,
                        gridLineColor:'transparent',
                        lineColor: 'transparent',
                        lineWidth: 0
                    },

                    // lineWidth: 0,
                    // tickWidth: 0,
                    // minPadding: 0,
                    // maxPadding: 0,
                    // events: {
                    //     afterSetExtremes: function ():any {
                    //       const firstPoint = this.metricGroup
                    //       firstPoint.select();
                    //     }
                    //   }
                },
            ],
            yAxis: [
                {
                    title: {
                        enabled: false,
                    },
                    labels: {
                        enabled: false,
                    },
                    gridLineWidth: 0,
                    gridLineColor: 'transparent',
                    tickInterval: 1000,
                },
            ],
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    dataLabels: {
            enabled: true,
            inside: true,
            align: 'left',
            x: 300 //offset
                    },
                    // selected: dataPointToSelect,
                    point: {
                        events: {
                            click: (event: any) => {
                                if (event.point) {
                                    if ((self.onclick = true)) {
                                        // console.log("self.onclick",self.onclick)
                                        let barID = event.point.name;
                                        let text =
                                            document.getElementById('data');
                                        this.showPopup(barID);
                                        //   console.log(event.point);

                                        //   event.point.selected = true;
                                        if (event.point.selected) {
                                            this.barGraph(event.point.index);
                                            this.displayChart();
                                        }
                                    }
                                } else {
                                    self.text = ' ';
                                }
                            },
                            select: (event: any) => {
                                // console.log(event.target);

                                if (event.target.selected) {
                                    event.target.dataLabel.text.css({
                                        fill: 'orangered',
                                    });
                                } else {
                                    event.target.dataLabel.text.css({
                                        fill: 'orangered',
                                    });
                                }
                            },
                            // },
                        },
                    },
                    pointWidth: 10,
                    pointHeight: 5,
                    borderWidth: 0,
                    borderRadius: 8,

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
                            dataLabels: {
                                enabled: true,
                                // format: '{point.y}',
                                style: {
                                    color: 'black',
                                    fontSize: '15px',
                                },
                                top: true,
                            },
                            //   dataLabels: {
                            //     enabled: true,
                            //     inside: false,
                            //     align: 'right',
                            //     // format: '{point.y}',
                            //     style: {
                            //         color: 'black',
                            //         fontSize: '4px',
                            //     },
                            //     top: true,
                            // },
                        },
                    },
                    allowPointSelect: true,
                },
            },
            tooltip: { enabled: false },

            series: [
                {
                    dataLabels: {
                        enabled: true,
                        backgroundColor: 'transparent', // Set the background color to transparent

                        // format: '{point.y}',
                        style: {
                            color: 'black',
                            fontSize: '6px',
                            textOutline: 'none',
                        },
                        top: true,
                    },
                    // color:"gray",
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
                    data: this.metricGroupData,
                },
            ],
        };
    }

    showPopup(barID: string) {
        //   console.log("barid",barID)
        //   console.log("this.metricGroupData1",this.metricGroupData1)
        this.metricdata = this.metricGroupData1.filter(
            (obj: any) => obj.name == barID
        );
        // console.log("metricdata",this.metricdata)
        //   let popupElement = document.getElementById('data');
        // console.log('metricdata', this.metricdata);
    }
    countAmount(i: any) {
        // console.log('i-data', i);
        let l = [];
        for (let j of i) {
            l.push(j.LossAmount);
        } // console.log(i)
        const initialValue = 0;
        const sumWithInitial = l.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            initialValue
        );
        return sumWithInitial;
    }

    getGraphCount() {
        const currentDate = new Date();

                    const currentQuarter = Math.ceil(
                        (currentDate.getMonth() + 1) / 3
                    );

                    const previousQuarters = [];
                    let quarter : any;
                    let year:any
                    let obj: any = {};
                    for (let i = 0; i <= 3; i++) {
                        if (this.quaterData == undefined ) {
                            quarter = currentQuarter - i;
                            year = currentDate.getFullYear();
                        } else {
                            quarter = this.quaterData - i;
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


        // Create a dictionary to store the quarterly data
        const result: any = {};
        let dataArr: any = [];
        // Iterate through previous quarters
        for (let i = 0; i < previousQuarters.length; i++) {
            const quarter = previousQuarters[i];
            const lossAmount = this.listdata.reduce(
                (total: number, item: any) => {
                    if (item.Quater === quarter) {
                        return total + item.LossAmount;
                    }
                    return total;
                },
                0
            );

            result[quarter] = {
                Quater: quarter,
                y: lossAmount, // Set the initial value for y as 0
                // LossAmount: lossAmount, // Add the total loss amount for the quarter
            };
            dataArr.push(result[quarter]);
            this.metricGroupData.push({
                name: result[quarter].Quater,
                y: result[quarter].y,
            });
        }
    }
    getIncidentLossAmount() {
        const currentDate = new Date();
        const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);

        const previousQuarters: string[] = [];
        let previousQuartersLossAmount: any = {};

        for (let i = 0; i <= 3; i++) {
            let quarter = this.quaterData - i;
            let year = this.yearData;

            if (quarter <= 0) {
                quarter += 4;
                year--;
            }

            const quarterKey = `Q${quarter}-${year.toString().slice(-2)}`;
            previousQuarters.push(quarterKey);
            previousQuartersLossAmount[quarterKey] = {};
        }
        // console.log("previousQuarters",previousQuarters)

        let dataArr: any = [];

        for (const incident of this.listdata) {
            const { Quater, IncidentType, LossAmount } = incident;

            if (previousQuarters.includes(Quater)) {
                const incidentTypes = IncidentType.split(',');

                for (const type of incidentTypes) {
                    const trimmedType = type.trim();
                    const joinedString = trimmedType.replace(/\s+|:/g, '');

                    if (!previousQuartersLossAmount[Quater][joinedString]) {
                        previousQuartersLossAmount[Quater][joinedString] = 0;
                    }

                    previousQuartersLossAmount[Quater][joinedString] +=
                        LossAmount;
                }
            }
        }
    //    console.log("previousQuartersLossAmount",previousQuartersLossAmount)
        for (let key in previousQuartersLossAmount) {
            // console.log("i",key)
            // console.log("previousQuartersLossAmount[i]",previousQuartersLossAmount[key])
            if (previousQuartersLossAmount[key] != {}) {
                this.metricGroupData1.push({
                    name: key,
                    nearMissData:
                        previousQuartersLossAmount[key].NearMissorPotentialLoss,
                    revenueLeakage:
                        previousQuartersLossAmount[key].RevenueLeakage,
                    OperationalRiskFraudInternalorExternal:
                        previousQuartersLossAmount[key]
                            .OperationalRiskFraudInternalorExternal,
                    OperationalRiskothercategory:
                        previousQuartersLossAmount[key]
                            .OperationalRiskothercategory,
                    Legal: previousQuartersLossAmount[key].Legal,
                });
            } else {
                this.metricGroupData1.push({
                    name: key,
                });
            }
        }



        // const transformedData = this.listdata.flatMap((item:any) => {
        //     const quarter = Object.keys(item)[0];
        //     const data = item[quarter];

        //     if (data) {
        //         this.records = Object.entries(data).map(
        //             ([incidentType, count]) => ({
        //                 quarter,
        //                 incidentType,
        //                 count,
        //             })
        //         );

        //         return this.records;
        //     }

        //     return [];
        // });
        this.selectedValue = []
        this.selectedValue = this.metricGroupData1.filter(
            (ele: any) => ele.name == this.quarterFilter
        );
        // console.log("this.selectedValue",this.selectedValue)

        //         console.log('transformedData', transformedData);
        // console.log("records", this.records)

        // console.log('getIncidentLossAmount', previousQuartersLossAmount);
    }
    ngOnDestroy(): void {
        this.metricGroup = [];
    }
    getLossValues(data: any) {
        let quarter = this.dataArr.filter((ele: any) => ele.Quater == 'Q1-23');
    }
    //    return quarter && quarter.length > 0 ? quarter.filter((ele:any))   }
    createQuarters() {
        let obj: any = {};
        let d = new Date().getFullYear().toString();
        d = d.substring(d.length - 1);
        // console.log(d.substring(d.length - 1));
        for (let i = 1; i >= 4; i++) {
            obj[`Q${i}-${d}`] = `Q${i}-${d}`;
        }
        // console.log(obj);
        return obj;
    }

    displayChart() {
        if (this.maxHighRiskoptions) {
            (Highcharts as any).chart(
                'OverallFinancialLoss',
                this.maxHighRiskoptions
            );
        }
    }
    unitData(id:any) {
        if(id == 1){
            this.unitId = "Operational Risk Fraud: Internal or External"
            if(!this.onclick){
                this.quarter = this.selectedValue[0].name
            }else{
                this.quarter = this.metricdata[0].name
            }
            // this.quarter = this.selectedValue[0].name || this.metricdata[0].name
        }else if(id == 2){
            this.unitId = "Operational Risk: other category"
            if(!this.onclick){
                this.quarter = this.selectedValue[0].name
            }else{
                this.quarter = this.metricdata[0].name
            }
            // this.quarter = this.selectedValue[0].name || this.metricdata[0].name
        }else if(id == 3){
            this.unitId = "Near Miss or Potential Loss"
            if(!this.onclick){
                this.quarter = this.selectedValue[0].name
            }else{
                this.quarter = this.metricdata[0].name
            }
            // this.quarter = this.selectedValue[0].name || this.metricdata[0].name
        }else if(id == 4){
            this.unitId =  "Revenue Leakage"
            if(!this.onclick){
                this.quarter = this.selectedValue[0].name
            }else{
                this.quarter = this.metricdata[0].name
            }
            // this.quarter = this.selectedValue[0].name || this.metricdata[0].name
        }else if(id == 5){
            // console.log("")
            this.unitId =  "Legal"
            if(!this.onclick){
                this.quarter = this.selectedValue[0].name
            }else{
                this.quarter = this.metricdata[0].name
            }
            // this.quarter = this.selectedValue[0].name || this.metricdata[0].name
        }
        const dialog = this.dialog.open(OflGrphPopupComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',

            data: {
                title: "Confirm Logout",
                id: this.unitId,
                quarter:this.quarter
            },
        });
        dialog.afterClosed().subscribe((result) => {});
    }
}
