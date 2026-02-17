import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ExistingCyclesDialogComponent } from '../existing-cycles-dialog/existing-cycles-dialog.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-new-schedule-assessments',
  templateUrl: './new-schedule-assessments.component.html',
  styleUrls: ['./new-schedule-assessments.component.scss']
})
export class NewScheduleAssessmentsComponent implements OnInit {
  copy: any;
  AssessmentPeriodDS: any;
  reviewerDS: any;
  saveerror: string = '';
  userSame: boolean = false;

  // --- Properties for ALL vs Individual mode ---
  /** ALL departments from master data */
  allDepartments: any[] = [];
  /** ALL units from master data */
  allUnits: any[] = [];
  /** Existing scheduled cycles for the selected period */
  existingCycles: any[] = [];

  masterForm = new FormGroup({
    schedulePeriod: new FormControl<string | null>(null, Validators.required),
    txtProsessedStartDate: new FormControl<Date | null>(null, Validators.required),
    txtProsessedEndDate: new FormControl<Date | null>(null, Validators.required),
    ddlReviewer1: new FormControl<number | null>(null, Validators.required),
    ddlReviewer2: new FormControl<number | null>(null, Validators.required),
    txtRateId: new FormControl<string | null>(""),
    txtDescription: new FormControl<string | null>(""),
    reminderDate: new FormControl<Date | null>(null, Validators.required),
    isInternalReviewRequired: new FormControl<boolean>(false),
    // Form controls for ALL vs Individual mode (multi-select)
    selectionMode: new FormControl<string>('ALL'),
    departmentIds: new FormControl<number[]>([], { nonNullable: true }),
    unitIds: new FormControl<number[]>([], { nonNullable: true })
  });

  selectedPeriodYearValue: number = new Date().getFullYear();
  selectedPeriodQuarterValue: number = Math.floor(new Date().getMonth() / 3 + 1);
  minDate: Date | null = null;
  maxDate: Date | null = null;
  radioSelect: boolean = false
  ScheduleAssessStatusID: any;

  constructor(
    private service: ScheduleAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    private overAllInherentRiskService: OverAllInherentRiskRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewScheduleAssessmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data))
    }
  }

  ngOnInit(): void {
    // Load page data first; departments/units load AFTER this completes (sequential token logic)
    this.getPageLoad();

    this.masterForm.get('schedulePeriod')?.valueChanges.subscribe(x => {
      let quarter = (x || '')?.split(',')[0].toString().trim();
      this.selectedPeriodYearValue = Number((x || '')?.split(',')[1].toString().trim());
      this.selectedPeriodQuarterValue = Number(quarter.substring(quarter.length - 1));
      this.masterForm.get('txtProsessedStartDate')?.reset();
      this.masterForm.get('txtProsessedEndDate')?.reset();

      // When period changes, refresh existing cycles only (sequential - one call at a time)
      this.loadExistingScheduledCycles();
    })
    this.masterForm.get('txtProsessedStartDate')?.valueChanges.subscribe(() => this.onDateChange());
    this.masterForm.get('txtProsessedEndDate')?.valueChanges.subscribe(() => this.onDateChange());

    // Listen for selection mode changes
    this.masterForm.get('selectionMode')?.valueChanges.subscribe((mode: string | null) => {
      this.onSelectionModeChange(mode || 'ALL');
    });

    // When departments change, remove unit selections that no longer belong to selected departments
    this.masterForm.get('departmentIds')?.valueChanges.subscribe(() => {
      this.pruneUnitSelections();
    });
  }

  getPageLoad(): void {
    let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.mode == "add" ? 0 : this.copy.ScheduleAssessmentID }
    this.configScoreRatingService.getDataForManageScheduleAssessmentScreen(obj).subscribe(data => {
      next: {
        this.processScheduleAssessmentPeriod(data);
        this.processReviewer(data);
        // Load departments/units AFTER page load completes (sequential token refresh)
        this.loadDepartmentsAndUnits();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.copy.mode == "edit") {
        this.setEditData();
      }
    }, 0);
  }

  onDateChange() {
    const start = this.masterForm.controls['txtProsessedStartDate'].value;
    const end = this.masterForm.controls['txtProsessedEndDate'].value;

    this.minDate = start || null;
    this.maxDate = end || null;

    const rem = this.masterForm.controls['reminderDate'].value;
    if (rem && ((this.minDate && rem < this.minDate) || (this.maxDate && rem > this.maxDate))) {
      this.masterForm.controls['reminderDate'].setValue(null, { emitEvent: false });
    }
  }


  valueChanged(event: any) {
    if (this.masterForm.controls['txtProsessedStartDate'].value !== null && this.masterForm.controls['txtProsessedEndDate'].value !== null) {
      this.minDate = this.masterForm.controls['txtProsessedStartDate'].value;
      this.maxDate = this.masterForm.controls['txtProsessedEndDate'].value;
    }
  }

  private asDate(v: any): Date | null {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v);
  }

  setEditData(): void {
    const start = this.asDate(this.copy.ProposedStartDate);
    const end = this.asDate(this.copy.ProposedCompletionDate);
    const reminder = this.asDate(this.copy.ReminderDate);

    // Patch non-date fields without triggering valueChanges
    this.masterForm.patchValue({
      schedulePeriod: this.copy.SchedulePeriod,
      ddlReviewer1: this.copy.PrimaryReviewerID,
      ddlReviewer2: this.copy.SecondaryReviewerID,
      txtRateId: this.copy.ScheduleAssessmentID,
      txtDescription: this.copy.ScheduleAssessmentDescription,
      isInternalReviewRequired: !!this.copy.IsInternalReviewRequired,
      selectionMode: this.copy.SelectionMode || 'ALL'
    }, { emitEvent: false });

    // Apply validators based on selection mode
    this.onSelectionModeChange(this.copy.SelectionMode || 'ALL');

    // Patch dates without emitting, then compute min/max, then set reminder
    this.masterForm.get('txtProsessedStartDate')!.setValue(start, { emitEvent: false });
    this.masterForm.get('txtProsessedEndDate')!.setValue(end, { emitEvent: false });

    // update the [min]/[max] bounds
    this.minDate = start;
    this.maxDate = end;

    // finally set reminder (still no emission)
    this.masterForm.get('reminderDate')!.setValue(reminder, { emitEvent: false });

    // NOTE: Do NOT call loadExistingScheduledCycles() here.
    // It is chained AFTER loadDepartmentsAndUnits() completes to keep API calls sequential.
  }



  getScheduleAssessmentPeriod() {
    let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.ScheduleAssessmentID };
    this.configScoreRatingService.getScheduleAssessmentScreen(obj).subscribe(res => {
      next:
      this.processScheduleAssessmentPeriod(res);
    });
  }

  processScheduleAssessmentPeriod(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ScheduleAssessmentInfo.length) {
        this.ScheduleAssessStatusID = data.result.recordset.ScheduleAssessmentInfo[0].ScheduleAssessmentStatusID;
        const info = data.result.recordset.ScheduleAssessmentInfo[0];
        if (this.copy?.mode === 'edit' && info?.IsInternalReviewRequired !== undefined) {
          this.masterForm.patchValue({
            isInternalReviewRequired: !!info.IsInternalReviewRequired
          });
        }
      }
      if (data.result.recordset.SchedeuleAssessmentPeriod.length > 0) {
        this.AssessmentPeriodDS = data.result.recordset.SchedeuleAssessmentPeriod;
        if (this.copy.mode == 'edit') {
          let period = this.AssessmentPeriodDS.find((s: any) => s.SchedulePeriod == this.copy.SchedulePeriod);
          if (period == undefined) {
            this.AssessmentPeriodDS.push({ SchedulePeriod: this.copy.SchedulePeriod });
          }
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }


  getReviewer(): void {
    this.service.getActiveReviewer().subscribe(res => {
      next:
      this.processReviewer(res);
    });
  }

  processReviewer(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Reviewer.length > 0) {
        this.reviewerDS = data.result.recordset.Reviewer;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getError(): any {
    if (this.masterForm.get('ddlReviewer1')?.touched || this.masterForm.get('ddlReviewer2')?.touched) {
      if (this.masterForm.get('ddlReviewer1')?.value === this.masterForm.get('ddlReviewer2')?.value) {
        this.userSame = true;
        console.log('this.saveerror: ' + this.userSame)
        return "Reviewer(s) cannot be same";
      } else {
        this.userSame = false;
      }
    }
  }

  validateSave(): void {
    this.saveerror = '';
    const selectedUnitIds = this.masterForm.get('unitIds')?.value || [];
    const selectionMode = this.masterForm.get('selectionMode')?.value || 'ALL';

    let obj: any = {
      "schedulePeriod": this.masterForm.get('schedulePeriod')?.value,
      "proposedStartDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedStartDate')?.value),
      "proposedCompletionDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedEndDate')?.value),
      "primaryReviewerID": this.masterForm.get('ddlReviewer1')?.value,
      "secondaryReviewerID": this.masterForm.get('ddlReviewer2')?.value,
      "scheduleAssessmentDescription": this.masterForm.get('txtDescription')?.value,
      "reminderDate": this.utils.ignoreTimeZone(this.masterForm.get('reminderDate')?.value),
      "isInternalReviewRequired": this.masterForm.get('isInternalReviewRequired')?.value,
      // Multi-unit support
      "selectionMode": selectionMode,
      "unitIds": selectionMode === 'INDIVIDUAL' ? selectedUnitIds : []
    };

    if (this.masterForm.get('txtRateId')?.value == "" || this.masterForm.get('txtRateId')?.value == null) {
      this.service.addNew(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
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
    else {
      obj.id = this.masterForm.get('txtRateId')?.value;
      this.service.updateData(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
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
      }, timeout)
    });
  }

  quaterDetailsData(): any {
    let year = this.selectedPeriodYearValue;
    let quarterValue = this.selectedPeriodQuarterValue;
    if (quarterValue === 1) {
      return {
        startQuaterDate: new Date(year, 0, 1),
        endQuaterDate: new Date(year, 3, 0)
      }
    }
    if (quarterValue === 2) {
      return {
        startQuaterDate: new Date(year, 3, 1),
        endQuaterDate: new Date(year, 6, 0)
      }
    }
    if (quarterValue === 3) {
      return {
        startQuaterDate: new Date(year, 6, 1),
        endQuaterDate: new Date(year, 9, 0)
      }
    }
    if (quarterValue === 4) {
      return {
        startQuaterDate: new Date(year, 9, 1),
        endQuaterDate: new Date(year, 12, 0)
      }
    }
  }

  selectRadio() {
    this.radioSelect = true
  }

  // =====================================================================
  // ALL vs Individual mode logic (Multi-select support)
  // =====================================================================

  /** Returns true when mode is 'INDIVIDUAL' */
  get isIndividualMode(): boolean {
    return this.masterForm.get('selectionMode')?.value === 'INDIVIDUAL';
  }

  /** Returns true when in edit mode (post-save) */
  get isEditMode(): boolean {
    return this.copy?.mode === 'edit';
  }

  /** Set selection mode (called from slide-toggle click) */
  setSelectionMode(mode: string): void {
    this.masterForm.get('selectionMode')?.setValue(mode);
  }

  /** Handle toggle between ALL and INDIVIDUAL (triggered by valueChanges) */
  onSelectionModeChange(mode: string): void {
    if (mode === 'ALL') {
      // Clear department and unit selections, remove validators
      this.masterForm.get('departmentIds')?.clearValidators();
      this.masterForm.get('unitIds')?.clearValidators();
      this.masterForm.get('departmentIds')?.setValue([], { emitEvent: false });
      this.masterForm.get('unitIds')?.setValue([], { emitEvent: false });
    } else {
      // Add required validators for Individual mode (at least one selection)
      this.masterForm.get('departmentIds')?.setValidators(this.arrayRequiredValidator);
      this.masterForm.get('unitIds')?.setValidators(this.arrayRequiredValidator);
    }
    this.masterForm.get('departmentIds')?.updateValueAndValidity({ emitEvent: false });
    this.masterForm.get('unitIds')?.updateValueAndValidity({ emitEvent: false });
  }

  /** Custom validator: array must have at least one element */
  arrayRequiredValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length === 0) {
      return { 'required': true };
    }
    return null;
  }

  /** Load all departments and units from master data */
  loadDepartmentsAndUnits(): void {
    this.service.getDepartmentsAndUnitsForSchedule().subscribe((res: any) => {
      if (res.success == 1) {
        this.allDepartments = res.result?.recordset?.departments || [];
        this.allUnits = res.result?.recordset?.units || [];

        // In edit mode, load unit mappings AFTER departments/units complete (sequential token refresh)
        if (this.copy?.mode === 'edit') {
          this.loadAssessmentUnitMappings();
        }
      } else {
        if (res?.error?.errorCode === "TOKEN_EXPIRED") {
          this.utils.relogin(this._document);
        }
      }
    });
  }

  /** Load existing unit mappings for this assessment (edit mode) */
  loadAssessmentUnitMappings(): void {
    if (!this.copy?.ScheduleAssessmentID) return;

    this.service.getScheduleAssessmentUnits({ scheduleAssessmentID: this.copy.ScheduleAssessmentID }).subscribe((res: any) => {
      if (res.success == 1) {
        const unitMappings: any[] = res.result?.recordset?.unitMappings || [];

        if (unitMappings.length > 0) {
          // Extract unique department IDs and unit IDs from line table mappings
          const deptIds = [...new Set(unitMappings.map((m: any) => m.DepartmentId))];
          const unitIdsList = unitMappings.map((m: any) => m.UnitID);

          // Pre-select departments and units
          this.masterForm.get('departmentIds')?.setValue(deptIds, { emitEvent: false });
          this.masterForm.get('unitIds')?.setValue(unitIdsList, { emitEvent: false });
          this.masterForm.get('departmentIds')?.updateValueAndValidity({ emitEvent: false });
          this.masterForm.get('unitIds')?.updateValueAndValidity({ emitEvent: false });
        }
      }

      // Load existing cycles AFTER unit mappings (sequential API calls)
      if (this.masterForm.get('schedulePeriod')?.value) {
        this.loadExistingScheduledCycles();
      }
    });
  }

  /** Returns units filtered by the currently selected departments (multi-select) */
  get filteredUnits(): any[] {
    const deptIds: number[] = this.masterForm.get('departmentIds')?.value || [];
    if (!deptIds || deptIds.length === 0) return [];
    return this.allUnits.filter((u: any) => deptIds.includes(u.GroupID));
  }

  /** When departments change, remove any unit selections that no longer belong to selected departments */
  pruneUnitSelections(): void {
    const deptIds: number[] = this.masterForm.get('departmentIds')?.value || [];
    const currentUnitIds: number[] = this.masterForm.get('unitIds')?.value || [];
    if (currentUnitIds.length === 0) return;

    // Only keep units that belong to currently selected departments
    const validUnitIds = currentUnitIds.filter(uid => {
      const unit = this.allUnits.find((u: any) => u.UnitID === uid);
      return unit && deptIds.includes(unit.GroupID);
    });

    if (validUnitIds.length !== currentUnitIds.length) {
      this.masterForm.get('unitIds')?.setValue(validUnitIds, { emitEvent: false });
    }
  }

  /** Load existing scheduled cycles for the selected period */
  loadExistingScheduledCycles(): void {
    const period = this.masterForm.get('schedulePeriod')?.value;
    if (!period) {
      this.existingCycles = [];
      return;
    }
    this.service.getExistingScheduledCycles({ schedulePeriod: period }).subscribe((res: any) => {
      if (res.success == 1) {
        this.existingCycles = res.result?.recordset?.existingCycles || [];
      } else {
        this.existingCycles = [];
        if (res?.error?.errorCode === "TOKEN_EXPIRED") {
          this.utils.relogin(this._document);
        }
      }
    });
  }

  /** Open the existing cycles dialog (info icon click) */
  openExistingCyclesDialog(): void {
    const period = this.masterForm.get('schedulePeriod')?.value;
    if (!period) return;

    // Fetch fresh data and then open the dialog
    this.service.getExistingScheduledCycles({ schedulePeriod: period }).subscribe((res: any) => {
      let cycles: any[] = [];
      if (res.success == 1) {
        cycles = res.result?.recordset?.existingCycles || [];
      }

      // Filter by department/unit if in Individual mode
      const selectionMode = this.masterForm.get('selectionMode')?.value;
      if (selectionMode === 'INDIVIDUAL') {
        const deptIds: number[] = this.masterForm.get('departmentIds')?.value || [];
        const unitIdsList: number[] = this.masterForm.get('unitIds')?.value || [];

        if (deptIds.length > 0) {
          const deptNames = deptIds.map(id => this.getDepartmentName(id)).filter(n => n);
          cycles = cycles.filter((c: any) =>
            c.SelectionMode === 'ALL' || deptNames.includes(c.DepartmentName)
          );
        }
        if (unitIdsList.length > 0) {
          const unitNames = unitIdsList.map(id => this.getUnitName(id)).filter(n => n);
          cycles = cycles.filter((c: any) =>
            c.SelectionMode === 'ALL' || unitNames.includes(c.UnitName)
          );
        }
      }

      this.dialog.open(ExistingCyclesDialogComponent, {
        disableClose: false,
        width: '90vh',
        minHeight: '30vh',
        data: {
          cycles: cycles,
          period: period
        }
      });
    });
  }

  /** Get department name by ID */
  getDepartmentName(deptId: number | null | undefined): string {
    if (!deptId) return '';
    const dept = this.allDepartments.find((d: any) => d.GroupID === deptId);
    return dept ? dept.Name : '';
  }

  /** Get unit name by ID */
  getUnitName(unitId: number | null | undefined): string {
    if (!unitId) return '';
    const unit = this.allUnits.find((u: any) => u.UnitID === unitId);
    return unit ? unit.Name : '';
  }

  /** Compare function for mat-select to properly handle pre-selection */
  compareIds(id1: number, id2: number): boolean {
    return id1 === id2;
  }
}
