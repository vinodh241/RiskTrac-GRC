import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { KriService } from 'src/app/services/kri/kri.service';
import { environment } from 'src/environments/environment';
import { KriDefinitionComponent } from './kri-definition/kri-definition.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploader } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';
import { DOCUMENT } from '@angular/common';

export interface kriDefine {
    id: string,
    group: string,
    unit: string,
    Indicator: string,
    Measurmentfrequency: string,
    Reportingfrequency: string,
    Target: string,
    Kritype: string,
    action: string,
    tresholdvalue: string
}

@Component({
    selector: 'app-kri-definitions',
    templateUrl: './kri-definitions.component.html',
    styleUrls: ['./kri-definitions.component.scss'],
    providers: [KriService]
})
export class KriDefinitionsComponent implements OnInit {
    displayedColumns: string[] = ['id', 'KriCode', 'group', 'unit','InherentRisk', 'Indicator', 'Measurmentfrequency', 'Reportingfrequency', 'Target', 'Kritype', 'thresholdvalue-1', 'thresholdvalue-2', 'thresholdvalue-3', 'thresholdvalue-4', 'thresholdvalue-5', 'action',];
    dataSource!: MatTableDataSource<kriDefine>;

    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort | undefined;
    utils: any;
    filenameWithoutExtension: any[] = [];
    invalidfile: boolean = false;
    bulkRIData: FormData = new FormData();
    ExcelValidExtension: Array<string> = ['xlsx'];
    selectedExcelJson: any[] = [];
    excelValidHeaders = ["UnitName ", "Description", "Measurement Frequency", "KRI Type", "Threshold Value1", "Threshold Value2", "Threshold Value3", "Threshold Value4", "Threshold Value5"];
    fileName: string = ''
    validFileNameErr: boolean = false;
    disableToggle: number = 0;

    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });
    importButtonFlag: boolean = false


    constructor(public kriService: KriService, public dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any
    ) {

    }

    // getKriDefine(): any {
    //     if (environment.dummyData) {
    //         let data = {
    //         };
    //         this.process(data);
    //     }
    // }

    ngOnInit(): any {
        this.kriService.getKriDefine();
        this.kriService.gotKriDefinitions.subscribe(value => {
            if (value) {
                this.paginations();
            }
        })
    }

    paginations() {
        setTimeout(() => {
            // console.log(' this.kriService.kriDefine: ' + this.kriService.kriDefine)
            this.kriService.kriDefine.paginator = this.paginator;
        }, 1000);
    }

    applyFilter(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.kriService.kriDefine.filter = filterValue.trim().toLowerCase();

        if (this.kriService.kriDefine.paginator) {
            this.kriService.kriDefine.paginator.firstPage();
        }
    }

    process(data: {}) {
        throw new Error('Method not implemented.');
    }

    definitionsDialog(): any {
        const definition = this.dialog.open(KriDefinitionComponent, {
            disableClose: true,
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            // panelClass: 'full-screen-modal',
            data: {
                "mode": "add",
                "groups": this.kriService.kriGroups,
                "units": this.kriService.KriUnits,
                "reportingFrequencies": this.kriService.kriDefineReportingFrequencies,
                "thresholds": this.kriService.kriDefineThresholds
            }
        });
        definition.afterClosed().subscribe(result => {
            if (result || result == undefined) {
                this.kriService.getKriDefine();
                this.paginations();
            }
        })
    }

    editList(row: any): any {
        row.mode = "edit";
        const kriDefineList = this.dialog.open(KriDefinitionComponent, {
            disableClose: true,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            data: {
                "mode": "edit",
                "groups": this.kriService.kriGroups,
                "units": this.kriService.KriUnits,
                "row": row,
                "reportingFrequencies": this.kriService.kriDefineReportingFrequencies,
                "thresholds": this.kriService.kriDefineThresholds
            }
        });

        kriDefineList.afterClosed().subscribe(result => {
            if (result || result == undefined) {
                // console.log("result")
                this.kriService.getKriDefine();
                this.paginations();
            }
        })
    }

    deleteList(row: any): any {
        if (row.IsUserSelf) return
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            id: "ConfirmDialogComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: "Confirm Deletion",
                content: "This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?"
            }
        });
        confirm.afterClosed().subscribe(result => {
            if (result) {
                this.kriService.deletekridefinition(row).subscribe((res: any) => {
                    // console.log(res)
                    next:
                    this.deleteSuccess();
                    error: (err: any) =>
                    console.log("err::", err);
                });
            }
        });
    }
    deleteSuccess(): any {
        const timeout = 1000; // 1 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "success",
            data: {
                title: "Success",
                content: "KRI Definition is deleted successfully"
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.kriService.getKriDefine();
                this.paginations();
            }, timeout)
        });
    }


    seletedFileDetails(event: any) {
        this.importButtonFlag = true;
        const fileInput = event.target;
        if (this.uploader.queue.length > 1) {
            // console.log('this.uploader.queue.length: ' + this.uploader.queue.length);
            let latestFile = this.uploader.queue[this.uploader.queue.length - 1];
            this.uploader.queue = [];
            this.uploader.queue.push(latestFile);
        }
        this.invalidfile = false;

        for (let j = 0; j < this.uploader.queue.length; j++) {
            let fileItem: File = this.uploader.queue[j]._file;
            this.fileName = fileItem.name;
            this.filenameWithoutExtension = this.fileName.split('.').slice();
            let extension = this.fileName.split('.').pop() as string;

            if (this.ExcelValidExtension.includes(extension.toLowerCase())) {
                this.invalidfile = false;
                const reader: FileReader = new FileReader();
                reader.readAsBinaryString(fileItem);

                reader.onload = (e: any) => {
                    /* Create workbook */
                    const binarystr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

                    /* Select the first sheet */
                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    /* Convert sheet data to JSON with default null values */
                    let data = XLSX.utils.sheet_to_json(ws, { defval: null });
                    // console.log("Raw Data:", data);

                    /* Trim headers */
                    if (data.length > 0) {
                        data = data.map((row: any) => {
                            const trimmedRow: any = {};
                            Object.keys(row).forEach((key) => {
                                const trimmedKey = key.trim();
                                trimmedRow[trimmedKey] = row[key];
                            });
                            return trimmedRow;
                        });
                    }

                    this.selectedExcelJson = JSON.parse(JSON.stringify(data)) || [];

                    let isValidHeaders = false, isElementsValid = true;
                    this.selectedExcelJson.forEach((excelJson) => {
                        let list = [...Object.keys(excelJson).map((ele: any) => ele.trim())];

                        list.forEach(header => {
                            if (this.excelValidHeaders.includes(header)) {
                                isValidHeaders = true;
                            }
                            if (header.includes('*') && excelJson[header] && !excelJson[header].toString().trim()) {
                                isElementsValid = false;
                            }
                        });

                        if (isValidHeaders && isElementsValid) {
                            this.importButtonFlag = true;
                            // console.log("Valid Data, Proceeding with Upload");
                            this.bulkRIData = new FormData();
                            this.bulkRIData.append('bulkKRIData', JSON.stringify(data));
                            this.bulkRIData.append('fileName', this.fileName);
                        } else {
                            this.popupInfoKRI("Unsuccessful", "Please select a valid template file with all mandatory parameters.");
                        }
                    });

                    // console.log("Header Validation:", isValidHeaders, "Element Validation:", isElementsValid);
                    fileInput.value = '';
                    this.uploader.clearQueue();
                };
            } else {
                this.invalidfile = true;
                this.popupInfoKRI("Unsuccessful", "Invalid File Type");
            }

            if (fileNamePattern(this.fileName)) {
                this.validFileNameErr = true;
                this.popupInfoKRI("Unsuccessful", "Special Characters are not allowed in File name");
            } else {
                this.validFileNameErr = false;
            }
        }
    }


    bulkUploadExcelFile() {
        if (this.filenameWithoutExtension.length > 0) {
            this.kriService.bulkUploadKriMetrics(this.bulkRIData).subscribe({
                next: (res) => {
                    localStorage.setItem('token', res.token);
                    if (res.success == 1) {
                        const message = res.message || 'Bulk upload completed.';
                        
                        // Check if there are invalid rows with failure reasons
                        const invalidData = res.result?.inValidData || [];
                        if (invalidData.length > 0) {
                            // Build detailed error message with failure reasons
                            const failureReasons = invalidData
                                .map((row: any) => {
                                    const rowNum = row['Row Number'] || 'Unknown';
                                    const reason = row['Failure reason'] || 'Validation failed';
                                    return `Row ${rowNum}: ${reason}`;
                                })
                                .join('\n');
                            
                            // Format message with proper line breaks
                            const formattedMessage = `${message}\n\nFailed Records:\n${failureReasons}`;
                            
                            // Show combined message with success and error details
                            // Use showCloseButton=true so user can read and close manually
                            this.popupInfoKRI('Upload Completed with Errors', formattedMessage, true);
                        } else {
                            this.popupInfo("Success", message);
                        }
                        
                        this.importButtonFlag = false;
                        setTimeout(() => {
                            this.kriService.getKriDefine();
                        }, 2000);
                        this.filenameWithoutExtension = [];
                    } else {
                        this.importButtonFlag = false;
                        if (res.error?.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
                            this.utils.relogin(this._document);
                        } else {
                            // Extract detailed error information
                            const errorCode = res.error?.errorCode;
                            const errorMessage = res.error?.errorMessage || 'Bulk upload failed.';
                            const errorDetails = res.error?.details;
                            
                            // Build comprehensive error message
                            let fullErrorMessage = errorMessage;
                            if (errorDetails) {
                                if (errorDetails.rowNumber) {
                                    fullErrorMessage += ` (Row ${errorDetails.rowNumber})`;
                                }
                                if (errorDetails.field) {
                                    fullErrorMessage += ` - Field: ${errorDetails.field}`;
                                }
                                if (errorDetails.reason) {
                                    fullErrorMessage += ` - ${errorDetails.reason}`;
                                }
                            }
                            
                            this.popupInfoKRI("Unsuccessful", fullErrorMessage);
                        }
                    }
                },
                error: (err) => {
                    this.importButtonFlag = false;
                    const errorMsg = err?.error?.error?.errorMessage || 
                                    err?.message || 
                                    'Bulk upload failed due to a network or server error.';
                    this.popupInfoKRI("Unsuccessful", errorMsg);
                }
            });
            this.bulkRIData = new FormData;
        }
    }
    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this.dialog.open(InfoComponent, {
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
            }, timeout)
        });
    }
    popupInfoKRI(title: string, message: string, showCloseButton: boolean = false) {
        // Close any existing dialog with the same id before opening a new one
        const existingDialog = this.dialog.getDialogById("InfoComponent");
        if (existingDialog) {
            existingDialog.close();
        }
        
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: !showCloseButton, // Allow manual close if showCloseButton is true
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message,
                showCloseButton: showCloseButton
            }
        });

        confirm.afterOpened().subscribe(result => {
            this.fileName = ''
            this.importButtonFlag = false;
            
            // Only auto-close if showCloseButton is false
            if (!showCloseButton) {
                const timeout = 3000; // 3 seconds
                setTimeout(() => {
                    confirm.close();
                }, timeout);
            } else {
                // For manual close, refresh data when dialog is closed
                confirm.afterClosed().subscribe(() => {
                    this.kriService.getKriDefine();
                });
            }
        });
    }

    downloadSampleFile() {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = "assets/SampleTemplate/KRI_Template.xlsx";
        link.download = 'KRI_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


}

