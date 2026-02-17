import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DashboardComponent } from '../../dashboard.component';
@Component({
    selector: 'app-riskappetite-overall',
    templateUrl: './riskappetite-overall.component.html',
    styleUrls: ['./riskappetite-overall.component.scss'],
})
export class RiskappetiteOverallComponent implements OnInit {
    viewall: any = 'Group';
    options: any;
    raCharts: any;
    RAData: any;

    data: { category: string; values: number[] }[] = [
        {
            category: 'Category 1',
            values: [10, 15, 12],
        },
        {
            category: 'Category 2',
            values: [5, 8, 6],
        },
        {
            category: 'Category 3',
            values: [7, 3, 9],
        },
    ];
    lowcolor: any;
    modcolor: any;
    criticColor: any;
    metricGroups: any = [];
    totalCriticaldata: any;
    yearData: any;
    quaterData: any;
    quarterFilter: any;
    listdata: any;
    allData: any;
    uniqueValues: Set<any> = new Set();
    raGraphData: any = [];
    raGraphUnitData: any = [];
    lowData: any;
    moderateData: any;
    criticalData: any;

    constructor(public dashboardservice: DashboardService, public DashboardComponent: DashboardComponent) {}

    ngOnInit(): void {
        // this.dashboardservice.getOverallDashbardData();
        this.dashboardservice.gotOverallDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RAData = this.dashboardservice.dashboardRAMaster;

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

                    // console.log('this.quarterFilter', this.quarterFilter);
                    this.allData = this.RAData.filter(
                        (data: any) =>
                            data.Quater === this.quarterFilter &&
                            data.CollectionStatusName !== "Not Started" && data.StatusID !== null && data.StatusID !== 1 && data.StatusID !== 2
                    ); // Filter the object based on the current quarter
                    // console.log('radata', this.RAData);
                    const colorData = this.dashboardservice.dashboardRAColor;
                    // console.log('colorData', colorData);
                    this.lowcolor = colorData[0].ColorCode;
                    this.modcolor = colorData[1].ColorCode;
                    this.criticColor = colorData[2].ColorCode;
                    this.raGraphData = [];
                    this.countMetricGroups(this.viewall);
                    // this.setChart();
                });
            }
        });
    }

    toggleValues(event: MatSlideToggleChange) {
        // console.log('event', event);
        if (event.checked) {
            this.viewall = 'Unit';
            // console.log('this.viewall1', this.viewall);
            this.countMetricGroups(this.viewall);
        } else {
            this.viewall = 'Group';
            // console.log('this.viewall2', this.viewall);
            this.countMetricGroups(this.viewall);
        }
    }

    setChart() {
        // console.log('this.viewallgroup', this.viewall);
        this.options = {
            chart: {
                type: 'bar',
                scrollablePlotArea: {
                    minHeight: 200, // Set an appropriate minimum width for scrolling
                    // maxHeight:300
                    // minWidth: 300,
                },
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: this.raGraphData.map((item: any) => item.name),
                visible: true,
                lineColor: 'transparent',
                tickLength: 0,
                //   min: 0,
                //   max: 2,
                //   scrollbar: {
                //     enabled: true, // Enable the scrollbar
                //   },
                //   labels: {
                //     style: {
                //       whiteSpace: 'nowrap', // Prevent x-axis labels from wrapping
                //       textOverflow: 'ellipsis', // Show ellipsis (...) if the label overflows
                //     },
                //   },
            },
            yAxis: {
                min: 0,
                gridLineWidth: 20,
                visible: false,
                title: {
                    text: 'Goals',
                },
                labels: {
                    enabled: false,
                },
                //   scrollbar: {
                //     enabled: true, // Enable the scrollbar
                //   },
            },
            legend: {
                reversed: false,
            },
            scrollbar: {
                enabled: true, // Enable the scrollbar
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    // groupPadding: 0.2,
                    pointWidth: 12,
                    // pointPadding: 0.2,

                    dataLabels: {
                        enabled: false,
                    },
                    showInLegend: false,
                },
                bar: {
                    pointPadding: 0.2, // Adjust this value to control the spacing between bars within a group
                    groupPadding: 0.2, // Adjust this value to control the spacing between groups of bars
                },
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                enabled: true,
                pointFormat: '<b>{point.y}</b><br/>',
                headerFormat: '',
                footerFormat: '',
            },

            series: [
                {
                    data: this.raGraphData.map(
                        (item: any) => item.LowRiskLevel
                    ),
                    color: this.lowcolor,
                    borderRadiusTopLeft: 10,
                    borderRadiusTopRight: 10,
                },
                {
                    data: this.raGraphData.map(
                        (item: any) => item.ModerateRiskLevel
                    ),
                    color: this.modcolor,
                },
                {
                    data: this.raGraphData.map(
                        (item: any) => item.CriticalRiskLevel
                    ),
                    color: this.criticColor,
                    borderRadiusBottomLeft: 10,
                    borderRadiusBottomRight: 10,
                },
            ],
        };

        this.raCharts = Highcharts.chart('overallRaGraph', this.options);
    }

    countMetricGroups(data: any) {
        // this.resetData();
        this.metricGroups = [];
let totalRisk = 0;


        // console.log('this.RiskData-->>',this.RiskData)
        if (data == 'Group') {
            // console.log('data', data);
            this.raGraphData = [];
            if (this.allData.length > 0) {
                let group: any = {};
                // console.log('cc this.RiskData---->>',this.RiskData)
                let count = 1;
                this.totalCriticaldata = this.allData.filter(
                    (obj: any) => obj.RiskMetricLevel == 3
                );
                this.totalCriticaldata.forEach((item: any) => {
                    group[item.GroupName]
                        ? group[item.GroupName]++
                        : (group[item.GroupName] = 1);
                });
                // console.log('result group:',group);
                // console.log('this.metricGroups: 1st ',this.metricGroups);
                for (let key in group) {
                    this.metricGroups.push({
                        riskName: key,
                        totalCount: group[key],
                        val: count ? count++ : (count = 1),
                    });
                }
                // console.log('this.metricGroups: 2nd',this.metricGroups);
                // this.processData(this.metricGroups);
                for (const item of this.metricGroups.slice(0, 10)) {
                    if (!this.uniqueValues.has(item)) {
                        this.uniqueValues.add(item);
                    } else {
                        this.uniqueValues.delete(item);
                    }
                }
                // console.log('uniqueValues:--> ', this.uniqueValues);
                let result: any = {};
                this.allData.forEach((item: any) => {
                    if (!result[item.GroupName]) {
                        result[item.GroupName] = {
                            name: item.GroupName,
                            ModerateRiskLevel: 0,
                            CriticalRiskLevel: 0,
                            LowRisklevel: 0
                        };
                    }

                    if (item.RiskMetricLevel === 2) {
                        result[item.GroupName].ModerateRiskLevel++;
                    } else if (item.RiskMetricLevel === 3) {
                        result[item.GroupName].CriticalRiskLevel++;
                    } else if (item.RiskMetricLevel === 1) {
                        result[item.GroupName].LowRisklevel++;
                    }




                });
                for (const groupName in data) {
                    if (data.hasOwnProperty(groupName)) {
                      const group = data[groupName];
                      totalRisk += (group.ModerateRiskLevel || 0) + (group.CriticalRiskLevel || 0) + (group.LowRisklevel || 0);
                    }
                  }

                //   console.log("Total Risk:", totalRisk);
                // console.log('result', result);
                for (let open in result) {
                    this.raGraphData.push({
                        name: result[open].name,
                        ModerateRiskLevel: result[open].ModerateRiskLevel
                            ? result[open].ModerateRiskLevel
                            : 0,
                        CriticalRiskLevel: result[open].CriticalRiskLevel
                            ? result[open].CriticalRiskLevel
                            : 0,
                        LowRiskLevel: result[open].LowRisklevel
                            ? result[open].LowRisklevel
                            : 0,
                    });
                }
                this.raGraphData = this.raGraphData.sort((a:any, b:any) => b.CriticalRiskLevel - a.CriticalRiskLevel);
                // console.log("this.raGraphData",this.raGraphData)
            }
            // this.setChart()
            this.lowData =
                ((this.allData.filter(
                    (data: any) => data.LevelName === 'Low Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1);
            this.moderateData =
               ((this.allData.filter(
                    (data: any) => data.LevelName === 'Moderate Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1);
            this.criticalData =
                ((this.allData.filter(
                    (data: any) => data.LevelName === 'Critical Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1);
            // console.log('this.raGraphData', this.raGraphData);
        } else {
            // console.log('this.viewallresultunit', this.viewall);
            this.raGraphData = [];
            if (this.allData.length > 0) {
                let group: any = {};
                // console.log('cc this.RiskData---->>',this.RiskData)
                let count = 1;
                this.totalCriticaldata = this.allData.filter(
                    (obj: any) => obj.RiskMetricLevel == 3
                );
                this.totalCriticaldata.forEach((item: any) => {
                    group[item.UnitName]
                        ? group[item.UnitName]++
                        : (group[item.UnitName] = 1);
                });
                // console.log('result group:',group);
                // console.log('this.metricGroups: 1st ',this.metricGroups);
                for (let key in group) {
                    this.metricGroups.push({
                        riskName: key,
                        totalCount: group[key],
                        val: count ? count++ : (count = 1),
                    });
                }
                // console.log('this.metricGroups: 2nd',this.metricGroups);
                // this.processData(this.metricGroups);
                for (const item of this.metricGroups.slice(0, 10)) {
                    if (!this.uniqueValues.has(item)) {
                        this.uniqueValues.add(item);
                    } else {
                        this.uniqueValues.delete(item);
                    }
                }
                // console.log('uniqueValuesunit:--> ', this.uniqueValues);
                let result: any = {};
                this.allData.forEach((item: any) => {
                    if (!result[item.UnitName]) {
                        result[item.UnitName] = {
                            name: item.UnitName,
                            ModerateRiskLevel: 0,
                            CriticalRiskLevel: 0,
                            LowRisklevel: 0,
                        };
                    }

                    if (item.RiskMetricLevel === 2) {
                        result[item.UnitName].ModerateRiskLevel++;
                    } else if (item.RiskMetricLevel === 3) {
                        result[item.UnitName].CriticalRiskLevel++;
                    } else if (item.RiskMetricLevel === 1) {
                        result[item.UnitName].LowRisklevel++;
                    }
                });
                // console.log('resultunit', result);
                for (let open in result) {
                    this.raGraphData.push({
                        name: result[open].name,
                        ModerateRiskLevel: result[open].ModerateRiskLevel
                            ? result[open].ModerateRiskLevel
                            : 0,
                        CriticalRiskLevel: result[open].CriticalRiskLevel
                            ? result[open].CriticalRiskLevel
                            : 0,
                        LowRiskLevel: result[open].LowRisklevel
                            ? result[open].LowRisklevel
                            : 0,
                    });

                }
            this.raGraphData = this.raGraphData.sort((a:any, b:any) => b.Count - a.Count);

            }
            this.lowData =
                ((this.allData.filter(
                    (data: any) => data.LevelName === 'Low Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1);
            this.moderateData =
                ((this.allData.filter(
                    (data: any) => data.LevelName === 'Moderate Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1)
            this.criticalData =
                ((this.allData.filter(
                    (data: any) => data.LevelName === 'Critical Risk Level'
                ).length / this.raGraphData.length) || 0).toFixed(1);
        }
    }
    navigatePage() {
        this.DashboardComponent.openMenu('risk-appetite','same');
    }

    getToolTip(value: any, lable: any) {
        return lable + ': ' + value;
    }
    totalRiskLevel(data: any): number {
        return data.ModerateRiskLevel + data.CriticalRiskLevel + data.LowRiskLevel;
      }

}
