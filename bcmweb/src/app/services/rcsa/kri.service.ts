import { Injectable, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, _closeDialogVia } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface kriTypeStatus {
    Index: number;
    Name: string;
    Action: string;
    Status: boolean;
}

export interface status {
    Index: number;
    Name: string;
    Action: string;
}

export interface measurementFreq {
    Index: number;
    FrequencyID: number;
    Name: string;
    Description: number;
    IsActive: number;
}

export interface RFreq {
    Index: number;
    FrequencyID: number;
    Name: string;
    Description: number;
    InUse: number;
    IsActive: number;
}

export interface kriMasterTV {
    Index: number;
    Value: number;
    ColorCode: string;
    Action: string;
    Status: boolean;
}

export interface KriReportedUnitRow {
    GroupID: number;
    GroupName: string;
    UnitID: number;
    UnitName: string;
    Metrics: MatTableDataSource<any>;
}

@Injectable({
    providedIn: 'root'
})
export class KriService extends RestService {

    public master!: any;
    public masterMF!: MatTableDataSource<measurementFreq>;
    public masterRF!: MatTableDataSource<RFreq>;
    public masterKT!: MatTableDataSource<kriTypeStatus>;
    public masterStatus!: MatTableDataSource<status>;
    public masterTV!: MatTableDataSource<kriMasterTV>;
    public masterThresholdLength!: any;
    public filteredMeasurementFreq!: any;
    public filteredKRIType!: any;

    public kriMeasurments: any
    public kriMeasurement: any;
    public kriMeasurementUnits: any;
    public kriMeasurementGroups: any;
    public kriThresholds: any;
    public kriMeasurmentsReportingFrequncy: any;

    public kriDefine: any;
    public kriGroups!: any;
    public KriUnits!: any;
    public kriDefineThresholds: any;
    public kriDefineReportingFrequencies: any;

    public kriHistoricalData: any;
    public kriHistoricalDataSource!: MatTableDataSource<any>;
    public kriHistoricalSelectedGroup: any;
    public kriHistoricalSelectedUnit: any;
    public kriHistoricalSelectedYear: any;

    public kriReportedData: any;
    public kriReportedSelectedGroup: any;
    public kriReportedSelectedUnit: any;
    public kriReportedSelectedUnitNameRows: KriReportedUnitRow[] = [];

    public kriReportedAllMetricsNo!: number;
    public kriReportedMeasuredMetricsNo!: number;
    public kriReportedNotMeasuredMetricsNo!: number;

    public kriHistoricalReportedData: any;
    public kriHistoricalReportedSelectedGroup: any;
    public kriHistoricalReportedSelectedUnit: any;
    public kriHistoricalReportedSelectedYear: any;
    public kriHistoricalReportedSelectedUnitNameRows: KriReportedUnitRow[] = [];
    public historicalReportPeriodList = [
        {id: '1', name: 'Jan'}, {id: '2', name: 'Feb'}, {id: '3', name: 'Mar'}, {id: '4', name: 'Apr'},
        {id: '5', name: 'May'}, {id: '6', name: 'Jun'}, {id: '7', name: 'Jul'}, {id: '8', name: 'Aug'},
        {id: '9', name: 'Sep'}, {id: '10', name: 'Oct'}, {id: '11', name: 'Nov'}, {id: '12', name: 'Dec'},
        {id: '13', name: 'Jan-Mar'}, {id: '14', name: 'Apr-Jun'}, {id: '15', name: 'Jul-Sep'}, {id: '16', name: 'Oct-Dec'},
        {id: '17', name: 'Jan-Jun'}, {id: '18', name: 'Jul-Dec'}, {id: '19', name: 'Jan-Dec'}
    ];

    public kriHistoricalReportedAllMetricsNo!: number;

    public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotMeasurements: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotHistoricalMeasurements: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public currentYear = new Date().getFullYear();

    constructor(
        private utils: UtilsService,
        private _http: HttpClient,
        private _dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any) {
        super(_http, _dialog)
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        this.saveAsExcelFile(excelBuffer, excelFileName);

    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + '_' + new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString() + EXCEL_EXTENSION);
    }


    public exportAsExcelKriReporting(tableId: string, fileName: string) {
        let element = document.getElementById(tableId);
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, fileName + EXCEL_EXTENSION);
    }



    getKriMaster(): void {
        if (environment.dummyData) {
            this.processKriMaster({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "measurementFrequencies": [
                        {
                            "FrequencyID": 806,
                            "Name": "BmcbyixnrNsochzfIpqklMiAeplrllrksn",
                            "Description": "RpndUncjcxBjngcqsNnszum",
                            "IsActive": 0
                        },
                        {
                            "FrequencyID": 889,
                            "Name": "Py",
                            "Description": "IcsxOc",
                            "IsActive": 0
                        }
                    ],
                    "types": [
                        {
                            "TypeID": 615,
                            "Name": "KfninFlyyqEcDqyuupno",
                            "IsActive": 1
                        },
                        {
                            "TypeID": 786,
                            "Name": "WyiTxtijaoatTokw",
                            "IsActive": 1
                        }
                    ],
                    "reportingFrequencies": [
                        {
                            "FrequencyID": 512,
                            "Name": "Hgll",
                            "Description": "DiRiezciKesxgXkw",
                            "InUse": 1,
                            "IsActive": 0
                        },
                        {
                            "FrequencyID": 682,
                            "Name": "ViwuscackIqguolMqjqnxkxdrjNoabxzfiwf",
                            "Description": "EbgDedzg",
                            "InUse": 0,
                            "IsActive": 1
                        }
                    ],
                    "status": [
                        {
                            "StatusID": 746,
                            "Name": "RzxtgxhbkyTloxTkcvw"
                        },
                        {
                            "StatusID": 833,
                            "Name": "Gblp"
                        }
                    ],
                    "thresholdValue": [
                        {
                            "ThresholdID": 222,
                            "Value": 208,
                            "ColorCode": "UrvrldzhWtqvlvEdvdrdq",
                            "IsActive": 1,
                            "Name": "WbgssbohxmJguppi"
                        },
                        {
                            "ThresholdID": 642,
                            "Value": 9,
                            "ColorCode": "ZoaoecBiVxqcf",
                            "IsActive": 1,
                            "Name": "RheDphwcalPztygbruuFerfrbgowWi"
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            });
        } else {
            this.post("/operational-risk-management/kri/get-kri-master-data", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processKriMaster(res)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.dialog.closeAll()
                // this.router.navigate(['']);
            }, timeout)
        });
    }

    indexKriMaster(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            data.EditMode = false;
            Index++;
        });
        return docs;
    }

    getEnabledThresholdLen() {
        return this.master.thresholdValue.filter((ele: any) => ele.IsActive == true).length;
    }

    processKriMaster(response: any): void {
        this.master = response.result;
        this.masterThresholdLength = this.getEnabledThresholdLen();
        this.filteredMeasurementFreq = this.master.measurementFrequencies.filter((ele: any) => ele.IsActive);
        this.filteredKRIType = this.master.types.filter((ele: any) => ele.IsActive);
        this.masterMF = new MatTableDataSource(this.indexKriMaster(this.master.measurementFrequencies));
        this.masterKT = new MatTableDataSource(this.indexKriMaster(this.master.types));
        this.masterRF = new MatTableDataSource(this.indexKriMaster(this.master.reportingFrequencies));
        this.masterStatus = new MatTableDataSource(this.indexKriMaster(this.master.status));
        this.masterTV = new MatTableDataSource(this.indexKriMaster(this.master.thresholdValue));
        this.gotMaster.next(true);
    }

    setKriMaster(data: any, isEdit: any): void {
        this.post("/operational-risk-management/kri/set-kri-master-data", data).subscribe(res => {
            if (res.success == 1) {
                this.processKriMaster(res);
                if (isEdit) {
                    this.popupInfo("Success", "Record updated successfully");
                } else {
                    this.popupInfo("Success", "Record added successfully");
                }
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
            }
        });
    }

    getKriDefine(): void {
        if (environment.dummyData) {
            this.processKriDefine({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "kriData": [
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "ReportingFrequencyID": 1,
                            "ReportingFrequencyName": "Quaterly",
                            "Target": 0,
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue5": 50,
                            "ThresholdValue4": 40
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "ReportingFrequencyID": 1,
                            "ReportingFrequencyName": "Quaterly",
                            "Target": 100,
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50
                        }
                    ],
                    "groups": [
                        {
                            "GroupID": 1,
                            "GroupName": "sfdfdfd"
                        },
                        {
                            "GroupID": 2,
                            "GroupName": "sfdfdfd"
                        }
                    ],
                    "units": [
                        {
                            "UnitID": 1,
                            "GroupID": 1,
                            "UnitName": "sfdfdfd"
                        },
                        {
                            "UnitID": 2,
                            "GroupID": 2,
                            "UnitName": "sfdfdfd"
                        }
                    ],
                    "measurementFrequencies": [
                        {
                            "FrequencyID": 806,
                            "Name": "BmcbyixnrNsochzfIpqklMiAeplrllrksn",
                            "Description": "RpndUncjcxBjngcqsNnszum",
                            "IsActive": 0
                        },
                        {
                            "FrequencyID": 889,
                            "Name": "Py",
                            "Description": "IcsxOc",
                            "IsActive": 0
                        }
                    ],
                    "types": [
                        {
                            "TypeID": 615,
                            "Name": "KfninFlyyqEcDqyuupno",
                            "IsActive": 1
                        },
                        {
                            "TypeID": 786,
                            "Name": "WyiTxtijaoatTokw",
                            "IsActive": 1
                        }
                    ],
                    "reportingFrequencies": [
                        {
                            "FrequencyID": 512,
                            "Name": "Hgll",
                            "Description": "DiRiezciKesxgXkw",
                            "InUse": 1,
                            "IsActive": 0
                        }
                    ],
                    "status": [
                        {
                            "StatusID": 746,
                            "Name": "RzxtgxhbkyTloxTkcvw",
                            "IsActive": 1
                        },
                        {
                            "StatusID": 833,
                            "Name": "Gblp",
                            "IsActive": 0
                        }
                    ],
                    "thresholdValue": [
                        {
                            "ThresholdID": 222,
                            "Value": 208,
                            "ColorCode": "UrvrldzhWtqvlvEdvdrdq",
                            "IsActive": 1,
                            "Name": "WbgssbohxmJguppi"
                        },
                        {
                            "ThresholdID": 642,
                            "Value": 9,
                            "ColorCode": "ZoaoecBiVxqcf",
                            "IsActive": 1,
                            "Name": "RheDphwcalPztygbruuFerfrbgowWi"
                        }
                    ],
                    "usersList": [
                        {
                            "UserGUID": "5B867DBC-954F-ED11-AE96-000C296CF4F3",
                            "FullName": "dgfsffsffd"
                        }
                    ]

                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/kri/get-kri-definitions", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processKriDefine(res)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    indexKriDefine(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            data.editMode = false;
            Index++;
        });
        return docs
    }

    processKriDefine(response: any) {
        this.kriDefine = response.result.kriData;
        this.kriDefine = new MatTableDataSource(this.indexKriDefine(response.result.kriData));
        this.kriGroups = response.result.groups;
        this.KriUnits = response.result.units;
        this.kriDefineReportingFrequencies = response.result.reportingFrequencies[0];
        this.kriDefineThresholds = response.result.thresholdValue
    }

    deletekridefinition(metric: any): any {
        return this.post("/operational-risk-management/kri/delete-kri-definition", {
            "data":
            {
                "metricID": metric
            },
        });
    }

    getKriMeasurements(): void {
        if (environment.dummyData) {
            this.processMeasurement({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "units": [
                        {
                            "UnitID": 1,
                            "UnitName": "sfdfdfd"
                        },
                        {
                            "UnitID": 2,
                            "UnitName": "sfdfdfd"
                        }
                    ],
                    "groups": [
                        {
                            "GroupID": 1,
                            "GroupName": "sfdfdfd"
                        },
                        {
                            "GroupID": 2,
                            "GroupName": "sfdfdfd"
                        }
                    ],
                    "kriMetricData": [
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 4,
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "Indicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quaterly",
                            "Target": 12,
                            "KriTypeID": 1,
                            "KriType": "Technology",
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50,
                            "MeasurementID": "12",
                            "Period": "Jul-Dec 2022",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 36,
                            "ThresholdID": 1,
                            "ThresholdValue": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "status": "measured",
                            "PreviousScoring": [
                                {
                                    "MetricID": 4,
                                    "PreviousData": [
                                        {
                                            "MeasurementID": 2,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:06.460",
                                            "Measurement": 35.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "#327732",
                                            "ThresholdValue": 7
                                        },
                                        {
                                            "MeasurementID": 3,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:14.600",
                                            "Measurement": 25.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "#327732",
                                            "ThresholdValue": 7
                                        },
                                        {
                                            "MeasurementID": 4,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:22.350",
                                            "Measurement": 15.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "#327732",
                                            "ThresholdValue": 7
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 5,
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "Indicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quaterly",
                            "Target": 12,
                            "KriTypeID": 1,
                            "KriType": "Technology",
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50,
                            "MeasurementID": "12",
                            "Period": "Jul-Dec 2022",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 36,
                            "ThresholdID": 1,
                            "ThresholdValue": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "status": "measured",
                            "PreviousScoring": [
                                {
                                    "MetricID": 5,
                                    "PreviousData": [
                                        {
                                            "MeasurementID": 2,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:06.460",
                                            "Measurement": 35.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "yellow",
                                            "ThresholdValue": 7
                                        },
                                        {
                                            "MeasurementID": 3,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:14.600",
                                            "Measurement": 25.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "yellow",
                                            "ThresholdValue": 7
                                        },
                                        {
                                            "MeasurementID": 4,
                                            "Period": "Nov 2022",
                                            "Date": "2022-12-06T14:45:22.350",
                                            "Measurement": 15.0,
                                            "ThresholdID": 5,
                                            "ColorCode": "yellow",
                                            "ThresholdValue": 7
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            });
        } else {
            this.post("/operational-risk-management/kri/get-kri-metrics-scoring", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.processMeasurement(res)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    setKriMetricsScoring(data: any): void {
        this.post("/operational-risk-management/kri/set-kri-metrics-scoring", { data }).subscribe(res => {
            if (res.success == 1) {
                this.processMeasurement(res)
                this.popupInfo("Success", "KRI Saved Successfully");
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    setKriMetricsReport(data: any): void {
        this.post("/operational-risk-management/kri/set-kri-metrics-report", { data }).subscribe(res => {
            if (res.success == 1) {
                // this.processMeasurement(res)
                this.popupInfo("Success", "KRI Reported Successfully");
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    processMeasurement(response: any) {
        response.result.kriMetricData.forEach((kri: any) => {
            if (kri.Measurement == null) {
                kri.ThresholdValue = ""
                kri.ColorCode = "#FFFFFF"
            }
        });
        this.kriMeasurments = response.result.kriMetricData
        this.kriMeasurement = new MatTableDataSource(response.result.kriMetricData)
        this.kriMeasurementGroups = response.result.groups
        this.kriMeasurementUnits = response.result.units
        this.kriThresholds = response.result.thresholds
        this.kriMeasurmentsReportingFrequncy = response.result.reportingFrequency[0].ReportingFrequency
        this.gotMeasurements.next(true)
    }

    setKri(data: any): any {
        this.post("/operational-risk-management/kri/set-kri-definition", { "data": data }).subscribe(res => {
            if (res.success == 1) {
                this.processKri(res);
                this.popupInfo("Success", res.message)
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });

    }

    processKri(response: any): void {
        console.log(response)
    }

    getKriHistorical(): void {
        if (environment.dummyData) {
            this.processKriHistorical({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "units": [
                        {
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "GroupID": 2
                        },
                        {
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1
                        },
                        {
                            "UnitID": 2,
                            "UnitName": "Financial Accounting",
                            "GroupID": 2
                        }
                    ],
                    "groups": [
                        {
                            "GroupID": 1,
                            "GroupName": "Corporate"
                        },
                        {
                            "GroupID": 2,
                            "GroupName": "Finance"
                        }
                    ],
                    "years": [
                        {
                            "Years": 2021
                        },
                        {
                            "Years": 2022
                        },
                        {
                            "Years": 2023
                        }
                    ],
                    "kriMetricData": [
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Semi Annual",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Apr-Jun 23",
                                    "Date": "2023-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2023
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quarterly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct-Dec 21",
                                    "Date": "2021-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Sep 21",
                                    "Date": "2021-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 2,
                            "UnitName": "Financial Accounting",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Feb 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "March 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jun 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2021
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Annually",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Feb 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "March 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jun 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Semi Annual",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Apr-Jun 23",
                                    "Date": "2023-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2023
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quarterly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct-Dec 21",
                                    "Date": "2021-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul-Sep 21",
                                    "Date": "2021-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 2,
                            "UnitName": "Financial Accounting",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Feb 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "March 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jun 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2021
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Oct 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jul 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Annually",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan-Dec 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Monthly",
                            "scoring": [
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jan 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#ffcc61",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Feb 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#f2cb30",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "March 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Jun 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#56af36",
                                    "Year": 2021
                                },
                                {
                                    "MetricID": 4,
                                    "MeassurementID": "12",
                                    "Period": "Sep 22",
                                    "Date": "2022-11-18T12:59:00.000Z",
                                    "Measurement": 36,
                                    "ThresholdID": 1,
                                    "ThresholdValue": 3,
                                    "ColorCode": "#fffHHH",
                                    "Year": 2022
                                }
                            ]
                        },
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/kri/get-kri-historical-scoring", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    console.log("kri service", res);
                    this.processKriHistorical(res)
                } else {
                    console.log("kri service error");
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    private processKriHistorical(response: any) {
        this.kriHistoricalData = response.result || [];
        this.kriHistoricalSelectedGroup = '';
        this.kriHistoricalSelectedUnit = '';
        this.kriHistoricalSelectedYear = (response.result?.years.some((x: any) => x.Years == this.currentYear)) ? this.currentYear : response.result?.years[0].Years;
        this.getKriHistoricalMetricsData();
    }

    getKriHistoricalMetricsData(): any {
        let data: any = (this.kriHistoricalData?.kriMetricData)? JSON.parse(JSON.stringify(this.kriHistoricalData.kriMetricData)) : [];
        data && data.map((x: any) => {
            x.scoring = x.scoring.filter((y: any) => y.Year == this.kriHistoricalSelectedYear);
        });
        this.kriHistoricalDataSource = new MatTableDataSource(this.generateIndex(data) || []);
        this.gotHistoricalMeasurements.next(true);
    }

    private generateIndex(data: any) {
        data.map((x: any, index: number) => {
            x['Index'] = index + 1;
        })
        return data;
    }

    getKriReport(): void {
        if (environment.dummyData) {
            this.processKriReport({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "units": [
                        {
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "GroupID": 2
                        },
                        {
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1
                        },
                        {
                            "UnitID": 2,
                            "UnitName": "Financial Accounting",
                            "GroupID": 2
                        }
                    ],
                    "groups": [
                        {
                            "GroupID": 1,
                            "GroupName": "Corporate"
                        },
                        {
                            "GroupID": 2,
                            "GroupName": "Finance"
                        }
                    ],
                    "reportingPeriod": [
                        {
                            "ReportingPeriod": "Oct-Dec 2022"
                        }
                    ],
                    "reportingFrequency": [
                        {
                            "ReportingFrequency": "Quaterly"
                        }
                    ],
                    "kriMetricData": [
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Business",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "Target": "50",
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "Period": "Nov 22",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 0,
                            "ThresholdID": 1,
                            "Value": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "StatusName": "Not Measured",			// API will derive it.
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 1,
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "UnitID": 1,
                            "UnitName": "Test",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "Target": "50", // API will derive it.
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "Period": "Nov 22",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 36,
                            "ThresholdID": 1,
                            "Value": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "StatusName": "Measured",			// API will derive it.
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50
                        },
                        {
                            "KriCode": "KRI-002",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "Target": "50",
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "Period": "Nov 22",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 36,
                            "ThresholdID": 1,
                            "Value": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "StatusName": "Measured",			// API will derive it.
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50
                        },
                        {
                            "KriCode": "KRI-003",
                            "MetricID": 1,
                            "GroupID": 2,
                            "GroupName": "Financial Accounting",
                            "UnitID": 2,
                            "UnitName": "Test",
                            "KeyRiskIndicator": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequencyName": "Quaterly",
                            "Target": "50", // API will derive it.
                            "KriTypeID": 1,
                            "KriTypeName": "Technology",
                            "Period": "Nov 22",
                            "Date": "2022-11-18T12:59:00.000Z",
                            "Measurement": 36,
                            "ThresholdID": 1,
                            "Value": 3,
                            "ColorCode": "#fffHHH",
                            "Remarks": "remark value",
                            "StatusName": "Measured",			// API will derive it.
                            "ThresholdValue1": 10,
                            "ThresholdValue2": 20,
                            "ThresholdValue3": 30,
                            "ThresholdValue4": 40,
                            "ThresholdValue5": 50
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/kri/get-kri-report", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    console.log("kri service", res);
                    this.processKriReport(res)
                } else {
                    console.log("kri service error");
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    private processKriReport(response: any) {
        this.kriReportedData = response.result;
        this.kriReportedSelectedGroup = '';
        this.kriReportedSelectedUnit = '';
        this.getKriReportedMetricsData();
    }

    getKriReportedMetricsData() {
        let list: KriReportedUnitRow[] = [];

        if ((!this.kriReportedSelectedGroup && !this.kriReportedSelectedUnit)) {
            this.kriReportedData?.groups.forEach((x: any) => {
                this.kriReportedData?.units.filter((y: any) => y.GroupID == x.GroupID).forEach((z: any) => {
                    list.push(this.generateKriReportedMetricData(z));
                })
            })
        } else if ((this.kriReportedSelectedGroup && !this.kriReportedSelectedUnit)) {
            this.kriReportedData?.units.filter((y: any) => y.GroupID == this.kriReportedSelectedGroup).forEach((z: any) => {
                list.push(this.generateKriReportedMetricData(z));
            })
        } else {
            let selectedUnit = this.kriReportedData?.units.find((y: any) => y.GroupID == this.kriReportedSelectedGroup && y.UnitID == this.kriReportedSelectedUnit);
            list.push(this.generateKriReportedMetricData(selectedUnit));
        }

        let allMetrics = list.map(item => item.Metrics.data).flat();
        this.kriReportedAllMetricsNo = allMetrics.length;
        this.kriReportedMeasuredMetricsNo = allMetrics.filter((data: any) => data.StatusName == 'Measured').length;
        this.kriReportedNotMeasuredMetricsNo = allMetrics.filter((data: any) => data.StatusName != 'Measured').length;
        this.kriReportedSelectedUnitNameRows = list;
    }

    private generateKriReportedMetricData(z: any): KriReportedUnitRow {
        let row = {} as KriReportedUnitRow;
        row.GroupID = z.GroupID;
        row.GroupName = this.kriReportedData?.groups.find((grp: any) => grp.GroupID == row.GroupID).GroupName;
        row.UnitID = z.UnitID;
        row.UnitName = z.UnitName;

        let unitMetricList = this.kriReportedData?.kriMetricData.filter((a: any) => a.GroupID == row.GroupID && a.UnitID == row.UnitID);
        row.Metrics = new MatTableDataSource(unitMetricList);
        return row;
    }

    getKriHistoricalReport(): void {
        if (environment.dummyData) {
            this.processKriHistoricalReport({
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "units": [
                        {
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "GroupID": 2
                        },
                        {
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1
                        },
                        {
                            "UnitID": 2,
                            "UnitName": "Financial Accounting",
                            "GroupID": 2
                        }
                    ],
                    "groups": [
                        {
                            "GroupID": 1,
                            "GroupName": "Corporate"
                        },
                        {
                            "GroupID": 2,
                            "GroupName": "Finance"
                        }
                    ],
                    "years": [
                        {
                            "Years": 2022
                        },
                        {
                            "Years": 2021
                        }
                    ],
                    "reportingFrequency": [
                        {
                            "Name": "Quarterly"
                        }
                    ],
                    "kriMetricData": [
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 4,
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "Description": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quaterly",
                            "Target": "50",
                            "KRITypeID": "2",
                            "KRIType": "Technologyies",
                            "previousData": [
                                {
                                    "ReportID": 2,
                                    "Period": "Oct-Dec 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Oct 22",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Oct 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Oct 22",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jan 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 33.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Oct 22",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jan-Dec 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Oct 22",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jul-Sep 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Jul 22",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jul-Dec 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Jul 22",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-002",
                            "MetricID": 5,
                            "UnitID": 1,
                            "UnitName": "Business",
                            "GroupID": 1,
                            "GroupName": "Corporate",
                            "Description": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quaterly",
                            "Target": "50",
                            "KRITypeID": "2",
                            "KRIType": "Technologyies",
                            "previousData": [
                                {
                                    "ReportID": 2,
                                    "Period": "Oct-Dec 2021",
                                    "Date": "2021-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Dec 21",
                                    "Year": 2021
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jul-Sep 2021",
                                    "Date": "2021-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Sep 2021",
                                    "Year": 2021
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jan-Mar 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Jan 22",
                                    "Year": 2022
                                }
                            ]
                        },
                        {
                            "KriCode": "KRI-001",
                            "MetricID": 4,
                            "UnitID": 1,
                            "UnitName": "Treasury",
                            "GroupID": 2,
                            "GroupName": "Finance",
                            "Description": "dfdfdfgfdg",
                            "MeasurementFrequencyID": 1,
                            "MeasurementFrequency": "Quaterly",
                            "Target": "50",
                            "KRITypeID": "2",
                            "KRIType": "Technologyies",
                            "previousData": [
                                {
                                    "ReportID": 2,
                                    "Period": "Oct-Dec 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Dec 2022",
                                    "Year": 2022
                                },
                                {
                                    "ReportID": 2,
                                    "Period": "Jul-Sep 2022",
                                    "Date": "2022-12-08T14:05:48.887",
                                    "Measurement": 45.0,
                                    "ThresholdID": 5,
                                    "ThresholdValue": 7,
                                    "ColorCode": "#327732",
                                    "Remark": "Jul Sep 22",
                                    "Year": 2022
                                }
                            ]
                        }
                    ]
                },
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                },
                "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
            })
        } else {
            this.post("/operational-risk-management/kri/get-kri-historical-report", {}).subscribe(res => {
                next:
                if (res.success == 1) {
                    console.log("kri service", res);
                    this.processKriHistoricalReport(res)
                } else {
                    console.log("kri service error");
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    private processKriHistoricalReport(response: any) {
        this.kriHistoricalReportedData = response.result;
        this.kriHistoricalReportedSelectedGroup = '';
        this.kriHistoricalReportedSelectedUnit = '';
        this.kriHistoricalReportedSelectedYear = (response.result?.years.some((x: any) => x.Years == this.currentYear)) ? this.currentYear : response.result?.years[0].Years;
        this.getKriHistoricalReportedMetricsData();
    }

    getKriHistoricalReportedMetricsData() {
        let list: KriReportedUnitRow[] = [];

        if ((!this.kriHistoricalReportedSelectedGroup && !this.kriHistoricalReportedSelectedUnit)) {
            this.kriHistoricalReportedData?.groups.forEach((x: any) => {
                this.kriHistoricalReportedData?.units.filter((y: any) => y.GroupID == x.GroupID).forEach((z: any) => {
                    list.push(this.generateKriHistoricalReportedMetricData(z));
                })
            })
        } else if ((this.kriHistoricalReportedSelectedGroup && !this.kriHistoricalReportedSelectedUnit)) {
            this.kriHistoricalReportedData?.units.filter((y: any) => y.GroupID == this.kriHistoricalReportedSelectedGroup).forEach((z: any) => {
                list.push(this.generateKriHistoricalReportedMetricData(z));
            })
        } else {
            let selectedUnit = this.kriHistoricalReportedData?.units.find((y: any) => y.GroupID == this.kriHistoricalReportedSelectedGroup && y.UnitID == this.kriHistoricalReportedSelectedUnit);
            list.push(this.generateKriHistoricalReportedMetricData(selectedUnit));
        }

        let allMetrics = list.map(item => item.Metrics.data).flat();
        this.kriHistoricalReportedAllMetricsNo = allMetrics.length;

        this.kriHistoricalReportedSelectedUnitNameRows = list;
    }

    private generateKriHistoricalReportedMetricData(z: any): KriReportedUnitRow {
        let row = {} as KriReportedUnitRow;
        row.GroupID = z.GroupID;
        row.GroupName = this.kriHistoricalReportedData?.groups.find((grp: any) => grp.GroupID == row.GroupID).GroupName;
        row.UnitID = z.UnitID;
        row.UnitName = z.UnitName;

        let cloneData = JSON.parse(JSON.stringify(this.kriHistoricalReportedData?.kriMetricData
            .filter((a: any) => a.GroupID == row.GroupID && a.UnitID == row.UnitID)));

        cloneData.map((x: any) => {
            x.previousData = x.previousData.filter((y: any) => y.Year == this.kriHistoricalReportedSelectedYear);
            return x;
        });

        cloneData.map((x: any) => {
            let periodPropertyNames: string[][] = [];
            x.previousData = x.previousData.map((y: any) => {
                let periodId = this.historicalReportPeriodList.find((x: any) => x.name == (y['Period'].substring(0, y['Period'].length - 4).trim()))?.id || '';
                y['Period'.concat(periodId)] = y['Period'];
                y['Date'.concat(periodId)] = y['Date'];
                y['Measurement'.concat(periodId)] = y['Measurement'];
                y['ThresholdValue'.concat(periodId)] = y['ThresholdValue'];
                y['Remark'.concat(periodId)] = y['Remark'];
                delete y['Period'];
                delete y['Date'];
                delete y['Measurement'];
                delete y['ThresholdValue'];
                delete y['Remark'];
                periodPropertyNames.push(Object.keys(y).filter(x => x.includes('Period') || x.includes('Date') || x.includes('Measurement') || x.includes('ThresholdValue') || x.includes('Remark')));
                return y;
            });
            x['periodPropertyNames'] = periodPropertyNames.flat();
            return x.previousData;
        });

        row.Metrics = new MatTableDataSource(cloneData);
        return row;
    }

}
