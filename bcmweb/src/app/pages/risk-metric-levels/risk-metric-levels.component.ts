import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RiskMetricLevelsService } from 'src/app/services/risk-metric-levels/risk-metric-levels.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

export interface RiskMetricData {
    Index: number;
    RiskMetricLevelID: string;
    RiskMetricLevel: string;
    RiskMetricZone: string;
    ColorCode: string;
    DefaultColorCode: string;
    Name: string;
    Description: string;
    CreatedDate: Date;
}

@Component({
    selector: 'app-risk-metric-levels',
    templateUrl: './risk-metric-levels.component.html',
    styleUrls: ['./risk-metric-levels.component.scss']
})
export class RiskMetricLevelsComponent implements OnInit {

    displayedColumns: string[] = ['Index', 'Name', 'RiskMetricZone', 'ColorCode', 'Description', 'CreatedDate'];

    // @ts-ignore
    dataSource: MatTableDataSource<RiskMetricData>;
    colorData: any;

    constructor(
        public dialog: MatDialog,
        public utils: UtilsService,
        private service: RiskMetricLevelsService,
        private dataService: DashboardService,
        @Inject(DOCUMENT) private _document:any
    ) { }

    ngOnInit(): void {
        this.getRiskMetricList();
    }

    getRiskMetricList(): void{
        if(environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "riskMetricData": [
                        {
                            "RiskMetricLevelID": "2",
                            "FWID" : "1",
                            "RiskMetricLevel" : "1",
                            "RiskMetricZone" : "Green Zone",
                            "ColorCode": "#008000",
                            "DefaultColorCode": "#008000",
                            "Name": "Low Risk Level",
                            "Description": "Low Risk Level",
                            "CreatedDate": "2022-09-13 23:29:45.017"
                        },
                        {
                            "RiskMetricLevelID": "3",
                            "FWID" : "1",
                            "RiskMetricLevel" : "2",
                            "RiskMetricZone" : "Yellow Zone",
                            "ColorCode": "#FFFF00",
                            "DefaultColorCode": "#FFFF00",
                            "Name": "Moderate Risk Level",
                            "Description": "Moderate Risk Level",
                            "CreatedDate": "2022-09-13 23:29:45.017"
                        },
                        {
                            "RiskMetricLevelID": "4",
                            "FWID" : "1",
                            "RiskMetricLevel" : "3",
                            "RiskMetricZone" : "Red Zone",
                            "ColorCode": "#FF0000",
                            "DefaultColorCode": "#FF0000",
                            "Name": "Critical Risk Level",
                            "Description": "Critical Risk Level",
                            "CreatedDate": "2022-09-13 23:29:45.017"
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.process(data);
        } else {
            this.service.getRiskMetricLevels().subscribe(res => {
                next:
                this.process(res);
            });
        }
    }

    process(data:any):void {
        if (data.success == 1) {
            if (data.result.riskMetricData.length > 0) {
                let policy = data.result.riskMetricData;
                this.colorData = data.result.riskMetricData;
                this.dataService.riskMetricData = this.colorData;
               
                if (policy) {
                    let Index = 0
                    policy.forEach((doc: any) => {
                        Index++
                        doc.Index = Index
                    })
                    this.dataSource = new MatTableDataSource(data.result.riskMetricData);
                }
            }
        } else {
            if(data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    save(): void {
        let arr:any = [];
        this.dataSource.data.forEach(level => {
            arr.push({"riskMetricLevelId": level.RiskMetricLevelID, "colorCode": level.ColorCode});
        });

        this.service.setRiskMetricLevels(arr).subscribe(res => {
            next:
            if (res.success == 1) {
                if (res.result.riskMetricData.length > 0) {
                    this.dataSource = new MatTableDataSource(res.result.riskMetricData);
                }
                this.saveSuccess()
            } else {
                if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
            }
        })
    }

    saveSuccess(): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "success",
            data: {
                title: "Success",
                content: "Risk Metric Levels saved successfully."
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close()
                this.getRiskMetricList()
            }, timeout)
        });
    }

    cancel(): void {
        this.getRiskMetricList()
    }
}
