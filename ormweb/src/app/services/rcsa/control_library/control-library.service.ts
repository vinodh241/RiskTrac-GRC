import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* ========= Shared / Generic ========= */
export interface ApiResponse<T> {
  success: number;
  message: string;
  result: T;
  token?: string;
  error: { 
    errorCode: number | string | null; 
    errorMessage: string | null;
    details?: {
      rowNumber?: number;
      field?: string;
      reason?: string;
      technicalMessage?: string;
    } | null;
  };
}

/* ========= Control Records ========= */
export interface ControlRecord {
  ControlID: number;
  ControlCode: string;
  ControlDescription: string;
  ControlTypeID: number;
  ControlType: string;
  UnitID: number;
  UnitName: string;
  GroupID: number;
  GroupName: string;
  IsPublished: boolean;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedDate: string;
  CreatedBy: string;
  LastUpdatedDate: string;
  LastUpdatedBy: string;
}

export interface ControlLibraryResult {
  status: number;
  recordset: ControlRecord[];
  errorMsg: string | null;
  procedureSuccess: boolean;
  procedureMessage: string;
}

/* ========= Master Data ========= */
export interface ControlType {
  ControlTypeID: number;
  ControlType: string;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedDate: string;
  CreatedBy: string;
  LastUpdatedDate: string;
  LastUpdatedBy: string;
}

export interface Group {
  GroupID: number;
  Name: string;
  Abbreviation: string;
  Description: string;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedDate: string;
  CreatedBy: string;
  LastUpdatedDate: string;
  LastUpdatedBy: string;
}

export interface Unit {
  UnitID: number;
  GroupID: number;
  Name: string;
  Abbreviation: string;
  Description: string;
  IsModuleOwner: boolean;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedDate: string;
  CreatedBy: string;
  LastUpdatedDate: string;
  LastUpdatedBy: string;
}

export interface MasterUser {
  UserGUID: string;
  UserName: string;
  UnitName: string;
  FullName: string;
}

export interface ControlLibraryMasterRecordset {
  ControlTypes: ControlType[];
  Groups: Group[];
  Units: Unit[];
  Users: MasterUser[];
}

export interface ControlLibraryMasterResult {
  status: number;
  recordset: ControlLibraryMasterRecordset;
  errorMsg: string | null;
  procedureSuccess: boolean;
  procedureMessage: string;
}

/* ========= Add / Update ========= */
export interface AddControlRequest {
  unitID: number;
  groupID: number;
  controlID?: number | null;   // add: null/omit; update: required
  controlTypeID: number;
  controlDescription: string;
  isActive: boolean | number
}

/* ========= Bulk Add ========= */
export interface BulkControlRow {
  unitname: string;            // e.g., "Retail Credit"
  groupname: string;           // e.g., "Credit & Risk"
  controltype: string;         // e.g., "Policy" | "Process" | "System" | "People" | "NA"
  controldescription: string;
}

export interface BulkAddResult {
  validData: BulkControlRow[];
  inValidData: BulkControlRow[];
  dbOutput: ControlRecord[];
}

export interface ApiResponseBulkAdd {
  success: number;
  message: string;
  result: BulkAddResult;
  token?: string;
  error: { 
    errorCode: number | string | null; 
    errorMessage: string | null;
    details?: {
      rowNumber?: number;
      field?: string;
      reason?: string;
      technicalMessage?: string;
    } | null;
  };
}

@Injectable({ providedIn: 'root' })
export class ControlLibraryService extends RestService {

  /* ====== GET: All controls ====== */
  getAll(): Observable<ApiResponse<ControlLibraryResult>> {
    return this.post('/rcsa/controllibrary/get-all-control-library-data', {});
  }

  /** Convenience: just the recordset */
  getAllRecords(): Observable<ControlRecord[]> {
    return this.getAll().pipe(map(res => res?.result?.recordset ?? []));
  }

  /* ====== GET: Master data (types, groups, units, users) ====== */
  getMasterData(): Observable<ApiResponse<ControlLibraryMasterResult>> {
    return this.post('/rcsa/controllibrary/get-control-library-master-data', {});
    // token is injected by RestService (body/headers per your implementation)
  }

  getControlTypes(): Observable<ControlType[]> {
    return this.getMasterData().pipe(
      map(r => r?.result?.recordset?.ControlTypes ?? [])
    );
  }

  getGroups(): Observable<Group[]> {
    return this.getMasterData().pipe(
      map(r => r?.result?.recordset?.Groups ?? [])
    );
  }

  getUnits(groupId?: number): Observable<Unit[]> {
    return this.getMasterData().pipe(
      map(r => {
        const units = r?.result?.recordset?.Units ?? [];
        return typeof groupId === 'number' ? units.filter(u => u.GroupID === groupId) : units;
      })
    );
  }

  getUsers(): Observable<MasterUser[]> {
    return this.getMasterData().pipe(
      map(r => r?.result?.recordset?.Users ?? [])
    );
  }

  /* ====== POST: Add control ====== */
  addControl(payload: AddControlRequest): Observable<ApiResponse<ControlLibraryResult>> {
    return this.post('/rcsa/controllibrary/add-control-data', payload);
  }

  /** Returns created/updated record directly */
  addControlAndGet(payload: AddControlRequest): Observable<ControlRecord | null> {
    return this.addControl(payload).pipe(
      map(res => res?.result?.recordset?.[0] ?? null)
    );
  }

  /* ====== POST: Update control ====== */
  updateControl(payload: AddControlRequest): Observable<ApiResponse<ControlLibraryResult>> {
    return this.post('/rcsa/controllibrary/update-control-data', payload);
  }

  /** Returns updated record directly */
  updateControlAndGet(payload: AddControlRequest): Observable<ControlRecord | null> {
    return this.updateControl(payload).pipe(
      map(res => res?.result?.recordset?.[0] ?? null)
    );
  }

  /* ====== POST: Bulk add controls ====== */
  /** Backend expects ControlsData as a JSON string */
  addBulkControlsRaw(controlsDataJson: string): Observable<ApiResponseBulkAdd> {
    return this.post('/rcsa/controllibrary/add-bulk-control-data', { ControlsData: controlsDataJson });
  }

  /** Convenience: pass array of rows; we stringify for you */
  addBulkControls(rows: BulkControlRow[]): Observable<ApiResponseBulkAdd> {
    return this.addBulkControlsRaw(JSON.stringify(rows));
  }

  /** Helpers to access parts of the bulk response */
  addBulkControlsAndGetDbOutput(rows: BulkControlRow[]): Observable<ControlRecord[]> {
    return this.addBulkControls(rows).pipe(
      map(res => res?.result?.dbOutput ?? [])
    );
  }

  addBulkControlsAndGetSummary(rows: BulkControlRow[]): Observable<{ message: string; valid: number; invalid: number }> {
    return this.addBulkControls(rows).pipe(
      map(res => ({
        message: res?.message ?? '',
        valid: res?.result?.validData?.length ?? 0,
        invalid: res?.result?.inValidData?.length ?? 0
      }))
    );
  }
}
