import { Component, Inject, OnInit } from '@angular/core';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { KRI_THRESHOLD_TYPE } from 'src/app/core-shared/commonFunctions';

@Component({
    selector: 'app-kri-definition',
    templateUrl: './kri-definition.component.html',
    styleUrls: ['./kri-definition.component.scss']
})
export class KriDefinitionComponent implements OnInit {
    selection: any = 1;
    kriTypeID: any;
    thresholdValue1: any;
    thresholdValue2: any;
    thresholdValue3: any;
    thresholdValue4: any;
    thresholdValue5: any;
    target: any[] = [{ Idx: 1, value: '0%', target: 0 }, { Idx: 2, value: '100%', target: 100 }];
    saveerror: any;
    isMax = false;
    kriData: any = this.data.row
    units: any;
    maxValue: any;
    minValue: any;
    defineKRIForm!: FormGroup
    allMasterEmail: any = [];
    emailFrequency: any;
    isError: boolean = false;
    equalsCheck: boolean = false;
    inherentRisks:any[] = [];
    /** Threshold type for display: PERCENTAGE shows '%', NUMBER shows value only. Default PERCENTAGE for existing KRIs. */
    thresholdType: 'PERCENTAGE' | 'NUMBER' = 'PERCENTAGE';
    constructor(
        public service: KriService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<KriDefinitionComponent>,
        @Inject(DOCUMENT) private _document: any,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this.defineKRIForm = this.fb.group({
            groupID: ["", Validators.required],
            unitID: ["", Validators.required],
            inherentRisk: [""],
            keyRiskIndicator: ["", Validators.required],
            measurementFrequencyID: ["", Validators.required],
            typeID: ["", Validators.required],
            value4: ["", Validators.required],
            value3: ["", Validators.required],
            value2: ["", Validators.required],
            minimum: ["", Validators.required],
            maximum: ["", Validators.required]
        })

        // Run init as async flow
        this.initData();

        this.defineKRIForm.get("maximum")?.value
        this.defineKRIForm.get("minimum")?.value
        this.getEdited()
        this.minimize()
        this.defineKRIForm.get('maximum')?.valueChanges.subscribe(() => this.onMinMaxRange());
        this.defineKRIForm.get('minimum')?.valueChanges.subscribe(() => this.onMinMaxRange());
    }

    private async initData() {
        await this.service.getKriMaster();
        this.service.gotMaster.subscribe(value => {
            if (value) {
                this.allMasterEmail = this.service.master.emailData;
                this.inherentRisks = this.service.inherentRisks;
                // console.log('this.inherentRisks::', this.inherentRisks);

                if (this.allMasterEmail.length) {
                    this.emailFrequency = this.allMasterEmail.filter(
                        (ele: any) =>
                            this.data.reportingFrequencies.FrequencyID === ele.EmailFrequencyID
                    );
                }
            }
        });

    }

    onMinMaxRange() {
        this.defineKRIForm.controls['value2'].setValue(null);
        this.defineKRIForm.controls['value3'].setValue(null);
        this.defineKRIForm.controls['value4'].setValue(null);
    }

    maximize() {
        this.isMax = true;
        this.dialogRef.updateSize('100%', '100%');
    }

    minimize() {
        this.isMax = false;
        this.dialogRef.updateSize('85%', '90%');
    }

    getEdited(): any {
        // console.log(this.kriData.ThresholdValue5)
        if (this.kriData?.ThresholdValue5 == 100) {
            this.selection = 2
        } else {
            this.selection = 1
        }
        if (this.kriData?.ThresholdType === KRI_THRESHOLD_TYPE.NUMBER) {
            this.thresholdType = 'NUMBER';
        } else {
            this.thresholdType = 'PERCENTAGE';
        }
    }

    getKriCode(): any {
        if (this.data.mode === 'add') {
            return null
        } else {
            return this.kriData.KriCode
            // return "KRI-001"
        }
    }



    filteredAddUnits() {
        return this.data.units.filter((unit: any) => unit.GroupID === this.defineKRIForm.value.groupID);
    }

    filteringEditUnits(): any {
        return this.data.units.filter((unit: any) => unit.GroupID === this.filterGroupsId(this.defineKRIForm.value.groupID));
    }

    filterGroupsId(data: any): any {
        let groupId = this.data.groups.filter((group: any) => group.GroupName === this.defineKRIForm.value.groupID)
        return groupId[0].GroupID
    }

    filteredAddInherentRisk() {
        return this.inherentRisks.filter((inherentRisk: any) => inherentRisk.UnitID === this.defineKRIForm.value.unitID);
    }

    filteringEditInherentRisk() {
        return this.inherentRisks.filter((inherentRisk: any) => inherentRisk.UnitID === this.filterUnitsId(this.defineKRIForm.value.unitID));
    }

    filterUnitsId(data: any): any {
        let unitId: any[] = this.data.units.filter((unit: any) => unit.UnitID === this.defineKRIForm.value.unitID);
        return unitId[0].UnitID
    }

    colors: any = {
        color5: this.data.thresholds[4].ColorCode,
        color4: this.data.thresholds[3].ColorCode,
        color3: this.data.thresholds[2].ColorCode,
        color2: this.data.thresholds[1].ColorCode,
        color1: this.data.thresholds[0].ColorCode,
    }
    threshold: any = {
        thresholds5: this.data.thresholds[4].Value,
        thresholds4: this.data.thresholds[3].Value,
        thresholds3: this.data.thresholds[2].Value,
        thresholds2: this.data.thresholds[1].Value,
        thresholds1: this.data.thresholds[0].Value,
    }

    thresholdValues5(): any {
        if (this.selection == 1) {
            return 0
        } else {
            return 100
        }
    }

    getLastValue(): any {
        this.defineKRIForm.get("minimum")?.value
    }

    getIncrement(data: any): any {
        return data + 1
    }
    getMin(min: any, max: any): any {
        let val = min < max ? min : max;
        // console.log(' getMin  val:   '+val)
        return val;
    }
    getMax(min: any, max: any): any {
        let val = min > max ? min : max;
        // console.log(' getMax  val:   '+val)
        return val;
    }

    /** Effective min for threshold values: 0 when Percentage, else min of target range. */
    getThresholdMin(): number {
        if (this.thresholdType === 'PERCENTAGE') {
            return 0;
        }
        const min = this.defineKRIForm.get('minimum')?.value;
        const max = this.defineKRIForm.get('maximum')?.value;
        return Number(this.getMin(min, max));
    }

    /** Effective max for threshold values: 100 when Percentage, else max of target range. */
    getThresholdMax(): number {
        if (this.thresholdType === 'PERCENTAGE') {
            return 100;
        }
        const min = this.defineKRIForm.get('minimum')?.value;
        const max = this.defineKRIForm.get('maximum')?.value;
        return Number(this.getMax(min, max));
    }

    getDecrement(data: any): any {
        return data - 1
    }

    getError(max: any, min: any, val: any): any {
        if (min < max) {
            if (val < min || val > max) {
                return 'Please enter the value in the range (' + min + '-' + max + ')';
            }
        }
        if (min > max) {
            if (val > min || val < max) {
                return 'Please enter the value in the range (' + max + '-' + min + ')';
            }
        }
    }

    showError(): any {
        let t3 = this.showErrorThreshold3();
        let t4 = this.showErrorThreshold4();
        let t2 = this.showErrorThreshold2();
        let resp = ((t2 || t3 || t4))
        // console.log('✌️resp --->', resp);
        return resp;
    }

    showErrorThreshold3(): any {
        // Check if there are error messages related to Threshold-3
        const threshold3Error =
            (this.defineKRIForm.get('minimum')?.value > this.defineKRIForm.get('maximum')?.value &&
                this.defineKRIForm.get('value3')?.touched &&
                this.defineKRIForm.get('value3')?.value >= this.defineKRIForm.get('value2')?.value) ||
            (this.defineKRIForm.get('minimum')?.value < this.defineKRIForm.get('maximum')?.value &&
                this.defineKRIForm.get('value3')?.touched &&

                this.defineKRIForm.get('value3')?.value <= this.defineKRIForm.get('value2')?.value);
        return threshold3Error;

    }

    showErrorForEqualvalues(min: any, max: any): any {
        if (min == max) {
            this.equalsCheck = true;
            return 'Min and Max values cannot be the same';
        }
        const minNum = min !== '' && min !== null && min !== undefined ? Number(min) : NaN;
        const maxNum = max !== '' && max !== null && max !== undefined ? Number(max) : NaN;
        // Min must be <= Max for both NUMBER and PERCENTAGE
        if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
            this.equalsCheck = true;
            return 'Minimum Target must be less than or equal to Maximum Target';
        }
        if (this.thresholdType === 'NUMBER') {
            this.equalsCheck = false;
            return '';
        }
        // PERCENTAGE: also enforce 0–100 range
        if (min < 0 || max < 0 || min > 100 || max > 100) {
            this.equalsCheck = true;
            return 'Please enter the values in the range of 0 - 100';
        }
        this.equalsCheck = false;
        return '';
    }

    showErrorThreshold2(): any {
        const minimum = this.defineKRIForm.get('minimum')?.value;
        const maximum = this.defineKRIForm.get('maximum')?.value;
        const value2 = this.defineKRIForm.get('value2')?.value;

        const threshold2Error =
            (minimum > maximum && this.defineKRIForm.get('value2')?.touched && value2 >= this.defineKRIForm.get('value1')?.value) ||
            (minimum < maximum && this.defineKRIForm.get('value2')?.touched && value2 <= this.defineKRIForm.get('value1')?.value);

        return threshold2Error;
    }

    showErrorThreshold4(): any {
        const minimum = this.defineKRIForm.get('minimum')?.value;
        const maximum = this.defineKRIForm.get('maximum')?.value;
        const value4 = this.defineKRIForm.get('value4')?.value;
        const value3 = this.defineKRIForm.get('value3')?.value;

        const threshold4Error =
            (minimum > maximum && this.defineKRIForm.get('value4')?.touched && value4 >= value3) ||
            (minimum < maximum && this.defineKRIForm.get('value4')?.touched && value4 <= value3) || maximum == value4;

        return threshold4Error;
    }

    compareUnit(Param1: any, Param2: any): boolean {
        return Param1 && Param2 ? Param1.UnitID === Param2.UnitID : false;
    }

    saveDefine(): any {
        let data: any = {
            "kriCode": this.getKriCode(),
            "unitID": this.defineKRIForm.value.unitID,
            "keyRiskIndicator": this.defineKRIForm.value.keyRiskIndicator,
            "measurementFrequencyID": this.defineKRIForm.value.measurementFrequencyID,
            "kriTpyeID": this.defineKRIForm.value.typeID,
            "reportingFrequencyID": this.data.reportingFrequencies.FrequencyID,
            "thresholdValue5": this.defineKRIForm.value.maximum,
            "thresholdValue4": this.defineKRIForm.value.value4,
            "thresholdValue3": this.defineKRIForm.value.value3,
            "thresholdValue2": this.defineKRIForm.value.value2,
            "thresholdValue1": this.defineKRIForm.value.minimum,
            "emailfrequencyID": this.emailFrequency[0].EmailFrequencyID,
            "InherentRiskID"  : this.defineKRIForm.value.inherentRisk,
            "thresholdType"    : this.thresholdType
        }
        this.service.setKri(data)
    }

    cancelPopup(): any {
        this.dialog.closeAll();
    }
}
