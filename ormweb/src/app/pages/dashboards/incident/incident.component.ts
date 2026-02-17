import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CwPopupComponent } from './incident-popups/cw-popup/cw-popup.component';
import { IncidentCwComponent } from './incident-popups/incident-cw/incident-cw.component';
import { IncidentRecordsComponent } from './incident-popups/incident-records/incident-records.component';
import { ViewallComponent } from './incident-popups/viewall/viewall.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-incident',
    templateUrl: './incident.component.html',
    styleUrls: ['./incident.component.scss'],
})
export class IncidentDashboardComponent implements OnInit {
    // quarterFilter: any;
    listdata: any;
    rejectedRecommendation: any;
    overallCount: any;
    unitWiseData: any;
    allData: any;
    incidentdata: any;
    count: any;
    allIncidentWisedata: any;
    incidentWiseData: any = [];
    OpenIncidentsData: any;
    AllrejectedIncident: any;
    AllrejectedData: any;

    allDataRejected: any;
    sortData: any;
    allWiseData: any;
    list: any = [];
    UnitData: any = [];
    top3Data: any;
    tableData: any;
    sourceTableData: any = [];
    openIncident: any = [];
    allsource: any = [];
    incidentopendata: any;
    incidentOpenRecords: any;
    overduerecords: any;
    overduerecordsPercentage = 0;
    overduedata: any;
    lossdataRecords: any;
    potentialLossCount: any;
    potentialLossCountPercentage: any;
    rejectedRecordCount: any;
    rejectedRecordCountData: any;
    totalRejectedData: any;
    financialLossCount: any;
    operationalCount: any;
    otherCount: any;
    lossAmount: any;
    operationalData: any;
    otherData: any;
    incidentAllData: any;
    RawData: any;
    orgViewData: any;
    incidentTypes: string[] = [];
    totpotential: any;
    totalCount: number = 0;
    rejectedRecordCountData1: any;
    rejectedRecordCountRecords: any;
    openCountData: any;
    openCountDataRecords: any;
    yearData: any;
    quaterData: any;
    levelData: any[] = [];
    totalinternalData: any;
    totalotherData: any;
    totalauditData: any;
    totalcustomerData: any;
    source: any[] = [];
    totalData: any;
    totalopencount: any;
    value: any;
    totaldata: any;
    totalNoOfOpen = 0;
    totalNoOfOverdue = 0;
    totalNoOfRejected = 0
    quarterFilter: any;
    totalRecData = 0;
    totalNoOfClaimClosed = 0;
    totalNoOfClosed = 0;
    currency: any;

    // UnitData: any[];
    constructor(
        public dashboardservice: DashboardService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.dashboardservice.getIncidentData();
        this.dashboardservice.getYearQuarterData();
        this.currency = this.dashboardservice.CurrencyType?.length > 0 ? this.dashboardservice.CurrencyType[0].Currency : '';
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RawData = this.dashboardservice.dashboardIncMaster;
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

                    this.allData = (Array.isArray(this.RawData) ? this.RawData : []).filter(
                        (data: any) =>
                            data.Quater === this.quarterFilter && (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                                data.StatusID != 14 && data.StatusID != 15 &&
                                data.StatusID != 16)
                    ); // Filter the object based on the current quarter
                    // console.log(' this.allData', this.allData);
                    this.incidentAllData = this.allData.length;
                    this.totalCount = 0;
                    this.getIncidentWise();
                    this.getSourceCount();
                    this.overduecountdata();
                    this.rejectedData();
                    this.potentialLossData();
                });
            }
        });
    }

    data = [
        { column1: 'Data 1', column2: 'Data 2', column3: 'Data 3' },
        { column1: 'Data 4', column2: 'Data 5', column3: 'Data 6' },
        { column1: 'Data 7', column2: 'Data 8', column3: 'Data 9' },
    ];

    getIncidentWise() {
        // let UnitData = [];
        // let dt = [];
        // for (let i of this.allData) {
        //     dt.push(i.IncidentUnitName);
        // }
        // let setv = new Set(dt);
        // for (let i of setv) {
        //     let obj = {};
        //     for (let j of this.allData) {
        //         obj = {
        //             Unit: i,
        //             AllDataIncident: this.allData.filter(
        //                 (ele: any) => ele.IncidentUnitName == i
        //             ),
        //             Count: this.allData.filter(
        //                 (ele: any) => ele.IncidentUnitName == i
        //             ).length,
        //             Percent:
        //                 // (this.allData.filter(
        //                 //     (ele: any) => ele.IncidentUnitName == i
        //                 // ).length /
        //                 //     this.allData.length) *
        //                 // 100,
        //                 ((this.allData.filter((ele: any) => ele.IncidentUnitName == i).length / this.allData.length) * 100).toFixed(0).padStart(2, '0') + '%',
        //         };
        //         this.list = obj;
        //     }
        //     UnitData.push(this.list);
        // }
        let UnitData = [];
        let dt = [];
        for (let i of this.allData) {
            dt.push(i.IncidentUnitName);
        }
        let setv = new Set(dt);
        for (let i of setv) {
            let count = this.allData.filter(
                (ele: any) => ele.IncidentUnitName == i
            ).length;
            let percent = ((count / this.allData.length) * 100).toFixed(0);
            let formattedPercent = percent.padStart(2, '0');
            let obj = {
                Unit: i,
                AllDataIncident: this.allData.filter(
                    (ele: any) => ele.IncidentUnitName == i
                ),
                Count: count,
                Percent: formattedPercent,
            };
            UnitData.push(obj);
        }

        // console.log(UnitData);

        this.UnitData = UnitData.sort((a, b) => b.Count - a.Count);
        this.top3Data = this.UnitData.slice(0, 3);
        this.totalData = this.top3Data.length;
    }

    getDecimalData(num: any) {
        return parseFloat(num).toFixed(0.0);
    }

    getSourceCount() {
        //     // let SourceData = [];
        //     console.log("this.allData",this.allData)
        //     if(this.allData.length > 0){
        //     let sourceData: {
        //         AllSourceIncident: any;
        //         SourceCount: number;
        //         Unit: string;
        //     }[] = [
        //         // {
        //             // AllSourceIncident: [],
        //             // SourceCount: 0,
        //             // Unit: '',
        //         // },
        //     ];
        //     let dt = [];
        //     for (let i of this.allData) {
        //         dt.push(i.IncidentSource);
        //     }
        //     let setv = new Set(dt);
        //     for (let i of setv) {
        //         let sourcelist: {
        //             AllSourceIncident: any;
        //             SourceCount: number;
        //             Unit: string;
        //         } = {
        //             AllSourceIncident: [],
        //             SourceCount: 0,
        //             Unit: '',
        //         };
        //         let obj: {
        //             AllSourceIncident: any;
        //             SourceCount: number;
        //             Unit: string;
        //         } = {
        //             AllSourceIncident: [],
        //             SourceCount: 0,
        //             Unit: '',
        //         };
        //         for (let j of this.allData) {
        //             obj = {
        //                 Unit: i,
        //                 AllSourceIncident: this.allData.filter(
        //                     (ele: any) => ele.IncidentSource == i
        //                 ),
        //                 SourceCount: this.allData.filter(
        //                     (ele: any) => ele.IncidentSource == i
        //                 ).length,
        //             };
        //             sourcelist = obj;
        //         }
        //         sourceData.push(sourcelist);
        //     }
        //     sourceData = sourceData.sort((a, b) => b.SourceCount - a.SourceCount);
        //     this.allsource = sourceData;
        //     this.sourceTableData = sourceData.slice(0, 4);
        // }
        let SourceData: any = {};
        this.source = [];
        this.levelData = [];
        // console.log('this.RiskData: ',this.RiskData);

        if (this.allData.length > 0) {
            this.allData.forEach((item: any) => {
                SourceData[item.IncidentSource]
                    ? SourceData[item.IncidentSource]++
                    : (SourceData[item.IncidentSource] = 1);
            });
            // console.log('SourceData', SourceData);

            for (let key in SourceData) {
                this.levelData.push({
                    Unit: key,
                    SourceCount: SourceData[key],
                });
            }
            // console.log('this.levelData: ', this.levelData);
            this.levelData = this.levelData.sort(
                (a, b) => b.SourceCount - a.SourceCount
            );
            this.source = this.levelData.slice(0, 4);
        }
    }

    overduecountdata() {

        this.overduedata = this.allData.filter(
            (a: any, b: any) => a.OverDueRecommendationCount != null && a.OverDueRecommendationCount != 0
        );
        this.overduerecords = this.allData.filter(
            (a: any, b: any) => a.OverDueRecommendationCount != null && a.OverDueRecommendationCount != 0
        ).length;
        this.totalNoOfOverdue = 0
        this.totalNoOfOpen = 0
        this.totalNoOfClaimClosed = 0
        this.totalNoOfClosed = 0
        this.totalRecData = 0
        this.overduerecordsPercentage = 0
        for (const item of this.allData) {
            // console.log("this.allData",this.allData)
            if ("OverDueRecommendationCount" in item && item["OverDueRecommendationCount"] !== null && item["OverDueRecommendationCount"] !== 0) {
                this.totalNoOfOverdue += item["OverDueRecommendationCount"];
            }

        }
        for (const item of this.allData) {
            if ("NoOfClosed" in item && item["NoOfClosed"] !== null && item["NoOfClosed"] !== 0) {
                this.totalNoOfClosed += item["NoOfClosed"];
            }
        }
        for (const item of this.allData) {
            if ("NoOfClaimClosed" in item && item["NoOfClaimClosed"] !== null && item["NoOfClaimClosed"] !== 0) {
                this.totalNoOfClaimClosed += item["NoOfClaimClosed"];
            }
        }

        // return totalNoOfClosed;
        this.totalRecData = this.allData.map((item: any) => item.NoOfRecommendations)?.reduce((a: any, b: any) => a + b, 0) || 0;
        this.overduerecordsPercentage =
            (this.totalNoOfOverdue /
                this.totalRecData) *
            100;
        // console.log(" this.overduerecordsPercentage", this.overduerecordsPercentage)



        this.openCountData = this.allData.filter(
            (a: any) => a.NoOfOpen != null && a.NoOfOpen != 0
        )
        this.totalNoOfOpen = 0
        for (const item of this.allData) {
            if ("NoOfOpen" in item && item["NoOfOpen"] !== null && item["NoOfOpen"] !== 0) {
                this.totalNoOfOpen += item["NoOfOpen"];
            }
        }

        // console.log("Total NoOfOpen values:", this.totalNoOfOpen);

        // return totalOpenCount
        // const lossAmount = this.allData.reduce(
        //     (total: number, item: any) => {
        //         if ("NoOfOpen" in item) {
        //             const value = item["NoOfOpen"];
        //         if (value !== null && value !== 0) {
        //             return total + item.NoOfOpen;
        //         }
        //         return total;
        //     }
        //     0
        // }
        // );
        // console.log("lossAmount",lossAmount)


        this.openCountDataRecords = this.allData.filter(
            (a: any) => a.NoOfOpen != null && a.NoOfOpen > 0
        );
    }

    rejectedData() {
        const rejectedData = [];
        let dt = [];
        for (let i of this.allData) {
            dt.push(i.StatusCode);
        }
        let setv = new Set(dt);
        for (let i of setv) {
            let rejectedlist;
            let obj = {};
            for (let j of this.allData) {
                obj = {
                    // Unit: i,
                    AllrejectedIncident: this.allData.filter(
                        (ele: any) => ele.NoOfRejectedRecommendations != null
                    ),
                    rejectedCount: this.allData.filter(
                        (ele: any) => ele.StatusCode == i
                    ).length,
                };
                rejectedlist = obj;
            }
            rejectedData.push(rejectedlist);
        }
        // this.rejectedRecordCount = this.allData.filter(
        //     (ele: any) => ele.StatusCode == 5
        // ).length;
        // console.log('this.rejjjj', this.rejectedRecordCount);
        // this.rejectedRecordCountData = this.allData.filter(
        //     (ele: any) => ele.StatusCode == 3
        // ).length;
        // console.log('this.rejjjjdata', this.rejectedRecordCountData);
        // this.totalRejectedData =
        //     this.rejectedRecordCount + this.rejectedRecordCountData;

        // this.rejectedRecordCountData1 = this.allData.filter(
        //     (ele: any) =>
        //         ele.NoOfRejectedRecommendations != null &&
        //         ele.NoOfRejectedRecommendations != 0
        // ).length;
        this.rejectedRecordCountRecords = this.allData.filter(
            (ele: any) =>
                ele.NoOfRejectedRecommendations != null &&
                ele.NoOfRejectedRecommendations != 0 && ele.Quater === this.quarterFilter
        );
        // console.log(
        //     'this.rejectedRecordCountData1',
        //     this.rejectedRecordCountData1
        // );
        this.totalNoOfRejected = 0
        for (const item of this.allData) {
            if ("NoOfRejectedRecommendations" in item && item["NoOfRejectedRecommendations"] !== null && item["NoOfRejectedRecommendations"] !== 0) {
                this.totalNoOfRejected += item["NoOfRejectedRecommendations"];
            }
        }
        // console.log("totalNoOfRejected", this.totalNoOfRejected)
    }

    potentialLossData() {
        let potentialArr: any = [];

        this.allData.forEach((element: any) => {
            let arr = element.IncidentType.split(',');

            potentialArr = [...potentialArr, ...arr];
        });
        this.potentialLossCount = potentialArr.filter(
            (x: any) => x == 'Near Miss or Potential Loss'
        ).length;

        this.potentialLossCountPercentage =
            (this.potentialLossCount / this.incidentAllData) * 100;
        // console.log(
        //     '🚀 ~ file: incident.component.ts:293 ~ IncidentDashboardComponent ~ potentialLossData ~ this.potentialLossCountPercentage:',
        //     this.potentialLossCountPercentage
        // );
    }
    processOrgData(data: string[]) {
        for (const item of data) {
            if (!this.orgViewData.has(item)) {
                this.orgViewData.add(item);
            } else {
                this.orgViewData.delete(item);
            }
        }

        // console.log('viewAlldata: view cmpt', this.orgViewData);
    }

    sourceDataPopup(unitName: any) {
        const dialog = this.dialog.open(IncidentRecordsComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.allData.filter(
                    (ele: any) => ele.IncidentSource == unitName
                ),
                title: unitName,
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }

    openDataPopup() {
        let title = 'Open Recommendations';
        const dialog = this.dialog.open(IncidentCwComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.openCountDataRecords,
                title: title,
                dataId: '1',
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }
    overdueDataPopup() {
        let title = 'Overdue Recommendations';
        const dialog = this.dialog.open(IncidentCwComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.overduedata,
                title: title,
                dataId: '2',
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }

    unitDataPopup(unitName: any) {
        const dialog = this.dialog.open(IncidentRecordsComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.allData.filter(
                    (ele: any) =>
                        ele.IncidentUnitName.trim().toLowerCase() ==
                        unitName.trim().toLowerCase()
                ),
                title: unitName,
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }

    RejectedDataPopup() {
        let title = 'Rejected Recommendations';
        const dialog = this.dialog.open(IncidentCwComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.rejectedRecordCountRecords,
                title: title,
                dataId: '3',
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }

    viewAll() {
        const dialog = this.dialog.open(ViewallComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: {
                id: this.UnitData,
            },
        });
        dialog.afterClosed().subscribe((result) => { });
    }

    // clickBars(data:any){
    //     const dialog = this.dialog.open(CwPopupComponent, {
    //         disableClose: true,
    //         maxWidth: '100vw',
    //         maxHeight: '80vh',
    //         // height: '100%',
    //         // width: '100%',
    //         panelClass: 'full-screen-modal',
    //         // data: {
    //             data: this.listdata.filter((ele:any) => ele.IncidentType == "Near Miss or Potential Loss")
    //         // },
    //     });
    //     dialog.afterClosed().subscribe((result) => {
    //     });
    // }
}
