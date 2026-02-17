import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddeditRcsaControlComponent } from '../addedit-rcsa-control/addedit-rcsa-control.component';
import {
  ControlLibraryService,
  ControlRecord,
  BulkControlRow,
  ApiResponse,
  ApiResponseBulkAdd
} from 'src/app/services/rcsa/control_library/control-library.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

import { UtilsService } from 'src/app/services/utils/utils.service';

// XLSX parsing & file creation
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs/dist/exceljs.min.js';



type ExcelRow = Record<string, any>;

@Component({
  selector: 'app-rcsa-control-library',
  templateUrl: './rcsa-control-library.component.html',
  styleUrls: ['./rcsa-control-library.component.scss']
})
export class RcsaControlLibraryComponent implements OnInit {

  displayedColumns: string[] = [
    'ControlCode',
    'GroupName',
    'UnitName',
    'ControlType',
    'ControlDescription',
    'Action',
    'Status'
  ];

  dataSource = new MatTableDataSource<ControlRecord>([]);
  saveerror = '';
  showexportData = false;

  // Bulk upload UI state
  fileName = '';
  filenameWithoutExtension = '';
  invalidfile = false;
  validFileNameErr = false;
  importButtonFlag = false;

  private excelValidHeaders = ['unitname', 'groupname', 'controltype', 'controldescription'];
  private excelOptionalHeaders = ['#'];

  private allowedExtensions = ['xlsx', 'xls'];

  // Parsed rows that passed validation
  private excelRows: BulkControlRow[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  disableToggle: number = 0;

  constructor(
    private controlSvc: ControlLibraryService,
    private utils: UtilsService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) { }

  ngOnInit(): void {
    this.getGridData();
  }

  /* ================== LIST ================== */
  getGridData(): void {
    this.saveerror = '';
    this.controlSvc.getAll().subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.success === 1) {
          const rows: any[] = res.result?.recordset ?? [];
          // const rows:any[] = [];
          // this.dataSource.data = rows;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.showexportData = rows.length > 0;
          this.dataSource.data = rows;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.showexportData = rows.length > 0;

          // count active records (treat both 1/true as active)
          this.disableToggle = (rows || []).filter(r => r && (r.IsActive === 1 || r.IsActive === true)).length;

        } else {
          if (this.isTokenExpired(res)) this.utils.relogin(this._document);
          else this.saveerror = res.error?.errorMessage || 'Failed to fetch controls.';
        }
      },
      error: _ => this.saveerror = 'Failed to fetch controls.'
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement)?.value ?? '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  canFullAccess(): boolean {
    let result = false;
    result = ((this.utils.isFunctionalAdmin() || this.utils.isPowerUser())); //  && this.utils.isRiskManagementUnit()
    return result;
  }

  /* ================== ADD / EDIT ================== */
  initiateAdd(): void {
    const dialogRef = this.dialog.open(AddeditRcsaControlComponent, {
      disableClose: true,
      width: '120vh',
      minHeight: '80vh',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(ok => { if (ok) this.getGridData(); });
  }

  editData(row: ControlRecord): void {
    if (!this.canFullAccess()) return;
    const data = { ...row, mode: 'edit' };
    const dialogRef = this.dialog.open(AddeditRcsaControlComponent, {
      disableClose: true,
      width: '120vh',
      minHeight: '80vh',
      data
    });
    dialogRef.afterClosed().subscribe(ok => { if (ok) this.getGridData(); });
  }

  toggleStatus(row: any): void {
    if (!this.canFullAccess() || !row) return;
    const currentActiveCount = (this.dataSource.data || []).filter((r: any) => r && (r.IsActive === 1 || r.IsActive === true)).length;
    if ((row.IsActive === 1 || row.IsActive === true) && currentActiveCount === 1) {
      this.popupInfoError('Unsuccessful', 'There should be at least one Active control to disable this record.');
      return;
    }

    // Build payload (as requested)
    const payload: any = {
      controlID: row.ControlID ?? row.ControlId ?? row.ID ?? row.ControlLibraryID,
      unitID: row.UnitID ?? row.UnitId,
      groupID: row.GroupID ?? row.GroupId,
      controlTypeID: row.ControlTypeID ?? row.ControlTypeId,
      controlDescription: row.ControlDescription ?? row.Description ?? '',
      // Toggle the active flag (API expects boolean/number as per backend)
      isActive: !(row.IsActive === 1 || row.IsActive === true)
    };

    // Minimal validation
    if (!payload.controlID) {
      this.popupInfoError('Unsuccessful', 'Control identifier missing. Cannot update status.');
      return;
    }

    // Call update API
    this.controlSvc.updateControl(payload).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res && res.success === 1) {
          // reflect change immediately (optimistic update)
          row.IsActive = payload.isActive ? 1 : 0;
          // update disableToggle count
          this.disableToggle = (this.dataSource.data || []).filter((r: any) => r && (r.IsActive === 1 || r.IsActive === true)).length;

          this.showSuccess(res.message || 'Status updated successfully.');

        } else {
          if (this.isTokenExpired(res as any)) {
            this.utils.relogin(this._document);
          } else {
            const err = res?.error?.errorMessage || 'Failed to update status.';
            this.popupInfoError('Unsuccessful', err);
          }
        }
      },
      error: () => {
        this.popupInfoError('Unsuccessful', 'Failed to update status.');
      }
    });
  }


  /* ================== BULK UPLOAD ================== */

  // File input (change) handler (bind in template)
  selectedFileDetails(evt: Event): void {
    this.resetBulkUi();

    const input = evt.target as HTMLInputElement;
    const file = (input?.files && input.files.length) ? input.files[0] : null;
    if (!file) return;

    this.fileName = file.name;
    this.filenameWithoutExtension = this.fileName.replace(/\.[^/.]+$/, '');

    const ext = (this.fileName.split('.').pop() || '').toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      this.invalidfile = true;
      this.importButtonFlag = false;
      this.validFileNameErr = true;
      return;
    }

    // Parse and validate
    this.readExcel(file)
      .then(rows => {
        const { ok, error, normalized } = this.validateAndNormalizeRows(rows);
        if (!ok) {
          this.saveerror = error || 'Invalid file.';
          this.importButtonFlag = false;
          return;
        }
        this.excelRows = normalized;
        this.importButtonFlag = this.excelRows.length > 0;
      })
      .catch(() => {
        this.saveerror = 'Unable to read the Excel file.';
        this.importButtonFlag = false;
      });
  }

  bulkUploadExcelFile(): void {
    if (!this.canFullAccess() || !this.excelRows.length) return;

    this.saveerror = '';
    this.controlSvc.addBulkControls(this.excelRows).subscribe({
      next: (res) => {
        if (res.success === 1) {
          // Show API message like: "Number of records successfully added: 1, Number of records failed to add: 0"
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
            this.showSuccess(message);
          }

          // Reset & refresh
          this.resetBulkUi(true);
          this.getGridData();
        } else {
          if (this.isTokenExpired(res as any)) {
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
            
            // Show error in popup for better visibility
            this.popupInfoError('Upload Failed', fullErrorMessage);
            this.saveerror = fullErrorMessage;
          }
        }
      },
      error: (err) => {
        const errorMsg = err?.error?.error?.errorMessage || 
                        err?.message || 
                        'Bulk upload failed due to a network or server error.';
        this.popupInfoError('Upload Failed', errorMsg);
        this.saveerror = errorMsg;
      }
    });
  }


  private showSuccess(content: string): void {
    const timeout = 3000; // 3s
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '5vh',
      panelClass: 'success',
      data: { title: 'Success', content }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.getGridData();
      }, timeout)
    });
  }


  async downloadSampleFile(): Promise<void> {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Controls', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    const headers = ['#', 'Unit Name*', 'Group Name*', 'Control Type*', 'Control Description*'];
    const sample = [
      1,
      'Retail Credit',
      'Credit & Risk',
      'Policy',
      'Ensure dual authorization for vendor payments exceeding $10,000.'
    ];

    // ✅ Color variables
    const HEADER_FILL_COLOR = 'FFED7D31';   // ARGB
    const BORDER_COLOR = 'FFED7D31';   // ARGB
    const HEADER_FONT_COLOR = 'FFFFFFFF';   // White ARGB

    ws.addRow(headers);
    ws.addRow(sample);

    // ✅ Header styling
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true, color: { argb: HEADER_FONT_COLOR } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: HEADER_FILL_COLOR }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };
    });

    // ✅ Data row styling
    const dataRow = ws.getRow(2);
    dataRow.eachCell((cell: any) => {
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } }
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });

    // ✅ Auto column widths
    for (let c = 1; c <= headers.length; c++) {
      let max = 12;
      ws.eachRow({ includeEmpty: true }, (row: any) => {
        const v = String(row.getCell(c).value ?? '');
        max = Math.max(max, v.length + 2);
      });
      ws.getColumn(c).width = Math.min(max, 60);
    }

    headerRow.height = 22;

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'RCSA_Controls_Template.xlsx');
  }



  /* ================== HELPERS ================== */
  private resetBulkUi(clearFileInput: boolean = false): void {
    this.fileName = '';
    this.filenameWithoutExtension = '';
    this.invalidfile = false;
    this.validFileNameErr = false;
    this.importButtonFlag = false;
    this.excelRows = [];
    if (clearFileInput) {
      const el = document.getElementById('file-input') as HTMLInputElement | null;
      if (el) el.value = '';
    }
  }

  private isTokenExpired(res: { error?: { errorCode?: number | string | null; errorMessage?: string | null } }): boolean {
    const code = res?.error?.errorCode;
    return code === 401 || String(code).toUpperCase() === 'TOKEN_EXPIRED';
  }

  private async readExcel(file: File): Promise<ExcelRow[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // raw header row preserved; defval '' to keep empty cells
    return XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  }

  private normalizeHeader(h: string): string {
    // Lowercase, remove spaces/underscores/dashes, strip non-alphanum
    return (h || '')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[_-]+/g, '')
      .replace(/[^a-z0-9#]/g, '');
  }

  private validateAndNormalizeRows(rows: ExcelRow[]): { ok: boolean; error?: string; normalized: BulkControlRow[] } {
    if (!rows || !rows.length) {
      return { ok: false, error: 'The uploaded file is empty.', normalized: [] };
    }

    // Build a header map from the first row's keys
    const originalHeaders = Object.keys(rows[0] || {});
    const mapping = new Map<string, string>(); // canonical -> originalHeader

    // Map original headers to canonical
    for (const oh of originalHeaders) {
      const canon = this.normalizeHeader(oh);
      // accept only known headers
      if ([...this.excelValidHeaders, ...this.excelOptionalHeaders].includes(canon) && !mapping.has(canon)) {
        mapping.set(canon, oh);
      }
    }

    // Ensure all required headers exist
    const missing = this.excelValidHeaders.filter(h => !mapping.has(h));
    if (missing.length) {
      return {
        ok: false,
        error: `Missing required column(s): ${missing.join(', ')}. Make sure headers match (spacing/case doesn't matter).`,
        normalized: []
      };
    }

    // Normalize rows into the BulkControlRow shape
    const normalized: BulkControlRow[] = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      const unitname = String(r[mapping.get('unitname') as string] ?? '').trim();
      const groupname = String(r[mapping.get('groupname') as string] ?? '').trim();
      const controltype = String(r[mapping.get('controltype') as string] ?? '').trim();
      const controldescription = String(r[mapping.get('controldescription') as string] ?? '').trim();

      // Mandatory field validation
      if (!unitname || !groupname || !controltype || !controldescription) {
        return {
          ok: false,
          error: `Row ${i + 2} has missing mandatory values. Columns required: unitname, groupname, controltype, controldescription.`,
          normalized: []
        };
      }

      normalized.push({ unitname, groupname, controltype, controldescription });
    }

    return { ok: true, normalized };
  }

  get hasData(): boolean {
    const data = this.dataSource?.data;
    return Array.isArray(data) && data.some(row => row && Object.keys(row).length > 0);
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    // Close any existing dialog with the same id before opening a new one
    const existingDialog = this.dialog.getDialogById("InfoComponent");
    if (existingDialog) {
      existingDialog.close();
    }
    
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
        this.getGridData();
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
          this.getGridData();
        }, timeout);
      } else {
        // For manual close, refresh grid when dialog is closed
        confirm.afterClosed().subscribe(() => {
          this.getGridData();
        });
      }
    });
  }

}
