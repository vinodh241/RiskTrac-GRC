import { Injectable, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, _closeDialogVia } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { RowSpanComputer } from 'src/app/pages/rcsa/schedule-assessments/inprogress-schedule-assessments/row-span-computer';
import { color } from 'highcharts';
import { isKriInDateRange } from 'src/app/core-shared/commonFunctions';

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
    IsExpanded: boolean;
}
export interface reviewFrequencies {
    ReviewerID: number | null;
    UserGUID: string;
    FullName: string;
    IsActive: number;
    IsDeleted: number;
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
    public measurementFreqLength!: any;
    public kriTypeLength!: any;
    public filteredMeasurementFreq!: any;
    public filteredKRIType!: any;
    public kriMeasurments: any
    public kriData: any
    // public dataNotMeasured:any = false;
    public powerUser: any;
    // public reportedCount:any = 0;
    public unitCount: any = 0;
    public kriMeasurementold: any;
    public kriMeasurement: any;
    public kriMeasurementUnits: any;
    public kriMeasurementGroups: any;
    public kriThresholds: any;
    public kriReviewerUser: any;
    public kriMeasurmentsReportingFrequncy: any;
    public kriMeasurmentsReportingEndDate: any;
    public kriDefine: any;
    public kriGroups!: any;
    public KriUnits!: any;
    public kriDefineThresholds: any[] = [];
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
    public kriReportedMetricsNo!: number;
    public kriApprovedMetricsNo!: number;
    public kriRejectedMetricsNo!: number;
    public kriReportedNotMeasuredMetricsNo!: number;
    public emailTrigger: any
    public kriHistoricalReportedData: any;
    public kriHistoricalReportedSelectedGroup: any;
    public kriHistoricalReportedSelectedUnit: any;
    public kriHistoricalReportedSelectedYear: any;
    public kriHistoricalReportedSelectedUnitNameRows: KriReportedUnitRow[] = [];
    public kriThresholdData: any;
    public historicalReportPeriodList = [
        { id: '1', name: 'Jan' }, { id: '2', name: 'Feb' }, { id: '3', name: 'Mar' }, { id: '4', name: 'Apr' },
        { id: '5', name: 'May' }, { id: '6', name: 'Jun' }, { id: '7', name: 'Jul' }, { id: '8', name: 'Aug' },
        { id: '9', name: 'Sep' }, { id: '10', name: 'Oct' }, { id: '11', name: 'Nov' }, { id: '12', name: 'Dec' },
        { id: '13', name: 'Jan-Mar' }, { id: '14', name: 'Apr-Jun' }, { id: '15', name: 'Jul-Sep' }, { id: '16', name: 'Oct-Dec' },
        { id: '17', name: 'Jan-Jun' }, { id: '18', name: 'Jul-Dec' }, { id: '19', name: 'Jan-Dec' }
    ];  //To create dynamic mat table column in ascending order
    public kriHistoricalReportedAllMetricsNo!: number;
    public kriHistoricalReportedAllDataNo!: any
    public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotMeasurements: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotHistoricalMeasurements: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public searchValue: string = '';
    public currentYear = new Date().getFullYear();
    public gotKriDefinitions: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public masterKR!: MatTableDataSource<reviewFrequencies>
    public masterupFreq!: MatTableDataSource<reviewFrequencies>
    public isMasterReviwerAssigned!: any;
    public isMasterReviwersActive!: any;
    public masterReviewersAvl: any[] = [];
    public masterUsers!: any;
    public selectedMeasurementRowFrequency: any;
    public selectedMeasurementRowGroup: any;
    public selectedMeasurementRowUnit: any;
    period: any;
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    kriHistoricSelectedYear: any;
    inherentRisks: any[] = [];
    reportFrequencyData: any;
    BufferDays: number = 0;

    constructor(
        private utils: UtilsService,
        private _http: HttpClient,
        private _dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any) {
        super(_http, _dialog)
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('KRI');
        const colorCodes = json.map(item => item.ColorCode || '#FFFFFF');
        const jsonWithoutColor = json.map(({ ColorCode, ...rest }) => rest);
        const headers = Object.keys(jsonWithoutColor[0]);
        worksheet.addRow(headers);
        jsonWithoutColor.forEach((item, index) => {
            const row = worksheet.addRow(Object.values(item));
            const kriValueCell = row.getCell(17);
            let colorCode: string = colorCodes[index];
            if (!colorCode.startsWith('#')) {
                colorCode = this.RGBAToHexA(colorCode).substring(0, 7);
            }
            const excelColorCode = colorCode.startsWith('#') ? colorCode.substring(1) : colorCode;
            kriValueCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: excelColorCode }
            };
        });
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob(
                [buffer],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            );
            saveAs(blob, `${excelFileName}.xlsx`);
        });
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + '_' + new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString() + EXCEL_EXTENSION);
    }

    public async exportAsExcelKriReporting(
        tableId: string,
        fileName: string,
        headerData: any,
        lastIndex: number,
        thresholdValues: any
    ) {
        let workbook = new ExcelJS.Workbook();
        for (let i = 0; i < lastIndex; i++) {
            let worksheet = workbook.addWorksheet(headerData[i].UnitName.substring(0, 31));
            // console.log('tableId: ', tableId);
            var element = document.getElementById(tableId + i);
            if (element != null) {
                const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
                var jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
                if (jsonData.length > 1) {
                    jsonData.forEach((row, rowIndex) => {
                        let formattedRow: any[] = [];
                        if (rowIndex === 0) {
                            formattedRow = ['Unit Name', 'Group Name', 'Sl no', ...row];
                        } else if (rowIndex === 1) {
                            formattedRow = ['', '', '', ...row];
                        } else {
                            formattedRow = [
                                headerData[i].UnitName,
                                headerData[i].GroupName,
                                (rowIndex - 1).toString(),
                                ...row
                            ];
                        }
                        worksheet.addRow(formattedRow);
                    });
                    const kriColumnIndex = 13;
                    worksheet.eachRow((row, rowIndex) => {
                        if (rowIndex > 2) { // Skip headers
                            let kriValueCell = row.getCell(kriColumnIndex);
                            let kriValue = kriValueCell.value as number;
                            const threshold = thresholdValues.find((t: any) => t.Value == kriValue);
                            if (threshold && threshold.ColorCode) {
                                let colorCode = threshold.ColorCode;
                                if (!colorCode.startsWith("#")) {
                                    colorCode = this.RGBAToHexA(colorCode);
                                }
                                colorCode = colorCode.substring(1, 7);
                                kriValueCell.fill = {
                                    type: "pattern",
                                    pattern: "solid",
                                    fgColor: { argb: colorCode }
                                };
                                kriValueCell.font = {
                                    color: { argb: 'FFFFFFFF' },
                                    bold: true
                                };
                            }
                        }
                    });
                }
            }
        }
        // Write to file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, fileName + '.xlsx');
    }

    public async exportAsExcelKriHistorical(
        tableId: string,
        fileName: string,
        groupName: string,
        unitName: string,
        thresholdValues: any
    ) {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sheet1');
        let element = document.getElementById(tableId)!;
        let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
        let jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
        if (jsonData.length > 0) {
            jsonData.forEach((row, rowIndex) => {
                let formattedRow: any[] = [];
                if (rowIndex === 0) {
                    formattedRow = ['Unit Name', 'Group Name', 'Sl no', ...row];
                } else if (rowIndex === 1) {
                    formattedRow = ['', '', '', ...row];
                } else {
                    formattedRow = [
                        unitName,
                        groupName,
                        (rowIndex - 1).toString(),
                        ...row
                    ];
                }
                worksheet.addRow(formattedRow);
            });
            // Adjust the index based on your actual column position
            const kriColumnIndex = 13;
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex > 2) { // Skip headers
                    let kriValueCell = row.getCell(kriColumnIndex);
                    let kriValue = kriValueCell.value as number;
                    const threshold = thresholdValues.find((t: any) => t.Value == kriValue);
                    if (threshold && threshold.ColorCode) {
                        let colorCode = threshold.ColorCode;
                        if (!colorCode.startsWith("#")) {
                            colorCode = this.RGBAToHexA(colorCode);
                        }
                        colorCode = colorCode.substring(1, 7); // Remove '#' from HEX
                        kriValueCell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: colorCode }
                        };
                        kriValueCell.font = {
                            color: { argb: 'FFFFFFFF' }, // White text for contrast
                            bold: true
                        };
                    }
                }
            });
        }
        // Write to file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, fileName + '.xlsx');
    }

    public exportAsExcelFromTableId(tableId: string, fileName: string) {
        var element = document.getElementById(tableId)!;
        var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
        //delete (ws['O1'])
        var jsonData: [][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
        /* generate workbook and add the worksheet */
        var rawData = XLSX.utils.aoa_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, rawData, 'sheet1');
        /* save to file */
        XLSX.writeFile(wb, fileName + EXCEL_EXTENSION);
    }

    public exportRCSAReportAsExcelWithColorCode(tableId: string, fileName: string, data: string[][]) {
        var element = document.getElementById(tableId)!;
        var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
        //delete (ws['O1'])
        var jsonData: [][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');
        // Add headers
        const headers = Object.keys(jsonData[0]);
        // Add data
        jsonData.forEach((item: any[]) => {
            const row: any = [];
            headers.forEach((header: any) => {
                row.push(item[header]);
            });
            worksheet.addRow(row);
        });
        let count = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber != 1) {
                row.eachCell((cell, colNumber) => {
                    if (colNumber == 7) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.OverallInherentRiskColorCode)[count] != undefined ? data.map((item: any) => item.OverallInherentRiskColorCode)[count].substring(1) : 'ffffff' },// e4510a
                        }
                    }
                    if (colNumber == 8) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.OverallControlEnvironmentRatingColourCode)[count] != undefined ? data.map((item: any) => item.OverallControlEnvironmentRatingColourCode)[count].substring(1) : 'ffffff' },// e4510a
                        }
                    }
                    if (colNumber == 9) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.ResidualRiskRatingColourCode)[count] != undefined ? data.map((item: any) => item.ResidualRiskRatingColourCode)[count].substring(1) : 'ffffff' },// e4510a
                        }
                    }
                })
                count++;
            }
            row.commit();
        })
        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName}.xlsx`);
        });
    }

    public exportKRIReportAsExcelWithColorCode(tableId: string, fileName: string, data: string[][]) {
        var element = document.getElementById(tableId)!;
        var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
        //delete (ws['O1'])
        var jsonData: [][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');
        // Add headers
        const headers = Object.keys(jsonData[0]);
        // Add data
        jsonData.forEach((item: any[]) => {
            const row: any = [];
            headers.forEach((header: any) => {
                row.push(item[header]);
            });
            worksheet.addRow(row);
        });
        worksheet.mergeCells("A1:A2");
        worksheet.mergeCells("B1:B2");
        worksheet.mergeCells("C1:C2");
        worksheet.mergeCells("D1:D2");
        worksheet.mergeCells("E1:E2");
        worksheet.mergeCells("F1:F2");
        worksheet.mergeCells("G1:G2");
        worksheet.mergeCells("H1:M1");
        worksheet.mergeCells("N1:R1");
        // console.log(data)
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                if (rowNumber > 2) {
                    if (colNumber == 11) {
                        let colorCode: string = '';
                        colorCode = data.map((item: any) => item.ColorCode)[rowNumber - 3];
                        if (((colorCode).search('#') as number) < 0) {
                            colorCode = this.RGBAToHexA(colorCode);
                            colorCode = colorCode.substring(0, 7)
                        }
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: colorCode != undefined ? colorCode.substring(1) : 'ffffff' },// e4510a
                        }
                    }
                }
            })
            row.commit();
        })
        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName}.xlsx`);
        });
    }

    public exportRCSARiskRegisterAsExcelWithColorCode(tableId: string, fileName: string, data: any[]) {
        var element = document.getElementById(tableId)!;
        var ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
        var jsonData: [][] = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1, defval: '' });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');
        const headers = Object.keys(jsonData[0]);
        jsonData.forEach((item: any[]) => {
            const row: any = [];
            headers.forEach((header: any) => {
                row.push(item[header]);
            });
            worksheet.addRow(row);
        });
        let count = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber != 1) {
                row.eachCell((cell, colNumber) => {
                    if (colNumber == 12) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.OverallInherentRiskColor)[count].substring(1) },// e4510a
                        }
                    }
                    if (colNumber == 19) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.OverallControlEnvironmentRatingColourCode)[count].substring(1) },// e4510a
                        }
                    }
                    if (colNumber == 20) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: data.map((item: any) => item.ResidualRiskRatingColourCode)[count].substring(1) },// e4510a
                        }
                    }
                })
                count++;
            }
            row.commit();
        })
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName}.xlsx`);
        });
    }

    RGBAToHexA(rgba: string, forceRemoveAlpha = false) {
        return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
            .split(',') // splits them at ","
            .filter((string, index) => !forceRemoveAlpha || index !== 3)
            .map(string => parseFloat(string)) // Converts them to numbers
            .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
            .map(number => number.toString(16)) // Converts numbers to hex
            .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
            .join("") // Puts the array to togehter to a string
    }

    async getKriMaster(): Promise<void> {
        try {
            const res: any = await firstValueFrom(
                this.post("/operational-risk-management/kri/get-kri-master-data", {})
            );
            if (res.success == 1) {
                this.processKriMaster(res);
            } else {
                if (res.error?.errorCode === "TOKEN_EXPIRED") {
                    this.utils.relogin(this._document);
                } else {
                    this.popupInfo("Unsuccessful", res.error.errorMessage);
                }
            }
        } catch (err) {
            console.error("Error in getKriMaster:", err);
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

    getEnabledTableLen(tableData: any) {
        return tableData.filter((ele: any) => ele.IsActive).length;
    }

    processKriMaster(response: any): void {
        this.master = response.result;
        this.masterUsers = response.result.userList;
        this.masterThresholdLength = this.getEnabledTableLen(this.master.thresholdValue);
        this.measurementFreqLength = this.getEnabledTableLen(this.master.measurementFrequencies);
        this.kriTypeLength = this.getEnabledTableLen(this.master.types);
        this.filteredMeasurementFreq = this.master.measurementFrequencies.filter((ele: any) => ele.IsActive);
        this.filteredKRIType = this.master.types.filter((ele: any) => ele.IsActive);
        this.masterMF = new MatTableDataSource(this.indexKriMaster(this.master.measurementFrequencies));
        this.masterKT = new MatTableDataSource(this.indexKriMaster(this.master.types));
        this.masterRF = new MatTableDataSource(this.indexKriMaster(this.master.reportingFrequencies));
        this.masterStatus = new MatTableDataSource(this.indexKriMaster(this.master.status));
        this.masterTV = new MatTableDataSource(this.indexKriMaster(this.master.thresholdValue));
        this.masterKR = new MatTableDataSource(this.indexIncidentMaster((response.result.reviewFrequencies)));
        this.masterupFreq = new MatTableDataSource(this.indexKriUpdatefrequency((response.result.updatedFrequency)));
        this.isMasterReviwerAssigned = this.masterKR.data.length > 0;
        this.isMasterReviwersActive = this.isAllActive(this.masterKR.data);
        this.masterReviewersAvl = this.filterMasterUsers(this.master.reviewFrequencies, this.master.reviewFrequencies.filter((ele: any) => ele.IsActive));
        this.inherentRisks = response.result.inherentRisks;
        this.gotMaster.next(true);
    }

    filterMasterUsers(allUsers: any, activeUsers: any) {
        let userGUIDs: any = [];
        userGUIDs = allUsers.map((ele1: any) => ele1.UserGUID).concat(activeUsers.map((ele2: any) => ele2.UserGUID));;
        let requiredUser: any = [];
        requiredUser = this.masterUsers.filter((ele: any) => !(userGUIDs.includes(ele.UserGUID)));
        return requiredUser;
    }

    indexIncidentMaster(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            data.EditMode = false;
            Index++;
        });
        return docs
    }

    indexKriUpdatefrequency(docs: any) {
        let Index = 1;
        docs.forEach((data: any) => {
            data.Index = Index;
            Index++;
        });
        return docs
    }

    isAllActive(users: any) {
        return users.every((ele: any) => !ele.IsActive);
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
        this.post("/operational-risk-management/kri/get-kri-definitions", {}).subscribe(res => {
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
        this.gotKriDefinitions.next(true)
    }

    deletekridefinition(metric: any): any {
        return this.post("/operational-risk-management/kri/delete-kri-definition", {
            "data":
            {
                "metricID": metric
            },
        });
    }

    getKriMeasurementsNewData(data: any): void {
        this.post("/operational-risk-management/kri/get-kri-metrics-scoring", {
            data
        }).subscribe(res => {
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

    getKriMeasurements(): void {
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

    setKriMetricsScoring(data: any, value: boolean): void {
        this.post("/operational-risk-management/kri/set-kri-metrics-scoring", { data }).subscribe(res => {
            if (res.success == 1) {
                if (value == true) {
                    this.getKriMeasurementsNewData(1);
                } else {
                    this.getKriMeasurements();
                }
                this.popupInfo("Success", "KRI Saved Successfully");
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    setKriMetricsReport(data: any, value: boolean): void {
        this.post("/operational-risk-management/kri/set-kri-metrics-report", { data }).subscribe(res => {
            if (res.success == 1) {
                if (value == true) {
                    this.getKriMeasurementsNewData(1);
                } else {
                    this.getKriMeasurements();
                }
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
        this.reportFrequencyData = response?.result?.reportingFrequencyData ?? [];
        this.kriMeasurementold = new MatTableDataSource(JSON.parse(JSON.stringify(response.result.kriMetricData)))
        response.result.kriMetricData.forEach((kri: any) => {
            kri.isChecked = kri.ReportStatusID == 1 ? null : kri.ReportStatusID == 2 ? true : false
            kri.MeasurementOld = kri.Measurement
            kri.RemarksOld = kri.Remarks
            kri.evidencesOld = kri.evidences && kri.evidences.length > 0 ? (kri.evidences.map((ele: any) => ele.EvidenceID)).join() : '';
            var kridate = kri.Date;
            var kriFrequency = kri.MeasurementFrequencyID;

            // console.log('KRICode::', kri.KriCode);
            // console.log('isKriInDateRange::', (isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData)));

            if (!(isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData))
                || kri?.Measurement == null
                || kri?.Measurement?.toString?.().trim() === '') {
                kri.Period = null;
                kri.Date = null;
                kri.Measurement = null;
                kri.ThresholdValue = null;
                kri.Remarks = null;
                kri.StatusName = "Not Measured";
                kri.ReportStatusName = "Not Measured";
                kri.evidences = [];
                kri.ColorCode = "#FFFFFF";
                kri.CommentData = [];
            }

            if (kri.Remarks == null || kri.Remarks == "") {
                kri.StatusName = "Not Measured";
                kri.Date = null;
                kri.Period = null;
                kri.ReportStatusName = "Not Measured";
                kri.CommentData = [];
            }
            if (kri.evidences != null) {
                if (kri.evidences?.length > 0) {
                    for (let i = 0; i < kri.evidences?.length; i++) {
                        var evDate = kri.evidences[i].CreatedDate;
                        if (!(isKriInDateRange(evDate, kriFrequency, this.reportFrequencyData))) {
                            kri.evidences.splice(i, 1)
                        }
                    }
                }
            }
        });
        this.kriMeasurments = response.result.kriMetricData;
        this.kriData = response.result.kriMetricData;
        const key = 'UnitName';
        const arrayUniqueByKey = [...new Map(this.kriMeasurments.map((item: any) =>
            [item[key], item])).values()];
        this.unitCount = arrayUniqueByKey?.length
        this.kriMeasurement = new MatTableDataSource(response.result.kriMetricData);
        this.powerUser = response.result.RiskUnitPowerUser[0].RiskUnitPowerUser;
        this.kriMeasurementGroups = response.result.groups
        this.kriMeasurementUnits = response.result.units
        this.kriThresholds = response.result.thresholds
        this.kriMeasurmentsReportingFrequncy = response.result.reportingFrequency[0].ReportingFrequency;
        this.kriMeasurmentsReportingEndDate = response.result.reportingFrequency[0].CycleEndDate;
        this.gotMeasurements.next(true)
    }

    processMeasurementData(response: any) {
        this.reportFrequencyData = response?.result?.reportingFrequencyData ?? [];
        this.kriMeasurementold = new MatTableDataSource(JSON.parse(JSON.stringify(response.result.kriMetricData)))

        response.result.kriMetricData.forEach((kri: any) => {
            kri.isChecked = kri.ReportStatusID != '' ? (kri.ReportStatusID == 3 ? true : kri.ReportStatusID == 2 ? false : null) : null


            var kridate = kri.Date;
            var kriFrequency = kri.MeasurementFrequencyID;

            // console.log('KRICode::', kri.KriCode);
            // console.log('isKriInDateRange::', (isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData)));

            if (!(isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData))
                || kri?.Measurement == null
                || kri?.Measurement?.toString?.().trim() === '') {
                kri.Period = null;
                kri.Date = null;
                kri.Measurement = null;
                kri.ThresholdValue = null;
                kri.Remarks = null;
                kri.KRI_Status = "Not Measured";
                kri.ReportStatusName = "Not Measured"
                kri.ReportStatusID = 1
                kri.evidences = null;
                kri.ColorCode = "#FFFFFF"
                kri.CommentBody = "";
                kri.CommentData = [];
                kri.isChecked = null;
            }
            if (kri.Remarks == null || kri.Remarks == "") {
                kri.KRI_Status = "Not Measured";
                kri.ReportStatusName = "Not Measured"
                kri.CommentBody = "";
                kri.CommentData = [];
                kri.ReportStatusID = 1
                kri.Date = null;
                kri.Period = null;
                kri.isChecked = null;
            }
            if (kri.evidences != null) {
                if (kri.evidences?.length > 0) {
                    for (let i = 0; i < kri.evidences?.length; i++) {
                        var evDate = kri.evidences[i].CreatedDate;
                        if (!(isKriInDateRange(evDate, kriFrequency, this.reportFrequencyData))) {
                            kri.evidences.splice(i, 1);
                        }
                    }
                }
            }
        });
        // this.kriMeasurments = response.result.kriMetricDataSelfScoring
        this.kriMeasurments = response.result.kriMetricData //.filter((ele:any)=> ele.KRI_Status != "Not Measured" && ele.KRI_Status != "Measured" && ele.KRI_Status != "")
        this.kriData = response.result.kriMetricData //.filter((ele:any)=> ele.KRI_Status != "Not Measured" && ele.KRI_Status != "Measured")
        // console.log("🚀 ~ file: kri.service.ts:1332 ~ KriService ~ processMeasurementData ~ this.kriMeasurments:", this.kriMeasurments)
        const key = 'UnitName';
        this.kriMeasurement = new MatTableDataSource(this.kriMeasurments)
        this.powerUser = response.result.riskUnitUser[0].RiskUnitUser;
        this.kriMeasurementGroups = response.result.groupsData;
        this.kriMeasurementUnits = response.result.uniqueUnits
        this.kriThresholds = response.result.threshold
        // console.log("response2", this.kriThresholds);
        // console.log("response2 data", response.result.threshold);
        this.kriMeasurmentsReportingFrequncy = response.result.reportingFrequency[0].ReportingFrequency;
        this.kriMeasurmentsReportingEndDate = response.result.reportingFrequency[0].CycleEndDate;
        this.kriReviewerUser = response.result.reviwer[0].ReviwerUser;
        this.emailTrigger = response.result.emailTrigger
        this.gotMeasurements.next(true)
        this.closeWaitData();
    }

    closeWaitData(): void {
        this.wait.close()
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
        // console.log(response)
    }

    getKriHistorical(): void {
        this.post("/operational-risk-management/kri/get-kri-historical-scoring", {}).subscribe(res => {
            next:
            if (res.success == 1) {
                this.processKriHistorical(res)
            } else {
                // console.log("kri service error");
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    private processKriHistorical(response: any) {
        this.kriHistoricalData = response.result || {};
        this.kriHistoricalSelectedGroup = '';
        this.kriHistoricalSelectedUnit = '';
        this.kriHistoricalSelectedYear = (response.result?.years.length > 0) ? ((response.result?.years?.some((x: any) => x.Years == this.currentYear)) ? this.currentYear : response.result?.years[0].Years) : null;
        this.getKriHistoricalMetricsData();
    }

    getKriHistoricalMetricsData(): any {
        let data: any = (this.kriHistoricalData?.kriMetricData) ? JSON.parse(JSON.stringify(this.kriHistoricalData.kriMetricData)) : [];
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
        this.post("/operational-risk-management/kri/get-kri-report", {}).subscribe(res => {
            next:
            if (res.success == 1) {
                // console.log("kri service", res);
                this.processKriReport(res)
            } else {
                // console.log("kri service error");
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });

    }

    private processKriReport(response: any) {
        this.reportFrequencyData = response?.result?.reportingFrequencyData ?? [];
        response.result.kriMetricData.forEach((kri: any) => {
            if (kri.IsReported == true) {
                kri.StatusName = "Reported";
            } else if (kri.Date != null && kri.Measurement != null && kri.Remarks != '' && kri.Remarks != null) {
                kri.StatusName = "Measured";
                kri.Period = null;
            } else {
                kri.StatusName = "Not Measured";
            }
            kri.MeasurementOld = kri.Measurement
            kri.RemarksOld = kri.Remarks
            kri.evidencesOld = kri.evidences && kri.evidences.length > 0 ? (kri.evidences.map((ele: any) => ele.EvidenceID)).join() : '';
            var kridate = kri.Date;
            var kriFrequency = kri.MeasurementFrequencyID;

            // console.log('KRICode::', kri.KriCode);
            // console.log('isKriInDateRange::', (isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData)));

            if (!(isKriInDateRange(kridate, kriFrequency, this.reportFrequencyData))
                || kri?.Measurement == null
                || kri?.Measurement?.toString?.().trim() === '') {
                kri.Period = null;
                kri.Date = null;
                kri.Measurement = null;
                kri.ThresholdValue = null;
                kri.Remarks = null;
                kri.StatusName = "Not Measured";
                kri.evidences = null;
                kri.ColorCode = "#FFFFFF"
                kri.KRI_Status = "Not Measured";
                kri.ReportStatusName = "Not Measured"
                kri.ReportStatusID = 1
            }
            if (kri.Remarks == null || kri.Remarks == "") {
                kri.StatusName = "Not Measured";
                kri.KRI_Status = "Not Measured";
                kri.ReportStatusName = "Not Measured"
                kri.ReportStatusID = 1
                kri.Date = null;
                kri.Period = null;
            }
        });
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
        // console.log('allMetrics: ' + JSON.stringify(allMetrics))
        this.kriReportedAllMetricsNo = allMetrics.length;
        this.kriReportedMeasuredMetricsNo = allMetrics.filter((data: any) => data.KRI_Status == 'Measured').length;
        // console.log('kriReportedMeasuredMetricsNo: service - ' + this.kriReportedMeasuredMetricsNo)
        this.kriReportedNotMeasuredMetricsNo = allMetrics.filter((data: any) => data.KRI_Status == 'Not Measured').length;
        this.kriReportedMetricsNo = allMetrics.filter((data: any) => data.KRI_Status == 'Reported').length;
        this.kriApprovedMetricsNo = allMetrics.filter((data: any) => data.KRI_Status == 'Approved').length;
        this.kriRejectedMetricsNo = allMetrics.filter((data: any) => data.KRI_Status == 'Rejected').length;
        this.kriReportedSelectedUnitNameRows = list;
    }

    private generateKriReportedMetricData(expansionUnit: any): KriReportedUnitRow {
        let row = {} as KriReportedUnitRow;
        row.GroupID = expansionUnit.GroupID;
        row.GroupName = this.kriReportedData?.groups.find((grp: any) => grp.GroupID == row.GroupID).GroupName;
        row.UnitID = expansionUnit.UnitID;
        row.UnitName = expansionUnit.UnitName;
        let unitMetricList = this.kriReportedData?.kriMetricData.filter((a: any) => a.GroupID == row.GroupID && a.UnitID == row.UnitID);
        let kriReportedData1 = [];
        for (let i = 0; i < unitMetricList.length; i++) {
            const kri = unitMetricList[i];
            if (kri["KRI_Status"] === null && kri["Measurement"] === null) {
                kri["KRI_Status"] = "Not Measured";
            }
            kriReportedData1.push(kri);
        }
        // console.log("kriReportedData1", kriReportedData1)
        row.Metrics = new MatTableDataSource(kriReportedData1);
        row.IsExpanded = false;
        return row;
    }

    getKriHistoricalReport(): void {
        this.post("/operational-risk-management/kri/get-kri-historical-report", {}).subscribe(res => {
            next:
            if (res.success == 1) {
                // console.log("kri service", res);
                this.processKriHistoricalReport(res)
            } else {
                // console.log("kri service error");
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });

    }

    private processKriHistoricalReport(response: any) {
        this.kriHistoricalReportedData = response.result;
        this.kriThresholdData = response.result?.threshold;
        setTimeout(() => {
            this.kriHistoricalReportedSelectedGroup = '';
            this.kriHistoricalReportedSelectedUnit = '';
            this.kriHistoricalReportedSelectedYear = (response.result?.years.some((x: any) => x.Years == this.currentYear)) ? this.currentYear : response.result?.years[0]?.Years;
            this.kriHistoricSelectedYear = (response.result?.years.some((x: any) => x.Years == this.currentYear)) ? this.currentYear : response.result?.years[0]?.Years;
            this.getKriHistoricalReportedMetricsData();
        }, 200)
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
        this.kriHistoricalReportedAllDataNo = Array.from(new Set(allMetrics.map(metric => metric.UnitID)))
            .map(unitID => {
                const { UnitID, UnitName } = allMetrics.find(metric => metric.UnitID === unitID);
                return { UnitID, UnitName };
            });
        this.kriHistoricalReportedAllMetricsNo = allMetrics.length;
        this.kriHistoricalReportedSelectedUnitNameRows = list;
    }

    private generateKriHistoricalReportedMetricData(expansionUnit: any): KriReportedUnitRow {
        let row = {} as KriReportedUnitRow;
        row.GroupID = expansionUnit.GroupID;
        row.GroupName = this.kriHistoricalReportedData?.groups.find((grp: any) => grp.GroupID == row.GroupID).GroupName;
        row.UnitID = expansionUnit.UnitID;
        row.UnitName = expansionUnit.UnitName;
        let cloneData = JSON.parse(JSON.stringify(this.kriHistoricalReportedData?.kriMetricData
            .filter((a: any) => a.GroupID == row.GroupID && a.UnitID == row.UnitID)));
        for (let i = 0; i < cloneData.length; i++) {
            if (cloneData[i].KRI_Status === null) {
                cloneData[i].KRI_Status = "Not Measured";
            }
        }
        // console.log("cloneData",cloneData)
        cloneData.map((x: any) => {
            x.previousData = x.previousData.filter((y: any) => y.Year == this.kriHistoricalReportedSelectedYear);
            return x;
        });
        cloneData.map((x: any) => {
            let periodPropertyNames: string[][] = [];
            x.previousData = x.previousData.map((y: any) => {
                // — Safely read Period —
                const periodValue = (y['Period'] ?? '').toString().trim();
                const periodName =
                    periodValue.length > 4
                        ? periodValue.substring(0, periodValue.length - 4).trim()
                        : periodValue;
                const periodId =
                    this.historicalReportPeriodList?.find((p: any) => p?.name == periodName)?.id ?? '';
                // — Cache originals before deleting —
                const _Period = y['Period'] ?? '';
                const _Date = y['Date'] ?? '';
                const _Measurement = y['Measurement'] ?? '';
                const _ThresholdValue = y['ThresholdValue'] ?? '';
                const _Remark = y['Remark'] ?? '';
                const _KRI_Status = y['KRI_Status'] ?? '';
                // — Delete base keys BEFORE re-adding with suffix —
                delete y['Period'];
                delete y['Date'];
                delete y['Measurement'];
                delete y['ThresholdValue'];
                delete y['Remark'];
                delete y['KRI_Status'];
                // — Re-add with suffix (even if suffix is '') —
                y['Period' + periodId] = _Period;
                y['Date' + periodId] = _Date;
                y['Measurement' + periodId] = _Measurement;
                y['ThresholdValue' + periodId] = _ThresholdValue;
                y['Remark' + periodId] = _Remark;
                y['KRI_Status' + periodId] = _KRI_Status;
                periodPropertyNames.push(
                    Object.keys(y).filter(
                        k =>
                            k.includes('Period') ||
                            k.includes('Date') ||
                            k.includes('Measurement') ||
                            k.includes('KRI_Status') ||
                            k.includes('ThresholdValue') ||
                            k.includes('Remark')
                    )
                );
                return y;
            });
            x['periodPropertyNames'] = periodPropertyNames.flat();
            return x.previousData;
        });
        for (let i = 0; i < cloneData.length; i++) {
            if (cloneData[i].previousData.length == 0) {
                cloneData[i].Kri_NewStatus = "Not Measured";
            }
        }
        let selectedYear = this.kriHistoricSelectedYear ? this.kriHistoricSelectedYear % 100 : this.currentYear % 100;
        let currYear = this.currentYear % 100
        cloneData = currYear == selectedYear ? cloneData : cloneData.filter((obj: any) => parseInt(obj.KRI_Defined_Quater.split('-')[1]) <= selectedYear);
        cloneData = cloneData.filter((obj: any) => obj.KRI_Deleted_Quater ? parseInt(obj.KRI_Deleted_Quater.split('-')[1]) >= selectedYear : true);
        // console.log("cloneData", cloneData)
        row.Metrics = new MatTableDataSource(cloneData);
        row.IsExpanded = false;
        return row;
    }

    //sort array of object based on mat table filtered data length
    sortUnitList(list: any) {
        list.sort((a: any, b: any) => {
            return b.Metrics.filteredData.length - a.Metrics.filteredData.length;
        });
    }

    uploadKriScoring(data: FormData) {
        return this.upload("/operational-risk-management/kri/upload-KriScoring-evidence", data)
    }

    downloadKriScoringEvidence(data: any) {
        return this.post("/operational-risk-management/kri/download-KriScoring-evidence", { data });
    }

    deleteKriScoringEvidence(data: any) {
        return this.post("/operational-risk-management/kri/delete-KriScoring-evidence", { data });
    }

    sendBulkRemainder() {
        return this.post("/operational-risk-management/kri/send-bulk-email-reminder", {})
    }

    sendIndividualRemainder(data: any) {
        return this.post("/operational-risk-management/kri/send-metric-kri-reminder", { data })
    }

    saveReviewerDetails(data: any) {
        return this.post("/operational-risk-management/kri/save-review-reported-kri-data", { data })
    }

    submitReviewerDetails(data: any) {
        return this.post("/operational-risk-management/kri/submit-kri-review", { data })
    }

    getkrireporteddata() {
        return this.post("/operational-risk-management/kri/get-kri-reported-data", {
        }).subscribe(res => {
            next:
            if (res.success == 1) {
                this.wait = this.dialog.open(WaitComponent, {
                    disableClose: true,
                    panelClass: "dark",
                    data: {
                        text: "Fetching Data ..."
                    }
                })
                this.processMeasurementData(res)
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        });
    }

    bulkUploadKriMetrics(data: FormData) {
        return this.upload("/operational-risk-management/kri/bulk-upload-kri-metrics", data)
    }
}