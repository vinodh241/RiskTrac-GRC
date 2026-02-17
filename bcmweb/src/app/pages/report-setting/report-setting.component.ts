import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RiskReportsService } from 'src/app/services/risk-reports/risk-reports.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { each } from 'highcharts';

export interface ReportSetting {
    idx: any;
    cycle: boolean,
    cycle1: boolean,
    cycle2: boolean,
    riskMetric: {
        green: boolean,
        yellow: boolean,
        red: boolean
    },
    escalation: string,
    reportAction: string
}

@Component({
    selector: 'app-report-setting',
    templateUrl: './report-setting.component.html',
    styleUrls: ['./report-setting.component.scss']
})
export class ReportSettingComponent implements OnInit {
    T0: number = 0
    T1: number = 0
    T2: number = 0

    reportingAction: string = ''
    escalation: string = ''
    zone: string = ''

    checkedT: boolean = false
    checkedT1: boolean = false
    checkedT2: boolean = false

    constructor(
        public dialog: MatDialog,
        private service: RiskReportsService,
        private utils: UtilsService,
        @Inject(DOCUMENT) private document:any
    ) { }

    displayedColumns: string[] = ['idx', 'cycle', 'cycle-1', 'cycle-2', 'risk-metric', 'escalation', 'is-report-action-mandatory', 'report-action', 'action'];
    dataSource: any[] = [];
    zones: any[] = [];

    ngOnInit(): void {
        this.getRiskReportSetting();
    }

    getRiskReportSetting(): any {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "reportSettingsData": [
                        {
                            "T0": 1,
                            "T1": 1,
                            "T2": 0,
                            "RiskMetricLevelID": "1",
                            "RiskMetricLevelName": "Green Zone",
                            "Escalation": "No escalation.",
                            "Action": "No action required."
                        },
                        {
                            "T0": 1,
                            "T1": 1,
                            "T2": 0,
                            "RiskMetricLevelID": "1",
                            "RiskMetricLevelName": "Green Zone",
                            "Escalation": "No escalation.",
                            "Action": "No action required."
                        },
                        {
                            "T0": 1,
                            "T1": 1,
                            "T2": 1,
                            "RiskMetricLevelID": "1",
                            "RiskMetricLevelName": "Green Zone",
                            "Escalation": "No escalation.",
                            "Action": "No action required."
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            }
            this.process(data);
        } else {
            this.service.getRiskReportsSetting().subscribe(res => {
                this.process(res)
            })
        }
    }

    process(data: any): void {
        if (data.success == 1) {
            let res = []
            this.zones = data.result.riskMetricData
            if (data.result.reportSettingsData.length > 0) {
                let docs = data.result.reportSettingsData
                if (docs) {
                    let idx = 0
                    docs.forEach((doc: any) => {
                        idx++
                        doc.idx = idx
                        this.zones.forEach((zone:any) => {
                            if(zone.RiskMetricLevelID == doc.RiskMetricLevelID)
                                doc.ColorCode = zone.ColorCode
                        });
                    })
                    res = data.result.reportSettingsData
                }
            } else {
                if (data.error.errorCode && data.error.errorCode == 'TOKEN_EXPIRED')
                    console.log("Token Expired")
            }
            this.dataSource = res;
        } else {
            if(data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this.document);
        }
    }

    addRow(): void {
        this.dataSource.push({
            "T0": false,
            "T1": false,
            "T2": false,
            "RiskMetricLevelID": "1",
            "RiskMetricLevelName": "Green Zone",
            "Escalation": "",
            "IsEscalationMandatory": false,
            "IsActionMandatory": false,
            "Action": ""
        })
        this.refreshTable()
    }

    removeRow(row: any): void {
        let idx = this.dataSource.indexOf(row);
        this.dataSource.splice(idx, 1);
        this.refreshTable();
    }

    isChecked(row: any, level: any){
        return row.RiskMetricLevel === level.RiskMetricLevel;
    }

    refreshTable(): void {
        let idx = 0;
        this.dataSource.forEach((row: any) => {
            idx++;
            row.idx = idx;
        });
        this.dataSource = [...this.dataSource];
    }

    save(): void {
        this.service.setRiskReportsSetting(this.dataSource, this.zones).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess();
            } else {
                if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this.document);
                //this.saveerror = res.error.errorMessage;
            }
            error:
            console.log("err::", "error");
        });
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
                content: "Report Setting saved successfully."
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.getRiskReportSetting();
            }, timeout)
        });
    }

    cancel(): void {
        this.getRiskReportSetting();
    }

    // cleanData(): void {
    //     this.zone = ''
    //     this.escalation = ''
    //     this.reportingAction = ''
    // }

    // closeButton(): void {
    //     // this.addUser = false
    //     this.cleanData()
    // }

    // checkedBoxT2() {
    //     if (this.checkedT2) {
    //         this.checkedT2 !== this.checkedT2
    //         this.T2 = 0
    //     } else {
    //         this.checkedT2 !== this.checkedT2
    //         this.T2 = 1
    //     }
    // }

    // checkedBoxT() {
    //     if (this.checkedT) {
    //         this.checkedT !== this.checkedT
    //         this.T0 = 0
    //     } else {
    //         this.checkedT !== this.checkedT
    //         this.T0 = 1
    //     }
    // }

    // checkedBoxT1() {
    //     if (this.checkedT1) {
    //         this.checkedT1 !== this.checkedT1
    //         this.T1 = 0
    //     } else {
    //         this.checkedT1 !== this.checkedT1
    //         this.T1 = 1
    //     }
    // }
}
