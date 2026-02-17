import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
export interface QuarterList {
    quarterdata: string;
    totaldata: number;
}

@Component({
    selector: 'app-ofl-grph-popup',
    templateUrl: './ofl-grph-popup.component.html',
    styleUrls: ['./ofl-grph-popup.component.scss'],
})
export class OflGrphPopupComponent implements OnInit {
    displayedColumns: string[] = [
        'Position',
        'IncidentGroup',
        'IncidentUnit',
        'LossAmount',
    ];
    dataSource: MatTableDataSource<QuarterList> = new MatTableDataSource();
    RawData: any;
    listdata: any;
    unitDataFilter: any;
    metricGroupData1: any;
    quarterId: any;
    duplicatedJson: any[] = [];
    id: any;
    mappedData: any;
    modifiedData: any;
    spans: any = [];
    currency = environment.currency;

    constructor(
        public dashboardservice: DashboardService,
        @Inject(MAT_DIALOG_DATA) public parent: any
    ) {}

    ngOnInit(): void {
        this.dashboardservice.gotincidentDashboardMaster.subscribe((value) => {
            if (value == true) {
                this.RawData = this.dashboardservice.dashboardIncMaster;
                // this.currency = this.RawData[0]?.Currency;
                let currentDate = new Date(); // Get the current date

                let currentQuarter =
                    'Q' +
                    Math.ceil((currentDate.getMonth() + 1) / 3) +
                    '-' +
                    currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter

                this.listdata = this.RawData.filter(
                    (data: any) =>
                    (data.StatusID != 1 && data.StatusID != 11 && data.StatusID != 12 && data.StatusID != 17 && data.StatusID != 18 && data.StatusID != 13 &&
                         data.StatusID != 14 && data.StatusID != 15 &&
                         data.StatusID != 16)
                );

                // const duplicatedJson: any[] = [];

                this.RawData.forEach((incident: any) => {
                    const incidentTypes = incident.IncidentType.split(',');
                    incidentTypes.forEach((type: any) => {
                        const duplicatedIncident = { ...incident };
                        duplicatedIncident.IncidentType = type.trim();
                        this.duplicatedJson.push(duplicatedIncident);
                    });
                });

                console.log(this.duplicatedJson);
                // this.countIncidentTypes(this.listdata)
            }
        });
        this.id = this.parent.id;
        // console.log("id",this.id)
        this.quarterId = this.parent.quarter;
        this.unitDataFilter = this.duplicatedJson.filter(
            (ele: any) =>
                ele.IncidentType == this.id && ele.Quater == this.quarterId
        );

        // this.lossFilter = this.RawData.filter((ele:any)=> this.quarterId && this.dataSource && this.)
        // console.log('this.unitDataFilter', this.unitDataFilter);
        // console.log('this.quarterId', this.quarterId);
        this.getincidentData();
    }

    getincidentData() {
        const currentDate = new Date();
        const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);

        const previousQuarters: string[] = [];
        let previousQuartersLossAmount: any = {};

        for (let i = 0; i <= 3; i++) {
            let quarter = currentQuarter - i;
            let year = currentDate.getFullYear();

            if (quarter <= 0) {
                quarter += 4;
                year--;
            }

            const quarterKey = `Q${quarter}-${year.toString().slice(-2)}`;
            previousQuarters.push(quarterKey);
            previousQuartersLossAmount[quarterKey] = {};
        }
        // const filteredIncidents = this.unitDataFilter.filter(
        //     (incident:any) =>
        //         incident.LossAmount != null &&
        //         incident.GroupName != null &&
        //         incident.IncidentUnitName != null
        // );

        // const result = filteredIncidents.map((incident:any) => ({
        //     groupName: incident.GroupName,
        //     incidentName: incident.IncidentUnitName,
        //     lossAmount: incident.LossAmount,
        // }));
        // this.unitDataFilter.forEach((incident: any) => {
        //     if (
        //         incident.LossAmount != null &&
        //         incident.GroupName != null &&
        //         incident.IncidentUnitName != null
        //     ) {
        //         const groupName = incident.GroupName;
        //         if (!uniqueEntries[groupName]) {
        //             uniqueEntries[groupName] = [];
        //         }
        //         uniqueEntries[groupName].push({
        //             incidentName: incident.IncidentUnitName,
        //             lossAmount: incident.LossAmount,
        //         });
        //     }
        // });

        // const uniqueEntries: any = {};

        // this.unitDataFilter.forEach((incident: any) => {
        //     if (
        //         incident.LossAmount != null &&
        //         incident.GroupName != null &&
        //         incident.IncidentUnitName != null
        //     ) {
        //         const groupName = incident.GroupName;
        //         const incidentUnitName = incident.IncidentUnitName;
        //         const lossAmount = incident.LossAmount;

        //         if (!uniqueEntries[groupName]) {
        //             uniqueEntries[groupName] = {};
        //         }

        //         if (!uniqueEntries[groupName][incidentUnitName]) {
        //             uniqueEntries[groupName][incidentUnitName] = lossAmount;
        //         }
        //     }
        // });
        // const uniqueEntries = {};
        const uniqueEntries: any = new Map();
        this.unitDataFilter.forEach((incident: any) => {
            if (
                incident.LossAmount != null &&
                incident.GroupName != null &&
                incident.IncidentUnitName != null
            ) {
                const groupName = incident.GroupName;
                const incidentName = incident.IncidentUnitName;
                const lossAmount = incident.LossAmount;

                if (!uniqueEntries.has(groupName)) {
                    uniqueEntries.set(groupName, new Map());
                }

                const groupMap = uniqueEntries.get(groupName);
                if (!groupMap.has(incidentName)) {
                    groupMap.set(incidentName, 0);
                }

                groupMap.set(
                    incidentName,
                    groupMap.get(incidentName) + lossAmount
                );
            }
        });

        const result: any = {};
        uniqueEntries.forEach((groupMap: any, groupName: any) => {
            result[groupName] = [];
            groupMap.forEach((totalLossAmount: any, incidentName: any) => {
                result[groupName].push({
                    incidentName,
                    lossAmount: totalLossAmount,
                });
            });
        });

        // console.log(result);
        // // console.log(uniqueEntries);
        // console.log('uniquee', uniqueEntries);
        let obj: any = [];
        for (let i in result) {
            obj.push({
                name: i,
                incidents: result[i],
            });
        }
        // console.log('obj', obj);

        this.modifiedData = obj.flatMap((item: any) =>
            item.incidents.map((incident: any) => ({
                ...incident,
                groupName: item.name,
            }))
        );
        this.cacheSpan('groupName', (d: any) => d.groupName, this.modifiedData);
        console.log(this.modifiedData);
    }

    getRowSpan(col: any, index: any) {
        return this.spans[index] && this.spans[index][col];
    }

    cacheSpan(key: any, accessor: any, DATA: any) {
        for (let i = 0; i < DATA.length; ) {
            let currentValue = accessor(DATA[i]);
            let count = 1;
            for (let j = i + 1; j < DATA.length; j++) {
                if (currentValue !== accessor(DATA[j])) {
                    break;
                }
                count++;
            }
            if (!this.spans[i]) {
                this.spans[i] = {};
            }
            this.spans[i][key] = count;
            i += count;
        }
    }
    getRowSerialNumber(index: number): number {
        let serialNumber = 0;
        for (let i = 0; i <= index; i++) {
          const rowSpan = this.getRowSpan('groupName', i);
          if (rowSpan === 1) {
            serialNumber= serialNumber+1;
          } else if (rowSpan > 1) {
            serialNumber = serialNumber+1;
          }
        }
        return serialNumber;
      }

      getBackgroundColor(index: number): number | string {
        let serialNumber = 0;
        for (let i = 0; i <= index; i++) {
          const rowSpan = this.getRowSpan('groupName', i);
          if (rowSpan === 1 || rowSpan > 1) {
            serialNumber = serialNumber + 1;
          }
        }
        if (serialNumber % 2 === 0) {
          return '#f2f2f2';
        } else {
          return '';
        }
      }

}
