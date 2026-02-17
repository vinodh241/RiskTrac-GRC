import { DOCUMENT, getLocaleDateFormat } from '@angular/common';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RiskAppetiteService } from 'src/app/services/risk-appetite/risk-appetite.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

export interface GetPolicyData {
    id: number;
    riskMetric: string;
    units: string;
    measurment: string;
    Low: string;
    Moderate: string;
    High: string;
}

@Component({
    selector: 'app-risk-appetite-view',
    templateUrl: './risk-appetite-view.component.html',
    styleUrls: ['./risk-appetite-view.component.scss']
})
export class RiskAppetiteViewComponent implements OnInit {

    displayedColumns: string[] = ['id', 'risk', 'riskMetric', 'units', 'measurements', 'low', 'moderate', 'high'];
    spanningColumns = ['risk'];
    spans: any[] = [];

    // @ts-ignore
    dataSource: MatTableDataSource<GetPolicyData>;
    policyDetails: any;
    nextPolicyDetails: any;

    @Output() getNextPolicy = new EventEmitter<string>();
    isMax=false;

    constructor(
        private _riskAppetiteService: RiskAppetiteService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<RiskAppetiteViewComponent>,
        @Inject(DOCUMENT) private _document: any,
        @Inject(MAT_DIALOG_DATA) public ParentData: any
    ) { }

    ngOnInit(): void {
        this.getRiskAppetiteView();
        this.minimize()
    }

    maximize() {
        this.isMax = true;
        this.dialogRef.updateSize('100%', '100%');
    }

    minimize() {
        this.isMax = false;
        this.dialogRef.updateSize('93%', '90%');
    }

    getRiskAppetiteView(): void {
        // console.log("this.dialog::", this.dialog);
        // console.log("dataFromP", this.ParentData);
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "colors": {
                        "low": "#008000",
                        "moderate": "#FFFF00",
                        "high": "#FF0000"
                    },
                    "cols": {
                        "col1": "Risk",
                        "col2": "Risk Metric"
                    },
                    "data": [
                        {
                            "col1": "Enterprise Wide Risk",
                            "col2": "Laverage",
                            "Units": "Financial Reporting & Planning",
                            "MeasurmentTypeID": "1",
                            "Low": "<3",
                            "Moderate": ">3 and <4",
                            "High": ">4"
                        },
                        {
                            "col1": "Enterprise Wide Risk",
                            "col2": "SAMA Laverage",
                            "Units": "Financial Reporting & Planning",
                            "MeasurmentTypeID": "1",
                            "Low": "<3",
                            "Moderate": ">3 and <4",
                            "High": ">4"
                        },
                        {
                            "col1": "Credit Risk Appetite",
                            "col2": "Total NPL",
                            "Units": "Financial Reporting & Planning",
                            "MeasurmentTypeID": "2",
                            "Low": "<3",
                            "Moderate": ">3 and <4",
                            "High": ">4"
                        },
                        {
                            "col1": "Credit Risk Appetite",
                            "col2": "Total Exposure LTV",
                            "Units": "Financial Reporting & Planning",
                            "MeasurmentTypeID": "2",
                            "Low": "<3",
                            "Moderate": ">3 and <4",
                            "High": ">4"
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            let nextId = this.ParentData.row.id;
            if (nextId !== this.ParentData.policyList.length) {
                this.nextPolicyDetails = this.ParentData.policyList[nextId];
                console.log("this.nextPolicyDetails::",this.nextPolicyDetails);
            }
            else {
                this.nextPolicyDetails = {
                    FrameworkFileName: ""
                }
            }
            this.policyDetails = data;
            this.process(data);
            this.cacheSpan('risk', (d: any) => d.col1, data);
        } else {
            let nextId = this.ParentData.row.id;
            if (nextId !== this.ParentData.policyList.length) {
                this.nextPolicyDetails = this.ParentData.policyList[nextId];
                // console.log("this.nextPolicyDetails::",this.nextPolicyDetails);
            }
            else {
                this.nextPolicyDetails = {
                    FrameworkFileName: ""
                }
            }
            this._riskAppetiteService.getPolicyDetails(this.ParentData.row.FWID).subscribe(res => {
                next:
                this.policyDetails = res;
                if (res.result.data) {
                    this.cacheSpan('risk', (d: any) => d.col1, res.result.data);
                }
                this.process(res);
            });
        }
    }

    process(data: any): void {
        if (data.success == 1) {
            if (data.result.data.length > 0) {
                let policy = data.result.data;
                if (policy) {
                    let id = 1;
                    let previousRiskNames: String[] = [];
                    policy.forEach((doc: any, index: number) => {
                        previousRiskNames.push(doc.col1);
                        if (previousRiskNames[index == 0 ? index : index - 1] !== doc.col1) {
                            id++;
                        }
                        doc.id = id;
                    })
                    this.dataSource = new MatTableDataSource(data.result.data);
                }
            }
        } else {
            if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getColor(colorCode: string) {
        if (this.policyDetails && this.policyDetails.result) {
            return this.policyDetails.result.colors[colorCode] !== null ? this.policyDetails.result.colors[colorCode] : "#eee";
        }
        else {
            return "#eee";
        }
    }

    getNextPolicyDetails(id: any) {
        let nextPolicyFWID = this.ParentData.policyList[id].FWID;
        this.ParentData.row = this.ParentData.policyList[id];
        this.process2(nextPolicyFWID);
        if (id !== this.ParentData.policyList.length - 1) {
            this.nextPolicyDetails = this.ParentData.policyList[id + 1];
        }
        else {
            this.nextPolicyDetails = {
                FrameworkFileName: ""
            }
        }
    }

    getPrevPolicyDetails(id: any) {
        let prevPolicyFWID = this.ParentData.policyList[id - 2].FWID;
        this.ParentData.row = this.ParentData.policyList[id - 2];
        this.process2(prevPolicyFWID);
        this.nextPolicyDetails = this.ParentData.policyList[id - 1];
    }

    process2(fwid: any) {
        this._riskAppetiteService.getPolicyDetails(fwid).subscribe(res => {
            next:
            console.log("policy details::", res);
            this.policyDetails = res;
            if (res.result.data) {
                this.cacheSpan('risk', (d: any) => d.col1, res.result.data);
            }
            this.process(res);
        });
        console.log('this.process(res);: ', this.policyDetails   )
    }


    cacheSpan(key: any, accessor: any, data: any) {
        this.spans = [];
        let arrayData = [];
        if (environment.dummyData) {
            if (data.result)
                arrayData = data.result.data; // for dummydata
        } else if (data) {
            arrayData = data;
        }
        for (let i = 0; i < arrayData.length;) {
            let count = 1;

            for (let j = i + 1; j < arrayData.length; j++) {
                if (accessor(arrayData[i]) != accessor(arrayData[j])) {
                    break;
                }
                count += 1;
            }

            if (!this.spans[i]) {
                this.spans[i] = {};
            }

            this.spans[i][key] = count;
            i += count;
        }
        // console.log("this.spans::", this.spans);
    }

    getRowSpan(col: string, index: number) {
        // console.log("spans::",this.spans[index], this.spans[index][col])
        return this.spans[index] && this.spans[index][col];
    }

}
