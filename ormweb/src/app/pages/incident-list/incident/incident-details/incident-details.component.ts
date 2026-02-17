import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-incident-details',
    templateUrl: './incident-details.component.html',
    styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit, OnDestroy {
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    maxDate!: Date;
    incidentForm = this.fb.group({
        groupName: ['', Validators.required],
        unitName: ['', Validators.required],
        locationType: ['', Validators.required],
        team: [''],
        incidentDate: ['', Validators.required],
        incidentDesc: ['', Validators.required],
        incidentTitle: ['', Validators.required],
        recommendedAction: ['', Validators.required],
        actionTaken: ['', Validators.required],
        rca: ['', Validators.required],
        DirectLoss: [0],
        IndirectLoss: [0],
        Recoveries: [0],
        lossAmount: [0],
        identificationDate: [''],
        partyDetails: [''],
        criticality: ['', Validators.required],
        units: [''],
        incidentSource: ['', Validators.required],
        lossCategory: ['']
    });
    reportingDate!: string;
    // incident: any = { "IncidentCode": "", "GroupID": -1 };
    incident: any = { DirectLoss: 0, IndirectLoss: 0, Recoveries: 0, lossAmount: 0, IncidentCode: "", GroupID: -1 };

    isUnitValid = true;
    isSaved: boolean = false
    currency: any = environment.currency || '';
    
    // Unit allocation state
    selectedUnitId: number | null = null;
    newLossPercent: number | null = null;
    editingIndex: number | null = null;
    editingLossValue: number | null = null;
    totalExceeds100: boolean = false;

    constructor(
        private fb: FormBuilder,
        public service: IncidentService,
        public utils: UtilsService,
        public dialog: MatDialog
    ) {
        this.maxDate = new Date();
        // this.incidentForm.controls['incidentDate'].setValidators(Validators.max(new Date()))

        service.gotInfo.subscribe(value => {
            if (value == true) {
                let units = service.info?.units.filter((unit: any) => unit.UnitID == service.info.currentUserData[0].UnitIDs[0])
                // console.log("🚀 ~ IncidentDetailsComponent ~ service.info:", service.info)
                if (this.incident.IncidentCode == "" && units.length > 0) {
                    this.incident.GroupID = units[0].GroupID
                    this.incident.UnitID = units[0].UnitID
                }
                // this.currency = environment.currency || ''
            }
        })
    }

    ngOnInit(): void {
        this.reportingDate = formatDate(Date.now(), 'dd-MMM-yyyy', 'en');
        // Check total on initialization
        setTimeout(() => this.checkTotalExceeds100(), 100);
    }

    ngOnDestroy(): void {
        this.clean()
    }

    changeIncidentDate(type: string, date: MatDatepickerInputEvent<Date>) {
        this.incident.IncidentDate = this.utils.ignoreTimeZone(date.value)
    }

    changeIdentificationDate(type: string, date: MatDatepickerInputEvent<Date>) {
        this.incident.IdentificationDate = this.utils.ignoreTimeZone(date.value)
    }

    save() {
        this.isSaved = true
        let evidenceIDs: number[] = []
        if (!this.validateLossValue()) {
            this.popupInfo(`Please select the impacted units along with the loss percentage, Total Loss% should be 100`);;
        }
        else {
            if (this.service.incEvidences && this.service.incEvidences.data.length > 0) {
                this.service.incEvidences.data.forEach(evd => {
                    evidenceIDs.push(evd.EvidenceID)
                });
            }

            let impactedUnits: any[] = []
            this.service.info.units.filter((unit: any) => unit.checked).forEach((unit: any) => {
                impactedUnits.push({ "unitID": unit.UnitID, "lossValue": unit.LossValue })
            });

            let userguid = localStorage.getItem("userguid")
            const data = {
                "incidentCode": this.service.incident?.IncidentCode,
                "groupID": this.incidentForm.value.groupName,
                "unitID": this.incidentForm.value.unitName,
                "userGUID": this.incident.IncidentCode == "" ? userguid : this.incident.UserGUID,
                "locationTypeID": this.incidentForm.value.locationType,
                "incidentTeam": this.incidentForm.value.team,
                "incidentDate": this.incidentForm.value.incidentDate,
                "mobileNumber": this.incident.IncidentCode == "" ? this.service.info.currentUserData[0].MobileNumber : this.incident.MobileNumber,
                "emailID": this.incident.IncidentCode == "" ? this.service.info.currentUserData[0].EmailID : this.incident.EmailID,
                "incidentTitle": this.incidentForm.value.incidentTitle,
                "description": this.incidentForm.value.incidentDesc,
                "recommendation": this.incidentForm.value.recommendedAction,
                "action": this.incidentForm.value.actionTaken,
                "rca": this.incidentForm.value.rca,
                "incidentTypeIDs": this.service.info.incidentTypes.filter((type: any) => type.checked).map((type: any) => type.TypeID).toString() || null,
                "incidentSourceID": this.incidentForm.value.incidentSource,
                "DirectLoss": this.incidentForm.value.DirectLoss,
                "IndirectLoss": this.incidentForm.value.IndirectLoss,
                "Recoveries": this.incidentForm.value.Recoveries,
                "lossAmount": this.incidentForm.value.lossAmount,
                "identificationDate": this.incidentForm.value.identificationDate,
                "aggPartyDetails": this.incidentForm.value.partyDetails,
                "criticalityID": this.incidentForm.value.criticality,
                "impactedUnits": impactedUnits,
                "riskLossCategoryIDs": this.service.info.lossCatagories.filter((loss: any) => loss.checked).map((loss: any) => loss.CategoryID).toString() || null,
                "evidenceIDs": evidenceIDs.toString()
            };
            this.service.setIncident(data);
        }
    }

    clean() {
        this.service.info.lossCatagories.forEach((loss: any) => {
            loss.checked = false
        })
        this.service.info.incidentTypes.forEach((type: any) => {
            type.checked = false
        })
        this.service.info.units.forEach((unit: any) => {
            unit.checked = false
            unit.LossValue = null
        })
        // Reset unit allocation form state
        this.clearAddForm();
        this.cancelEdit();
    }

    edit() {
        if (this.service.incident.IncidentCode && this.service.incident.IncidentCode != "")
            this.reportingDate = formatDate(this.service.incident.ReportingDate, "dd-MMM-yyyy", "en")

        this.service.info.lossCatagories.forEach((loss: any) => {
            loss.checked = this.service.riskLossCategories.map((elm: any) => elm.RiskLossCategoryID).includes(loss.CategoryID)
        })
        this.service.info.incidentTypes.forEach((type: any) => {
            type.checked = this.service.incidentTypes.map((elm: any) => elm.TypeID).includes(type.TypeID)
        })
        this.service.info.units.forEach((unit: any) => {
            unit.checked = false
            this.service.impactedUnits.forEach((data: any) => {
                if (unit.UnitID == data.UnitID) {
                    unit.checked = true
                    unit.LossValue = data.LossValue
                }
            })
        })
        this.incident = JSON.parse(JSON.stringify(this.service.incident))
      //  // console.log('edit-this.incident::', this.incident);
        this.service.isIncidentEditable = true
        
        // Reset unit allocation form state
        this.clearAddForm();
        this.cancelEdit();
        
        // Validate unit allocation after restoring data
        this.isUnitValid = this.validateLossValue();
    }

    getLossTotal(): number {
        let lossTotal = 0
        if (this.service.info) {
            // Only sum LossValue from checked units
            let losses = this.service.info.units
                .filter((loss: any) => loss.checked)
                .map((loss: any) => Number(loss.LossValue) || 0)
            lossTotal = losses.reduce((sum: number, val: number) => sum + val, 0)
        }
        return lossTotal
    }
    
    getLossTotalWithoutCheck(): number {
        // Helper method to get total without triggering check (to avoid recursion)
        let lossTotal = 0
        if (this.service.info) {
            let losses = this.service.info.units
                .filter((loss: any) => loss.checked)
                .map((loss: any) => Number(loss.LossValue) || 0)
            lossTotal = losses.reduce((sum: number, val: number) => sum + val, 0)
        }
        return lossTotal
    }

    filteredUnits(groupID: any) {
        // // console.log('groupID: ', groupID);
        // // console.log("this.incidentForm.value.unitName",this.incidentForm.value.unitName)
        return this.service.info?.units.filter((unit: any) => unit.GroupID == groupID)
    }

    areAllChecked(): boolean {
        return this.service.info?.incidentTypes.some((type: any) => type.checked)
    }

    findInvalidControlsRecursive(formToInvestigate: FormGroup): string[] {
        var invalidControls: string[] = [];
        let recursiveFunc = (form: FormGroup) => {
            Object.keys(form.controls).forEach(field => {
                const control = form.get(field);
                if (control?.invalid) invalidControls.push(field);
                if (control instanceof FormGroup) {
                    recursiveFunc(control);
                }
            });
        }
        recursiveFunc(formToInvestigate);
        return invalidControls;
    }
    closeDialog() {
        this.close.emit(true);
    }

    onChangeSAR(changedField?: string) {
        // Ensure values are non-negative
        let direct = this._clampToNonNegative(Number(this.incidentForm.value.DirectLoss || 0));
        let indirect = this._clampToNonNegative(Number(this.incidentForm.value.IndirectLoss || 0));
        let recoveries = this._clampToNonNegative(Number(this.incidentForm.value.Recoveries || 0));
        let manualLoss = this._clampToNonNegative(Number(this.incidentForm.value.lossAmount || 0));

        // Clamp negative → 0 and sync form values
        this._syncField('DirectLoss', direct);
        this._syncField('IndirectLoss', indirect);
        this._syncField('Recoveries', recoveries);
        this._syncField('lossAmount', manualLoss);

        // Recoveries should not exceed Direct + Indirect
        const sum = direct + indirect;
        if (recoveries > sum) {
            recoveries = sum;
            this._syncField('Recoveries', recoveries);
            this.popupInfo(`Recoveries cannot exceed Direct + Indirect Loss (${sum}). Value adjusted.`);
        }

        // Recalculate LossAmount
        let calculatedLoss = sum - recoveries;
        if (calculatedLoss < 0) calculatedLoss = 0;

        // If user changed lossAmount manually, validate
        if (changedField === 'lossAmount') {
            if (manualLoss !== calculatedLoss) {
                this.popupInfo(`Loss Amount must equal (Direct + Indirect) - Recoveries. Adjusted from ${manualLoss} to ${calculatedLoss}.`);
            }
        }

        // Always update to calculatedLoss
        this._syncField('lossAmount', calculatedLoss);

        // Re-validate unit allocation when loss amounts change
        if (!this.validateLossValue()) {
            this.isUnitValid = false;
            if (calculatedLoss > 0) {
                this.popupInfo(`Please select the impacted units along with the loss percentage, Total Loss% should be 100`);
            }
        } else {
            this.isUnitValid = true;
        }
    }

    /** Helper to clamp negative values to zero */
    private _clampToNonNegative(val: number): number {
        return val < 0 || isNaN(val) ? 0 : val;
    }

    /** Helper to sync form + incident object */
    private _syncField(field: string, value: number) {
        this.incident[field] = value;
        if (this.incidentForm.get(field)) {
            this.incidentForm.get(field)!.setValue(value, { emitEvent: false });
        }
    }


    validateLossValue(): boolean {
        let checks = []
        let vLossValue: boolean;
        let lossTotal = 0
        if (this.service.info) {
            checks = this.service.info.units.filter((loss: any) => loss.checked)
            // Only sum LossValue from checked units
            let losses = this.service.info.units
                .filter((loss: any) => loss.checked)
                .map((loss: any) => Number(loss.LossValue) || 0)
            lossTotal = losses.reduce((sum: number, val: number) => sum + val, 0)
        }
        // Check form's lossAmount value (which is calculated from DirectLoss + IndirectLoss - Recoveries)
        const lossAmount = Number(this.incidentForm.value.lossAmount) || Number(this.incident.LossAmount) || 0;
        if (lossAmount > 0)
            vLossValue = lossTotal == 100
        else {
            vLossValue = true
        }
        return vLossValue
    }

    popupInfo(content: string) {
        const dialogRef = this.dialog.open(AlertComponent, {
            width: '250px',
            panelClass: "dark",
            data: {
                title: '',
                content: content
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
        });
    }
    selectedUnit(event: any, incident: any) {
        // console.log("Clicked mat-select", event, incident);
        incident.UnitID = ""
    }

    // Unit allocation methods
    getAvailableUnits(): any[] {
        if (!this.service.info?.units) return [];
        return this.service.info.units.filter((unit: any) => !unit.checked);
    }

    getAllocatedUnits(): any[] {
        if (!this.service.info?.units) return [];
        return this.service.info.units.filter((unit: any) => unit.checked);
    }

    canAddUnit(): boolean {
        if (!this.selectedUnitId || this.newLossPercent === null || this.newLossPercent === undefined) {
            return false;
        }
        const lossValue = Number(this.newLossPercent);
        if (isNaN(lossValue) || lossValue <= 0) {
            return false;
        }
        
        // Check if adding this value would exceed 100%
        const currentTotal = this.getLossTotalWithoutCheck();
        const newTotal = currentTotal + lossValue;
        return newTotal <= 100;
    }
    
    getTotalLossPercentage(): number {
        return this.getLossTotal();
    }
    
    checkTotalExceeds100(): boolean {
        const total = this.getLossTotalWithoutCheck();
        this.totalExceeds100 = total > 100;
        return this.totalExceeds100;
    }
    
    validateNewLossPercent(): void {
        // This method is called on input change to provide real-time feedback
        // The canAddUnit() method already checks if total would exceed 100%
        if (this.newLossPercent !== null && this.newLossPercent !== undefined) {
            const lossValue = Number(this.newLossPercent);
            if (!isNaN(lossValue) && lossValue > 0) {
                const currentTotal = this.getLossTotalWithoutCheck();
                const newTotal = currentTotal + lossValue;
                // Validation is handled by canAddUnit() and mat-error in template
            }
        }
        // Update total exceeds check
        this.checkTotalExceeds100();
    }
    
    validateEditLossPercent(index: number): void {
        // Real-time validation for edit mode
        // The wouldExceed100OnEdit() method checks if saving would exceed 100%
        this.checkTotalExceeds100();
    }
    
    wouldExceed100OnEdit(index: number): boolean {
        if (this.editingIndex === null || this.editingLossValue === null || this.editingLossValue === undefined) {
            return false;
        }
        
        const lossValue = Number(this.editingLossValue);
        if (isNaN(lossValue) || lossValue < 0) {
            return false;
        }
        
        const allocatedUnits = this.getAllocatedUnits();
        if (index >= 0 && index < allocatedUnits.length) {
            const unit = allocatedUnits[index];
            const currentTotal = this.getLossTotalWithoutCheck();
            const currentUnitLoss = Number(unit.LossValue) || 0;
            const newTotal = currentTotal - currentUnitLoss + lossValue;
            return newTotal > 100;
        }
        return false;
    }

    addUnit(): void {
        if (!this.canAddUnit() || !this.service.info?.units) {
            const lossValue = Number(this.newLossPercent);
            if (!isNaN(lossValue) && lossValue > 0) {
                const currentTotal = this.getLossTotalWithoutCheck();
                const newTotal = currentTotal + lossValue;
                if (newTotal > 100) {
                    this.popupInfo(`Cannot add unit. Total Loss % would exceed 100% (Current: ${currentTotal}% + New: ${lossValue}% = ${newTotal}%)`);
                }
            }
            return;
        }

        const unit = this.service.info.units.find((u: any) => u.UnitID === this.selectedUnitId);
        if (unit) {
            unit.checked = true;
            unit.LossValue = Number(this.newLossPercent);
            this.clearAddForm();
            
            // Check if total exceeds 100%
            this.checkTotalExceeds100();
            
            // Trigger validation check
            if (!this.validateLossValue()) {
                this.isUnitValid = false;
            } else {
                this.isUnitValid = true;
            }
        }
    }

    clearAddForm(): void {
        this.selectedUnitId = null;
        this.newLossPercent = null;
    }

    startEdit(index: number): void {
        const allocatedUnits = this.getAllocatedUnits();
        if (index >= 0 && index < allocatedUnits.length) {
            this.editingIndex = index;
            this.editingLossValue = allocatedUnits[index].LossValue;
        }
    }

    saveEdit(index: number): void {
        if (this.editingIndex === null || this.editingLossValue === null || this.editingLossValue === undefined) {
            return;
        }

        const lossValue = Number(this.editingLossValue);
        if (isNaN(lossValue) || lossValue < 0) {
            this.popupInfo('Loss % must be a valid number');
            return;
        }

        const allocatedUnits = this.getAllocatedUnits();
        if (index >= 0 && index < allocatedUnits.length) {
            const unit = allocatedUnits[index];
            
            // Check if editing would exceed 100%
            const currentTotal = this.getLossTotalWithoutCheck();
            const currentUnitLoss = Number(unit.LossValue) || 0;
            const newTotal = currentTotal - currentUnitLoss + lossValue;
            
            if (newTotal > 100) {
                this.popupInfo(`Cannot save. Total Loss % would exceed 100% (Current Total: ${currentTotal}%, Changing ${currentUnitLoss}% to ${lossValue}% = ${newTotal}%)`);
                return;
            }
            
            // Find the unit in service.info.units and update it
            const serviceUnit = this.service.info.units.find((u: any) => u.UnitID === unit.UnitID);
            if (serviceUnit) {
                serviceUnit.LossValue = lossValue;
            }
        }

        this.editingIndex = null;
        this.editingLossValue = null;

        // Check if total exceeds 100%
        this.checkTotalExceeds100();

        // Trigger validation check
        if (!this.validateLossValue()) {
            this.isUnitValid = false;
        } else {
            this.isUnitValid = true;
        }
    }

    cancelEdit(): void {
        this.editingIndex = null;
        this.editingLossValue = null;
    }

    removeUnit(index: number): void {
        const allocatedUnits = this.getAllocatedUnits();
        if (index < 0 || index >= allocatedUnits.length) return;

        const unit = allocatedUnits[index];
        
        // If currently editing this row, cancel edit first
        if (this.editingIndex === index) {
            this.cancelEdit();
        }

        // Find the unit in service.info.units and uncheck it
        const serviceUnit = this.service.info.units.find((u: any) => u.UnitID === unit.UnitID);
        if (serviceUnit) {
            serviceUnit.checked = false;
            serviceUnit.LossValue = null;
        }

        // Check if total exceeds 100%
        this.checkTotalExceeds100();

        // Trigger validation check
        if (!this.validateLossValue()) {
            this.isUnitValid = false;
        } else {
            this.isUnitValid = true;
        }
    }

    /**
     * Get the description for a criticality level by its ID
     * Used to display info tooltips in the incident details view
     */
    getCriticalityDescription(criticalityId: number): string {
        if (!criticalityId || !this.service.info?.incidentCriticalities) {
            return '';
        }
        const criticality = this.service.info.incidentCriticalities.find(
            (c: any) => c.CriticalityID === criticalityId
        );
        return criticality?.Description || '';
    }
}
