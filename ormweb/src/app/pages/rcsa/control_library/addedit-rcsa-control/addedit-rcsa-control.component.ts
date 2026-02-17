import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlLibraryService, Group, Unit, ControlType, AddControlRequest } from 'src/app/services/rcsa/control_library/control-library.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Component({
  selector: 'app-addedit-rcsa-control',
  templateUrl: './addedit-rcsa-control.component.html',
  styleUrls: ['./addedit-rcsa-control.component.scss']
})
export class AddeditRcsaControlComponent implements OnInit {
  copy: any; // dialog data clone (contains mode and optionally the record)
  saveerror = '';

  groupDS: Group[] = [];
  unitDS: Unit[] = [];      // filtered units for selected group
  unitsAll: Unit[] = [];    // all units (for local filtering)
  controlTypeDS: ControlType[] = [];

  masterForm = new FormGroup({
    ddlGroup: new FormControl<number | null>(null, [Validators.required]),
    ddlUnit: new FormControl<number | null>(null, [Validators.required]),
    ddlControlType: new FormControl<number | null>(null, [Validators.required]),
    txtDescription: new FormControl<string>('', [Validators.required, Validators.maxLength(1000)]),
    txtControlId: new FormControl<number | null>(null) // hidden; used for edit
  });

  constructor(
    private controlSvc: ControlLibraryService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddeditRcsaControlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data));
    }
  }

  ngOnInit(): void {
    this.loadMasterData();
  }

  /* -------------------- DATA LOADING -------------------- */
  private loadMasterData(): void {
    // Load groups, units, control types (and users if needed later)
    this.controlSvc.getMasterData().subscribe({
      next: res => {
        if (res.success === 1) {
          const rec = res.result?.recordset;
          this.groupDS = rec?.Groups ?? [];
          this.unitsAll = rec?.Units ?? [];
          this.controlTypeDS = rec?.ControlTypes ?? [];

          // Edit mode: prefill and filter units to the selected group
          if (this.copy?.mode === 'edit') {
            this.patchEditValues();
          }
        } else {
          if (res.error?.errorCode === 'TOKEN_EXPIRED') {
            this.utils.relogin(this._document);
          } else {
            this.saveerror = res.error?.errorMessage ?? 'Failed to load master data';
          }
        }
      },
      error: _ => {
        this.saveerror = 'Failed to load master data';
      }
    });
  }

  private patchEditValues(): void {
    // Filter units for the GroupID of the record
    this.unitDS = this.unitsAll.filter(u => u.GroupID === this.copy.GroupID);

    this.masterForm.patchValue({
      ddlGroup: this.copy.GroupID,
      ddlUnit: this.copy.UnitID,
      ddlControlType: this.copy.ControlTypeID,
      txtDescription: this.copy.ControlDescription,
      txtControlId: this.copy.ControlID
    });
  }


  /* -------------------- UI EVENTS -------------------- */
  groupOnChange(): void {
    const groupId = this.masterForm.get('ddlGroup')?.value ?? 0;
    this.unitDS = this.unitsAll.filter(u => u.GroupID === groupId);
    // Reset Unit when Group changes
    this.masterForm.patchValue({ ddlUnit: null });
  }

  /* -------------------- SAVE -------------------- */
  validateSave(): void {
    this.saveerror = '';

    const payload: AddControlRequest = {
      unitID: this.masterForm.get('ddlUnit')?.value as number,
      groupID: this.masterForm.get('ddlGroup')?.value as number,
      controlTypeID: this.masterForm.get('ddlControlType')?.value as number,
      controlDescription: (this.masterForm.get('txtDescription')?.value || '').trim(),
      isActive:true
    };

    const isEdit = this.copy?.mode === 'edit';
    const controlId = this.masterForm.get('txtControlId')?.value;

    if (isEdit && controlId) {
      payload.controlID = controlId; // include @ControlID for update
      this.updateControl(payload);
    } else {
      // Ensure we don't accidentally send a number for add
      delete (payload as any).controlID;
      this.addControl(payload);
    }
  }

  private addControl(payload: AddControlRequest): void {
    this.controlSvc.addControl(payload).subscribe({
      next: res => {
        if (res.success === 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message || 'Control added successfully.');
        } else {
          if (res.error?.errorCode === 'TOKEN_EXPIRED') {
            this.utils.relogin(this._document);
          } else {
            this.saveerror = res.error?.errorMessage || 'Unable to add control.';
          }
        }
      },
      error: _ => {
        this.saveerror = 'Unable to add control.';
      }
    });
  }

  private updateControl(payload: AddControlRequest): void {
    this.controlSvc.updateControl(payload).subscribe({
      next: res => {
        if (res.success === 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message || 'Control updated successfully.');
        } else {
          if (res.error?.errorCode === 'TOKEN_EXPIRED') {
            this.utils.relogin(this._document);
          } else {
            this.saveerror = res.error?.errorMessage || 'Unable to update control.';
          }
        }
      },
      error: _ => {
        this.saveerror = 'Unable to update control.';
      }
    });
  }

  /* -------------------- UX HELPERS -------------------- */
  saveSuccess(content: string): void {
    const timeout = 3000; // 3s
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '5vh',
      panelClass: 'success',
      data: { title: 'Success', content }
    });
    confirm.afterOpened().subscribe(() => setTimeout(() => confirm.close(), timeout));
  }

  get selectedGroupName(): string {
    const id = this.masterForm.get('ddlGroup')?.value;
    return this.groupDS.find(g => g.GroupID === id)?.Name ?? '';
  }

  get selectedUnitName(): string {
    const id = this.masterForm.get('ddlUnit')?.value;
    return this.unitDS.find(u => u.UnitID === id)?.Name ?? '';
  }

}
