// Angular
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// Third-party
import { FileUploader } from 'ng2-file-upload';
import * as XLSX from 'xlsx';
// App (absolute)
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { NewInherentRiskComponent } from 'src/app/pages/rcsa/inherent-risk/new-inherent-risk/new-inherent-risk.component';
import { InherentRiskService } from 'src/app/services/rcsa/inherent-risk/inherent-risk.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
// Relative
import { TableUtil } from './tableUtil';

export interface DataModel {
    RowNumber?: number,
    SLNO: string;
    GroupID: number;
    GroupName: string;
    UnitID: number;
    UnitName: string;
    ProcessID: number;
    ProcessName: string;
    RiskCategoryID: number;
    RiskCategoryName: string;
    Risk: string;
    InherentLikelihoodID: number;
    InherentLikelihoodName: string;
    InherentRiskRatingID: number;
    InherentRiskRatingName: string;
    InherentImpactRatingID: number;
    InherentImpactRatingName: string;
    OverallInherentRisk: string;
    OverallInherentName: string;
    IsActive: boolean;
}

@Component({
    selector: 'app-inherent-risk',
    templateUrl: './inherent-risk.component.html',
    styleUrls: ['./inherent-risk.component.scss']
})
export class InherentRiskComponent implements OnInit {
    displayedColumns: string[] = ['RowNumber', 'SLNO', 'Group', 'Unit', 'Process',
        'RiskCategory', 'CorporateObjectiveName', 'Risk', 'InherentLikelihood',
        'InherentImpactRating', 'OverallInherentName',
        'Action', 'Status'];
    dataSource!: MatTableDataSource<DataModel>;
    saveerror: string = "";
    exportActive: boolean = false;
    excelData: any;
    matColumns: string[] = ["RowNumber", "Process"];
    showexportData: boolean = false;
    isStandardUser: boolean = false;
    // @ts-ignore
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;
    // @ts-ignore
    @ViewChild('TABLE', { static: true }) table: ElementRef;
    filenameWithoutExtension: any[] = [];
    invalidfile: boolean = false;
    bulkInherentRiskData: FormData = new FormData();
    ExcelValidExtension: Array<string> = ['xlsx'];
    selectedExcelJson: any[] = [];
    excelValidHeaders = ["#", "Group*", "Auditable Unit*", "Risk Category*", "Process", "Risk*", "Inherent Likelihood Rating*", "Inherent Impact Rating*"];
    fileName: string = ''
    validFileNameErr: boolean = false;
    disableToggle: number = 0;
    importButtonFlag: boolean = false
    public uploader: FileUploader = new FileUploader({
        isHTML5: true
    });

    // --- Filter properties ---
    listFilterDepartmentIds: number[] = [];
    listFilterUnitIds: number[] = [];
    listFilterProcessIds: number[] = [];
    listFilterRiskCategoryIds: number[] = [];
    listFilterLikelihoodNames: string[] = [];
    listFilterImpactNames: string[] = [];
    listFilterOverallRiskNames: string[] = [];

    listDepartments: any[] = [];
    listAllUnits: any[] = [];

    // Distinct option lists derived from loaded data
    listProcesses: any[] = [];
    listRiskCategories: any[] = [];
    listLikelihoodRatings: any[] = [];
    listImpactRatings: any[] = [];
    listOverallRiskRatings: any[] = [];

    /** Full unfiltered data (used for client-side filtering) */
    private allInherentRisks: any[] = [];

    constructor(private service: InherentRiskService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {
        this.getgriddata();
        this.isStandardUser = this.utils.isStandardUser();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.showexportData = this.dataSource.filteredData.length > 0 ? true : false;
    }

    exportAsXLSX() {
        let obj: any = [];
        if (this.dataSource.filteredData.length > 0) {
            this.dataSource.filteredData.forEach((m: any) => {
                obj.push({
                    "SLNO": m.SLNO,
                    "Group": m.GroupName,
                    "Unit": m.UnitName,
                    "Process": m.ProcessName,
                    "Risk Category": m.RiskCategoryName,
                    "Risk": m.Risk,
                    "Likelihood Rating": m.InherentLikelihoodName,
                    "Impact Rating": m.InherentImpactRatingName,
                    "Overall Inherent Risk Rating": m.OverallInherentName,
                    "Corporate Objective": m.CorporateObjectiveName,
                    "Status": m.IsActive ? "Active" : "Inactive"
                });
            });
            TableUtil.exportArrayToExcel(obj, "Inherent_Risk");
        }
    }

    getgriddata(): void {
        this.service.getAll().subscribe(res => {
            next:
            this.process(res);
        });
    }

    process(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.length > 0) {
                let docs = data.result.recordset;
                this.excelData = docs;
                if (docs && docs[0].SLNO != undefined) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id;
                    })
                    // Store full unfiltered data for client-side filtering
                    this.allInherentRisks = docs;

                    // Build distinct option lists from data
                    this.buildFilterOptions(docs);

                    // Load departments & units (only once)
                    if (this.listDepartments.length === 0) {
                        this.loadListDepartmentsAndUnits(() => {
                            this.applyClientSideFilters();
                        });
                    } else {
                        this.applyClientSideFilters();
                    }
                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    // --- Department & Unit filter methods ---

    /** Load departments and units for filter dropdowns.
     *  Accepts an optional callback to chain sequential API calls. */
    loadListDepartmentsAndUnits(callback?: () => void): void {
        this.service.getDepartmentsAndUnitsForSchedule().subscribe((res: any) => {
            if (res.success == 1) {
                this.listDepartments = res.result?.recordset?.departments || [];
                this.listAllUnits = res.result?.recordset?.units || [];
            }
            if (callback) {
                callback();
            }
        });
    }

    /** Returns units filtered by the currently selected departments.
     *  Returns empty array when no departments are selected (Unit dropdown is disabled). */
    get listFilteredUnits(): any[] {
        if (!this.listFilterDepartmentIds || this.listFilterDepartmentIds.length === 0) return [];
        return this.listAllUnits.filter((u: any) => this.listFilterDepartmentIds.includes(u.GroupID));
    }

    /** Handle department change */
    onListDepartmentChange(): void {
        if (!this.listFilterDepartmentIds || this.listFilterDepartmentIds.length === 0) {
            this.listFilterUnitIds = [];
        } else if (this.listFilterUnitIds.length > 0) {
            // Prune unit selections that no longer belong to selected departments
            const validUnitIds = this.listFilteredUnits.map((u: any) => u.UnitID);
            this.listFilterUnitIds = this.listFilterUnitIds.filter(id => validUnitIds.includes(id));
        }
        this.applyClientSideFilters();
    }

    /** Handle unit change */
    onListUnitChange(): void {
        this.applyClientSideFilters();
    }

    /** Generic handler for Process, Risk Category, Likelihood, Impact, Overall Risk filters */
    onFilterChange(): void {
        this.applyClientSideFilters();
    }

    /** Returns true if any filter is currently active */
    hasActiveFilters(): boolean {
        return this.listFilterDepartmentIds.length > 0
            || this.listFilterUnitIds.length > 0
            || this.listFilterProcessIds.length > 0
            || this.listFilterRiskCategoryIds.length > 0
            || this.listFilterLikelihoodNames.length > 0
            || this.listFilterImpactNames.length > 0
            || this.listFilterOverallRiskNames.length > 0;
    }

    /** Reset all filters to default and refresh the table */
    clearAllFilters(): void {
        this.listFilterDepartmentIds = [];
        this.listFilterUnitIds = [];
        this.listFilterProcessIds = [];
        this.listFilterRiskCategoryIds = [];
        this.listFilterLikelihoodNames = [];
        this.listFilterImpactNames = [];
        this.listFilterOverallRiskNames = [];
        this.applyClientSideFilters();
    }

    /** Build distinct option lists from loaded data for filter dropdowns */
    buildFilterOptions(docs: any[]): void {
        // Process - unique by ProcessID
        const processMap = new Map<number, string>();
        docs.forEach((d: any) => {
            if (d.ProcessID && d.ProcessName && !processMap.has(d.ProcessID)) {
                processMap.set(d.ProcessID, d.ProcessName);
            }
        });
        this.listProcesses = Array.from(processMap, ([id, name]) => ({ ProcessID: id, ProcessName: name }))
            .sort((a, b) => a.ProcessName.localeCompare(b.ProcessName));

        // Risk Category - unique by RiskCategoryID
        const rcMap = new Map<number, string>();
        docs.forEach((d: any) => {
            if (d.RiskCategoryID && d.RiskCategoryName && !rcMap.has(d.RiskCategoryID)) {
                rcMap.set(d.RiskCategoryID, d.RiskCategoryName);
            }
        });
        this.listRiskCategories = Array.from(rcMap, ([id, name]) => ({ RiskCategoryID: id, RiskCategoryName: name }))
            .sort((a, b) => a.RiskCategoryName.localeCompare(b.RiskCategoryName));

        // Likelihood Rating - unique by name
        const likelihoodSet = new Set<string>();
        docs.forEach((d: any) => {
            if (d.InherentLikelihoodName) likelihoodSet.add(d.InherentLikelihoodName);
        });
        this.listLikelihoodRatings = Array.from(likelihoodSet).sort().map(name => ({ Name: name }));

        // Impact Rating - unique by name
        const impactSet = new Set<string>();
        docs.forEach((d: any) => {
            if (d.InherentImpactRatingName) impactSet.add(d.InherentImpactRatingName);
        });
        this.listImpactRatings = Array.from(impactSet).sort().map(name => ({ Name: name }));

        // Overall Risk Rating - unique by name
        const overallSet = new Set<string>();
        docs.forEach((d: any) => {
            if (d.OverallInherentName) overallSet.add(d.OverallInherentName);
        });
        this.listOverallRiskRatings = Array.from(overallSet).sort().map(name => ({ Name: name }));
    }

    /** Apply all client-side filters and update the table data source. */
    applyClientSideFilters(): void {
        let filtered = [...this.allInherentRisks];

        // 1) Department filter
        if (this.listFilterDepartmentIds.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterDepartmentIds.includes(row.GroupID)
            );
        }

        // 2) Unit filter
        if (this.listFilterUnitIds.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterUnitIds.includes(row.UnitID)
            );
        }

        // 3) Process filter
        if (this.listFilterProcessIds.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterProcessIds.includes(row.ProcessID)
            );
        }

        // 4) Risk Category filter
        if (this.listFilterRiskCategoryIds.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterRiskCategoryIds.includes(row.RiskCategoryID)
            );
        }

        // 5) Likelihood Rating filter
        if (this.listFilterLikelihoodNames.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterLikelihoodNames.includes(row.InherentLikelihoodName)
            );
        }

        // 6) Impact Rating filter
        if (this.listFilterImpactNames.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterImpactNames.includes(row.InherentImpactRatingName)
            );
        }

        // 7) Overall Risk Rating filter
        if (this.listFilterOverallRiskNames.length > 0) {
            filtered = filtered.filter((row: any) =>
                this.listFilterOverallRiskNames.includes(row.OverallInherentName)
            );
        }

        // Re-number rows
        let id = 0;
        filtered.forEach((doc: any) => {
            id++;
            doc.RowNumber = id;
        });

        this.dataSource = new MatTableDataSource(filtered);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showexportData = this.dataSource.filteredData.length > 0;
        this.disableToggle = this.dataSource.filteredData.filter((ob: any) => ob.IsActive == 1)?.length;
    }

    initiateAdd(): void {
        const assesment = this.dialog.open(NewInherentRiskComponent, {
            disableClose: true,
            width: "120vh",
            minHeight: "80vh",
            data: {
                "mode": "add"
            }
        })
        assesment.afterClosed().subscribe(result => {
            if (result)
                this.getgriddata();
        })
    }

    editData(data: any): void {
        if (this.canFullAccess()) {
            data.mode = "edit";
            const assesment = this.dialog.open(NewInherentRiskComponent, {
                disableClose: true,
                width: "120vh",
                minHeight: "80vh",
                data: data
            })
            assesment.afterClosed().subscribe(result => {
                if (result)
                    this.getgriddata();
            })
        }
    }

    changed(data: any): void {
        if (this.canFullAccess()) {
            let obj = {
                "id": data.InherentRisksID,
                "isActive": !data.IsActive
            }
            this.service.updateStatus(obj).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.changeDetectorRefs.detectChanges();
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveerror = res.error.errorMessage;
                }
                error: (err: any) =>
                console.log("err::", err);
            });
        }
    }

    saveSuccess(content: string): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "success",
            data: {
                title: "Success",
                content: content
            }
        });
        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.getgriddata();
            }, timeout)
        });
    }

    canFullAccess(): boolean {
        let result = false;
        result = ((this.utils.isFunctionalAdmin() || this.utils.isPowerUser())); // && this.utils.isRiskManagementUnit()
        return result;
    }

    seletedFileDetails(event: Event): void {
        this.importButtonFlag = true;
        const fileInput = event.target as HTMLInputElement;
        // Keep only the latest file in the queue
        if (this.uploader.queue.length > 1) {
            const latestFile = this.uploader.queue[this.uploader.queue.length - 1];
            this.uploader.queue = [latestFile];
        }
        // Nothing to process
        if (this.uploader.queue.length === 0) {
            return;
        }
        this.invalidfile = false;
        // We only ever keep one file at this point
        const fileItem: File = this.uploader.queue[0]._file as File;
        this.fileName = fileItem.name;
        // Name without extension (for later use if needed)
        this.filenameWithoutExtension = this.fileName.split('.').slice(0, -1);
        // Validate file name (no special chars)
        if (fileNamePattern(this.fileName)) {
            this.validFileNameErr = true;
            this.popupInfoError("Unsuccessful", "Special Characters are not allowed in File name");
            fileInput.value = '';
            this.uploader.clearQueue();
            return;
        } else {
            this.validFileNameErr = false;
        }
        // Validate extension
        const extension = (this.fileName.split('.').pop() || '').toLowerCase();
        if (!this.ExcelValidExtension.includes(extension)) {
            this.invalidfile = true;
            this.popupInfoError("Unsuccessful", "Invalid File Type");
            fileInput.value = '';
            this.uploader.clearQueue();
            return;
        }
        // Read the file using the modern API
        const reader = new FileReader();
        reader.onerror = () => {
            this.popupInfoError("Unsuccessful", "Unable to read the file.");
            fileInput.value = '';
            this.uploader.clearQueue();
        };
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                // XLSX can read ArrayBuffer directly
                const wb: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
                // First sheet only (as before)
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                // Convert to JSON; keep empty cells as null
                const data = XLSX.utils.sheet_to_json(ws, { defval: null });
                // console.log("data", data);
                this.selectedExcelJson = JSON.parse(JSON.stringify(data)) || [];
                // --- Validation ---
                // 1) Headers: union of all keys across rows, trimmed
                const allHeaders = new Set<string>();
                this.selectedExcelJson.forEach(row => {
                    Object.keys(row || {}).forEach(k => allHeaders.add(String(k).trim()));
                });
                // Require that every expected header is present
                const sheetHeaders = Array.from(allHeaders);
                const isValidHeaders =
                    Array.isArray(this.excelValidHeaders) &&
                    this.excelValidHeaders.every((h: string) => sheetHeaders.includes(h));
                // 2) Mandatory fields: any header containing '*' must be non-empty (per row)
                let isElementsValid = true;
                for (const row of this.selectedExcelJson) {
                    for (const key of Object.keys(row || {})) {
                        const header = String(key).trim();
                        if (header.includes('*')) {
                            const val = row[key];
                            const text = (val ?? '').toString().trim();
                            if (!text) {
                                isElementsValid = false;
                                break;
                            }
                        }
                    }
                    if (!isElementsValid) break;
                }
                if (isValidHeaders && isElementsValid) {
                    this.importButtonFlag = true;
                    this.bulkInherentRiskData = new FormData();
                    this.bulkInherentRiskData.append('InherentRiskData', JSON.stringify(data));
                    this.bulkInherentRiskData.append('fileName', JSON.stringify(this.fileName));
                } else {
                    this.popupInfoError(
                        "Unsuccessful",
                        "Please select a valid template file with all mandatory parameters."
                    );
                }
            } catch (err) {
                this.popupInfoError("Unsuccessful", "Unable to read Excel file.");
            } finally {
                // Always clean up
                fileInput.value = '';
                this.uploader.clearQueue();
            }
        };
        // ✅ non-deprecated
        reader.readAsArrayBuffer(fileItem);
    }

    bulkUploadExcelFile() {
        if (this.filenameWithoutExtension.length > 0) {
            this.service.bulkUploadInherentRisk(this.bulkInherentRiskData).subscribe({
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
                            this.popupInfoError('Upload Completed with Errors', formattedMessage, true);
                        } else {
                            this.popupInfo("Success", message);
                        }
                        
                        this.importButtonFlag = false;
                        setTimeout(() => {
                            this.getgriddata();
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
                            
                            this.popupInfoError("Unsuccessful", fullErrorMessage);
                        }
                    }
                },
                error: (err) => {
                    this.importButtonFlag = false;
                    const errorMsg = err?.error?.error?.errorMessage || 
                                    err?.message || 
                                    'Bulk upload failed due to a network or server error.';
                    this.popupInfoError("Unsuccessful", errorMsg);
                }
            });
            this.bulkInherentRiskData = new FormData;
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

    popupInfoError(title: string, message: string, showCloseButton: boolean = false) {
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
                    this.getgriddata();
                });
            }
        });
    }

    downloadSampleFile() {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = "assets/SampleTemplate/RCSA_Template.xlsx";
        link.download = 'RCSA_Template.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    getContrastColor(inputColor: string | null | undefined): string {
        const hex = this._toHex(inputColor || '#eee');
        if (!hex) { return '#000000'; }

        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    private _toHex(color: string | null | undefined): string | null {
        if (!color) return null;
        color = color.trim();

        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            return /^[0-9A-Fa-f]{6}$/.test(hex) ? '#' + hex : null;
        }

        const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (rgb) {
            return '#' +
                this._componentToHex(+rgb[1]) +
                this._componentToHex(+rgb[2]) +
                this._componentToHex(+rgb[3]);
        }

        try {
            const ctx = document.createElement('canvas').getContext('2d');
            if (ctx) {
                ctx.fillStyle = color;
                return this._toHex(ctx.fillStyle);
            }
        } catch { }

        return null;
    }

    private _componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

}