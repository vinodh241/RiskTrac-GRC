import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelfAssessmentsService } from 'src/app/services/rcsa/self-assessments/self-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import * as saveAs from 'file-saver';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateDialogComponent } from 'src/app/includes/utilities/popups/TemplateDialog/template-dialog.component';



@Component({
    selector: 'app-new-schedule-self-assessments',
    templateUrl: './new-schedule-self-assessments.component.html',
    styleUrls: ['./new-schedule-self-assessments.component.scss']
})
export class NewScheduleSelfAssessmentsComponent {
    displayedColumns: string[] = [
        'RCSACode', 'Risk', 'GroupName', 'UnitName', 'RiskCategoryName', 'ProcessName',
        'InherentLikelihoodName', 'InherentImpactRatingName', 'OverallInherentRiskRating'
    ];
    dataSource!: MatTableDataSource<any>;
    dataEvidencesSource!: MatTableDataSource<any>;
    dataSourceActionTrail!: MatTableDataSource<any>;
    Evidences: any;
    formData: any;
    saveerror: any;
    reviewerFormDisabled: boolean = false;
    controlAssessmentFormDisabled: boolean = false;
    residualRiskFormDisabled: boolean = false;
    controlTestingFormDisabled: boolean = false;
    actionImplementationFormDisabled: boolean = false;
    savingFormDisabled: boolean = false;
    iSReviewerPanelEnabled: any;
    IsInternalReviewer: any;
    IsInternalReviewRequired: any;
    reqScheduleAssessmentID: any;
    validFileNameErr: boolean = false;
    reviewerForm = new FormGroup({
        txtReviewerRemark: new FormControl('')
    });
    controlAssessmentForm = new FormGroup({
        txtControlDescription: new FormControl(null, [Validators.required]),
        ddlControlType: new FormControl(null, [Validators.required]),
        ddlControlinPlace: new FormControl(null), // removed required
        ddlNatureofControl: new FormControl(null, [Validators.required]),
        ddlAutomation: new FormControl(null, [Validators.required]),
        ddlFrequency: new FormControl(null, [Validators.required]),
    });
    residualRiskForm = new FormGroup({
        ddlRiskResponse: new FormControl(null, [Validators.required]),
        ddlResidualRiskResponsePerson: new FormControl(null, [Validators.required]),
    });
    controlTestingForm = new FormGroup({
        ddlControlTestResul: new FormControl(''),
        txtcontrolTestingComment: new FormControl(''),
    });
    actionImplementationForm = new FormGroup({
        txtIdentifiedActionComment: new FormControl<string | null>(null, [Validators.required]),
        apControlTypeID: new FormControl<number | null>(null, [Validators.required]),
        txtTimeline: new FormControl<Date | null>(null, [Validators.required]),
        ddlResponsiblePerson: new FormControl<number | null>(null, [Validators.required]),
        ddlStatus: new FormControl<number | null>(null, [Validators.required]),
        ddlComments: new FormControl<string | null>(null, [Validators.required]),
        ddlConfirmation: new FormControl<number | null>(null, [Validators.required]),
        // NEW decimal inputs
        totalCost: new FormControl<number | string | null>(null),
        totalBenefit: new FormControl<number | string | null>(null),
        totalPresentValueCost: new FormControl<number | string | null>(null),
        totalPresentValueBenefit: new FormControl<number | string | null>(null),
        // Computed
        totalNetBenefit: new FormControl<number | string | null>({
            value: null,
            disabled: true
        }),
        benefitCostRatio: new FormControl<number | string | null>({
            value: null,
            disabled: true
        }),
        projectViability: new FormControl<string | null>({
            value: null,
            disabled: true
        }),
    });
    savingForm = new FormGroup({
        txtSavingComment: new FormControl('', [Validators.required])
    });
    ScheduleAssessmentId: number = 0;
    controlInPlaceDS: any;
    NatureofControlDS: any;
    AutomationDS: any;
    FrequencyDS: any;
    TimelineDS: any;
    ActionStatusDS: any[] = [];
    ConfirmationDS: any[] = [];
    ControlTestResultDS: any[] = [];
    ResidualRiskResponseDS: any[] = [];
    ResidualRiskResponsePersonDS: any[] = [];
    ActionResponsePersonDS: any[] = [];
    controlTypeDS: any;
    controlTypeLookup: Record<number,
        string> = {};
    actionPlanStatusLookup: Record<number,
        string> = {};
    actionPlanRespLookup: Record<number,
        string> = {};
    actionPlanClosureLookup: Record<number,
        string> = {};
    ScheduleInherentRiskIDs: any;
    CurrentArry: number = 0;
    saveFlag: boolean = false;
    selfAssessment: any = [];
    ScheduleInherentRiskStatusIDDB: any;
    UnitName: any;
    unitId: any;
    controlInputMode: 'select' | 'new' = 'select';
    ControlsMasterData: any[] = []; // from API
    controlSearchCtrl = new FormControl();
    filteredControls$!: Observable<any[]>;
    controlsTable: any[] = [];
    actionPlanTable: any[] = [];
    editingActionIndex: number | null = null;
    FileuploadForm = new FormGroup({
        display: new FormControl('')
    });
    file_store: any = [];
    file_list: Array<string> = [];
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    private controlsMaster$ = new BehaviorSubject<any[]>([]);
    showActionImplementationPlan = false;
    actionDisplayedColumns = [
        'index', 'action', 'apControlType', 'timeline', 'status', 'resp', 'confirm',
        'totalCost', 'totalBenefit', 'totalNetBenefit',
        'totalPresentValueCost', 'totalPresentValueBenefit', 'benefitCostRatio',
        'projectViability', 'rowActions'
    ];
    showControlInPlace = true;
    showNatureOfControl = true;
    showAutomation = true;
    showFrequency = true;
    showOverallControlEnvRating = true; // for the display chip
    @ViewChild(MatAutocompleteTrigger) ctrlAutoTrigger!: MatAutocompleteTrigger;
    apTreatmentForm = new FormGroup({
        postTreatmentDescription: new FormControl<string | null>(null),
        apControlInPlace: new FormControl<number | null>(null),
        apNature: new FormControl<number | null>(null),
        apAutomation: new FormControl<number | null>(null),
        apFrequency: new FormControl<number | null>(null),
    });
    showPTControlInPlace = true;
    showPTNatureOfControl = true;
    showPTAutomation = true;
    showPTFrequency = true;

    displayControl = (c: any) => c ? `${c.ControlCode || ''}` : '';


    constructor(
        private selfAssessmentsService: SelfAssessmentsService,
        private configScoreRatingService: ConfigScoreRatingService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(DOCUMENT) private _document: any) { }

    ngOnInit(): void {
        this.ScheduleAssessmentId = Number(this.activatedRoute.snapshot.params['id'] ?? 0);
        this.pageLoadData();
        this.ScheduleInherentRiskIDs = JSON.parse(localStorage.getItem('SelfAssessmentDetailsScheduleInherentRiskIDs') ?? '[]');
        this.CurrentArry = this.ScheduleInherentRiskIDs.indexOf(this.ScheduleAssessmentId);
        // filter stream for controls search
        this.filteredControls$ = combineLatest([
            this.controlsMaster$,
            this.controlSearchCtrl.valueChanges.pipe(startWith(''))
        ]).pipe(
            map(([list, term]) => this.filterControlsFrom(list, term)));
        // auto-calc totals & BCR
        this.actionImplementationForm.valueChanges.subscribe(v => {
            const toNum = (x: any) => {
                const n = Number(x);
                return Number.isFinite(n) ? n : 0;
            };
            const cost = toNum(v.totalCost);
            const benefit = toNum(v.totalBenefit);
            const pvCost = toNum(v.totalPresentValueCost);
            const pvBenefit = toNum(v.totalPresentValueBenefit);
            const net = benefit - cost; // (1) TotalNetBenefit
            if (this.actionImplementationForm.get('totalNetBenefit')!.value !== net) {
                this.actionImplementationForm.get('totalNetBenefit')!.setValue(net, {
                    emitEvent: false
                });
            }
            // (2) BCR = PV(Benefit) / PV(Cost)  (guard divide-by-zero)
            const bcr = pvCost > 0 ? Number((pvBenefit / pvCost).toFixed(4)) : null;
            if (this.actionImplementationForm.get('benefitCostRatio')!.value !== bcr) {
                this.actionImplementationForm.get('benefitCostRatio')!.setValue(bcr, {
                    emitEvent: false
                });
            }
            // (3–5) Project Viability
            let viability: string | null = null;
            if (bcr === null) {
                viability = null;
            } else if (bcr > 1) {
                viability = 'project is viable';
            } else if (bcr < 1) {
                viability = 'project is not viable';
            } else {
                viability = 'Break-even';
            }
            if (this.actionImplementationForm.get('projectViability')!.value !== viability) {
                this.actionImplementationForm.get('projectViability')!.setValue(viability, {
                    emitEvent: false
                });
            }
        });
    }

    private filterControlsFrom(list: any[], val: any): any[] {
        if (!val)
            return list || [];
        const q = (typeof val === 'string' ? val : (val?.ControlCode || '')).toString().toLowerCase();
        return (list || []).filter(c =>
            (c.ControlCode || '').toLowerCase().includes(q) ||
            (c.ControlDescription || '').toLowerCase().includes(q));
    }

    Prev() {
        if (this.CurrentArry == 0)
            this.CurrentArry = this.ScheduleInherentRiskIDs.length - 1;
        else
            this.CurrentArry--;
        this.saveFlag = (this.Evidences > 0);
        this.reviewerForm.reset();
        this.ScheduleAssessmentId = this.ScheduleInherentRiskIDs[this.CurrentArry];
        this.pageLoadData();
    }

    Next() {
        if (this.CurrentArry == this.ScheduleInherentRiskIDs.length - 1)
            this.CurrentArry = 0;
        else
            this.CurrentArry++;
        this.saveFlag = (this.Evidences > 0);
        this.reviewerForm.reset();
        this.ScheduleAssessmentId = this.ScheduleInherentRiskIDs[this.CurrentArry];
        this.pageLoadData();
    }

    pageLoadData(isupload: boolean = false) {
        let obj = {
            id: this.ScheduleAssessmentId
        };
        this.configScoreRatingService.getDataForManageSelfAssessmentScreen(obj).subscribe(data => {
            next: {
                if (data.success == 1) {
                    if (!isupload) {
                        this.getGridData(data);
                        this.getControlInPlace(data);
                        this.getNatureofControl(data);
                        this.getFrequency(data);
                        this.getAutomation(data);
                        this.getControlType(data);
                        this.getActionStatus(data);
                        this.getActionResponsePerson(data);
                        this.getControlTestResult(data);
                        this.getActionConfirmation(data);
                        this.getResidualRiskResponse(data);
                        this.getResidualRiskResponsePerson(data);
                        this.getActionTrail(data);
                        this.loadControlsMaster(data);
                        this.loadExistingControlsTable(data);
                        this.loadExistingActionPlans(data);
                        if (this.ScheduleInherentRiskStatusIDDB === 1) {
                            const prev = data.result.recordset.prevQuarter?.[0] ?? null;
                            if (prev) {
                                this.patchPreviousQuarterData(prev);
                            }
                        }
                    }
                    this.getEvidence(data);

                    if (this.isSaveDisabled) {
                        this.savingForm.disable();
                        this.controlAssessmentForm.disable();
                        this.residualRiskForm.disable();
                        this.actionImplementationForm.disable();
                        this.FileuploadForm.disable();
                        this.controlTestingForm.disable();
                    } else {
                        this.savingForm.enable();
                        this.controlAssessmentForm.enable();
                        this.residualRiskForm.enable();
                        this.actionImplementationForm.enable();
                        this.FileuploadForm.enable();
                        this.controlTestingForm.enable();
                    }

                } else {
                    if (data.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                }
            }
        });
    }

    private rebuildLookups() {
        this.controlTypeLookup = {};
        (this.controlTypeDS || []).forEach((x: any) => this.controlTypeLookup[x.ControlTypeID] = x.ControlType);
        this.actionPlanStatusLookup = {};
        (this.ActionStatusDS || []).forEach((x: any) => this.actionPlanStatusLookup[x.ActionPlanStatusID] = x.ActionPlanStatus);
        this.actionPlanRespLookup = {};
        (this.ActionResponsePersonDS || []).forEach((x: any) => this.actionPlanRespLookup[x.ActionResponsiblePersonID] = x.Description);
        this.actionPlanClosureLookup = {};
        (this.ConfirmationDS || []).forEach((x: any) => this.actionPlanClosureLookup[x.ControlVerificationClosureID] = x.ControlVerificationClosure);
    }

    getGridData(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo.length > 0) {
                const apinfo = data.result.recordset.SelfAssessmentInfo[0];
                this.iSReviewerPanelEnabled = apinfo?.ISReviewerPanelEnabled;
                this.IsInternalReviewer = apinfo?.IsInternalReviewer;
                this.IsInternalReviewRequired = apinfo?.IsInternalReviewRequired;
                this.reqScheduleAssessmentID = apinfo?.ScheduleAssessmentID;
                this.ScheduleInherentRiskStatusIDDB = apinfo?.ScheduleInherentRiskStatusID;
                this.UnitName = apinfo?.UnitName;
                this.unitId = apinfo?.UnitID;


                const docs: any = data.result.recordset.SelfAssessmentInfo;
                if (docs) {
                    this.dataSource = new MatTableDataSource(docs);
                    this.formData = docs[0];
                    this.setFormValue();
                }
                this.applySearchDisableState();
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getControlInPlace(d: any) {
        const arr: any[] = (d && d.success === 1 && d.result && d.result.recordset && Array.isArray(d.result.recordset.ControlInPace))
            ? d.result.recordset.ControlInPace
            : [];

        this.controlInPlaceDS = arr;
        const anyActive = arr.length > 0 && arr.some((x: any) => x.IsActive === 1 || x.IsActive === true);

        this.showControlInPlace = anyActive;
        this.showPTControlInPlace = anyActive;

        const ctrlRisk = this.controlAssessmentForm?.get('ddlControlinPlace');
        const ctrlPT = this.apTreatmentForm?.get('apControlInPlace');

        if (arr.length === 0) {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
                (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
                (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            return;
        }

        if (anyActive) {
            if (ctrlRisk) (ctrlRisk as AbstractControl).setValidators([Validators.required]);
            if (ctrlPT) (ctrlPT as AbstractControl).setValidators([Validators.required]);
        } else {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
            }
        }

        if (ctrlRisk) (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
        if (ctrlPT) (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
    }


    // getNatureofControl
    getNatureofControl(d: any) {
        const arr: any[] = (d && d.success === 1 && d.result && d.result.recordset && Array.isArray(d.result.recordset.ControlNatureScore))
            ? d.result.recordset.ControlNatureScore
            : [];

        this.NatureofControlDS = arr;

        const anyActive = arr.length > 0 && arr.some((x: any) => x.IsActive === 1 || x.IsActive === true);

        this.showNatureOfControl = anyActive;
        this.showPTNatureOfControl = anyActive;

        const ctrlRisk = this.controlAssessmentForm?.get('ddlNatureofControl');
        const ctrlPT = this.apTreatmentForm?.get('apNatureOfControl');

        if (arr.length === 0) {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
                (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
                (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            return;
        }

        if (anyActive) {
            if (ctrlRisk) (ctrlRisk as AbstractControl).setValidators([Validators.required]);
            if (ctrlPT) (ctrlPT as AbstractControl).setValidators([Validators.required]);
        } else {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
            }
        }

        if (ctrlRisk) (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
        if (ctrlPT) (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
    }



    // getFrequency
    getFrequency(d: any) {
        const arr: any[] = (d && d.success === 1 && d.result && d.result.recordset && Array.isArray(d.result.recordset.ControlFrequencyScore))
            ? d.result.recordset.ControlFrequencyScore
            : [];

        this.FrequencyDS = arr;

        const anyActive = arr.length > 0 && arr.some((x: any) => x.IsActive === 1 || x.IsActive === true);

        this.showFrequency = anyActive;
        this.showPTFrequency = anyActive;

        const ctrlRisk = this.controlAssessmentForm?.get('ddlFrequency');
        const ctrlPT = this.apTreatmentForm?.get('apFrequency');

        if (arr.length === 0) {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
                (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
                (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            return;
        }

        if (anyActive) {
            if (ctrlRisk) (ctrlRisk as AbstractControl).setValidators([Validators.required]);
            if (ctrlPT) (ctrlPT as AbstractControl).setValidators([Validators.required]);
        } else {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
            }
        }

        if (ctrlRisk) (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
        if (ctrlPT) (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
    }


    // getAutomation
    getAutomation(d: any) {
        const arr: any[] = (d && d.success === 1 && d.result && d.result.recordset && Array.isArray(d.result.recordset.ControlAutomationScore))
            ? d.result.recordset.ControlAutomationScore
            : [];

        this.AutomationDS = arr;

        const anyActive = arr.length > 0 && arr.some((x: any) => x.IsActive === 1 || x.IsActive === true);

        this.showAutomation = anyActive;
        this.showPTAutomation = anyActive;

        const ctrlRisk = this.controlAssessmentForm?.get('ddlAutomation');
        const ctrlPT = this.apTreatmentForm?.get('apAutomation');

        if (arr.length === 0) {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
                (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
                (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
            }
            return;
        }

        if (anyActive) {
            if (ctrlRisk) (ctrlRisk as AbstractControl).setValidators([Validators.required]);
            if (ctrlPT) (ctrlPT as AbstractControl).setValidators([Validators.required]);
        } else {
            if (ctrlRisk) {
                (ctrlRisk as AbstractControl).clearValidators();
                (ctrlRisk as AbstractControl).setValue(null as any);
            }
            if (ctrlPT) {
                (ctrlPT as AbstractControl).clearValidators();
                (ctrlPT as AbstractControl).setValue(null as any);
            }
        }

        if (ctrlRisk) (ctrlRisk as AbstractControl).updateValueAndValidity({ emitEvent: false });
        if (ctrlPT) (ctrlPT as AbstractControl).updateValueAndValidity({ emitEvent: false });
    }



    getControlType(d: any) {
        if (d.success == 1 && d.result.recordset.ControlType?.length) {
            this.controlTypeDS = d.result.recordset.ControlType;
            this.rebuildLookups();
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getActionStatus(d: any) {
        const selfAssessmentSummaryInfo = {
            CreatedBy: d.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: d.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: d.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: d.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: d.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: d.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ActionPlanStatusID: d.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusID,
            ActionPlanStatus: d.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ActionStatusDS = [];
                (d.result.recordset.MasterActionPlanStatus || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ActionStatusDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ActionStatusDS = [];
                (d.result.recordset.MasterActionPlanStatus || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ActionStatusDS.push(e);
                });
                const filter = this.ActionStatusDS.find(x => x.ActionPlanStatus == selfAssessmentSummaryInfo.ActionPlanStatus);
                if (!filter)
                    this.ActionStatusDS.push(selfAssessmentSummaryInfo as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ActionStatusDS.push(selfAssessmentSummaryInfo as any);
            }
            this.rebuildLookups();
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getActionResponsePerson(d: any) {
        const selfAssessmentSummaryInfo = {
            CreatedBy: d.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: d.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: d.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: d.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: d.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: d.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ActionResponsiblePersonID: d.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonID,
            Description: d.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ActionResponsePersonDS = [];
                (d.result.recordset.MasterActionResponsiblePerson || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ActionResponsePersonDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ActionResponsePersonDS = [];
                (d.result.recordset.MasterActionResponsiblePerson || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ActionResponsePersonDS.push(e);
                });
                const filter = this.ActionResponsePersonDS.find(x => x.Description == (selfAssessmentSummaryInfo as any).Description);
                if (!filter)
                    this.ActionResponsePersonDS.push(selfAssessmentSummaryInfo as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ActionResponsePersonDS.push(selfAssessmentSummaryInfo as any);
            }
            this.rebuildLookups();
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getControlTestResult(d: any) {
        const info = {
            ControlTestingResultID: d.result.recordset.SelfAssessmentInfo[0].ControlTestingResultID,
            ControlTestingResult: d.result.recordset.SelfAssessmentInfo[0].ControlTestingResultName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ControlTestResultDS = [];
                (d.result.recordset.MasterControlTestingResult || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ControlTestResultDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ControlTestResultDS = [];
                (d.result.recordset.MasterControlTestingResult || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ControlTestResultDS.push(e);
                });
                const filter = this.ControlTestResultDS.find(x => x.ControlTestingResult == (info as any).ControlTestingResult);
                if (!filter)
                    this.ControlTestResultDS.push(info as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ControlTestResultDS.push(info as any);
            }
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getActionConfirmation(d: any) {
        const info = {
            ControlVerificationClosureID: d.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureID,
            ControlVerificationClosure: d.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ConfirmationDS = [];
                (d.result.recordset.MasterControlVerificationClosure || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ConfirmationDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ConfirmationDS = [];
                (d.result.recordset.MasterControlVerificationClosure || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ConfirmationDS.push(e);
                });
                const filter = this.ConfirmationDS.find(x => x.ControlVerificationClosure == (info as any).ControlVerificationClosure);
                if (!filter)
                    this.ConfirmationDS.push(info as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ConfirmationDS.push(info as any);
            }
            this.rebuildLookups();
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getResidualRiskResponse(d: any) {
        const info = {
            ResidualRiskResponseID: d.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseID,
            RiskResponse: d.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ResidualRiskResponseDS = [];
                (d.result.recordset.MasterResidualRiskResponse || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ResidualRiskResponseDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ResidualRiskResponseDS = [];
                (d.result.recordset.MasterResidualRiskResponse || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ResidualRiskResponseDS.push(e);
                });
                const filter = this.ResidualRiskResponseDS.find(x => x.RiskResponse == (info as any).RiskResponse);
                if (!filter)
                    this.ResidualRiskResponseDS.push(info as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ResidualRiskResponseDS.push(info as any);
            }
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getResidualRiskResponsePerson(d: any) {
        const info = {
            ResidualRiskResponsiblePersonID: d.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonID,
            ResponsiblePerson: d.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonName
        };
        if (d.success == 1) {
            if (d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ResidualRiskResponsePersonDS = [];
                (d.result.recordset.MasterRiskResponsiblePerson || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ResidualRiskResponsePersonDS.push(e);
                });
            } else if (["Draft", "Rejected"].includes(d.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)) {
                this.ResidualRiskResponsePersonDS = [];
                (d.result.recordset.MasterRiskResponsiblePerson || []).forEach((e: any) => {
                    if (e.IsActive)
                        this.ResidualRiskResponsePersonDS.push(e);
                });
                const filter = this.ResidualRiskResponsePersonDS.find(x => x.ResponsiblePerson == (info as any).ResponsiblePerson);
                if (!filter)
                    this.ResidualRiskResponsePersonDS.push(info as any);
            } else {
                if (d.result.recordset.SelfAssessmentInfo?.length)
                    this.ResidualRiskResponsePersonDS.push(info as any);
            }
        } else if (d.error?.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }

    getActionTrail(d: any) {
        if (d.success == 1) {
            this.dataSourceActionTrail = new MatTableDataSource(
                d.result?.recordset?.ActionTrailSummary || []
            );

        } else if (d.error?.errorCode == "TOKEN_EXPIRED") {
            this.utils.relogin(this._document);
        }
    }

    loadControlsMaster(data: any) {
        this.ControlsMasterData = data?.result?.recordset?.ControlsMasterData || [];
        this.controlsMaster$.next(this.ControlsMasterData);
    }

    loadExistingControlsTable(data: any) {
        const arr = data?.result?.recordset?.ControlData || [];
        this.controlsTable = [];

        arr.forEach((x: any) => {
            const alreadyExists = this.controlsTable.some(
                r => r.ControlCode === x.ControlCode
            );
            if (alreadyExists) return;
            const row: any = {
                _isCustom: false,
                _editing: false,
                ControlID: x.ScheduleControlID,
                ControlCode: x.ControlCode,
                ControlDescription: x.ControlDescription,
                ControlTypeID: x.ControlTypeID,
                ControlType: x.ControlType,
                controlid: x.ScheduleControlID
            };
            this.controlsTable.push(row);
        });
    }

    loadExistingActionPlans(data: any) {
        const arr = data?.result?.recordset?.ActionPlanData || [];
        this.actionPlanTable = arr.map((x: any) => ({
            ScheduleActionPlanID: x.ScheduleActionPlanID,
            IdentifiedAction: x.IdentifiedAction,
            ActionResponsiblePersonID: x.ActionResponsiblePersonID,
            ActionResponsiblePersonName: x.ActionResponsiblePersonName,
            Timeline: x.Timeline,
            ActionPlanStatusID: x.ActionPlanStatusID,
            ActionPlanStatusName: x.ActionPlanStatusName,
            ActionPlanComments: x.ActionPlanComments,
            ControlVerificationClosureID: x.ControlVerificationClosureID,
            ControlVerificationClosureName: x.ControlVerificationClosureName,
            ControlTypeID: x.ControlTypeID ?? null,
            ControlTypeName: x.ControlTypeName ?? null,
            // NEW economics
            TotalCost: x.TotalCost ?? null,
            TotalBenefit: x.TotalBenefit ?? null,
            TotalPresentValueCost: x.TotalPresentValueCost ?? null,
            TotalPresentValueBenefit: x.TotalPresentValueBenefit ?? null,
            TotalNetBenefit: x.TotalNetBenefit ?? null,
            BenefitCostRatio: x.BenefitCostRatio ?? null,
            ProjectViability: x.ProjectViability ?? null,
        }));
    }

    filterControls(val: any): any[] {
        if (!val)
            return this.ControlsMasterData;
        const q = (typeof val === 'string' ? val : (val?.ControlCode || '')).toString().toLowerCase();
        return this.ControlsMasterData.filter(c =>
            (c.ControlCode || '').toLowerCase().includes(q) ||
            (c.ControlDescription || '').toLowerCase().includes(q));
    }

    addSelectedControlToTable() {
        const sel = this.controlSearchCtrl.value;
        if (!sel) return;
        const exists = this.controlsTable.some(
            r => !!sel?.ControlCode && r.ControlCode === sel.ControlCode
        );
        if (exists) {
            this.saveError('Control already exists in controls table');
        } else {
            this.controlsTable.push({
                _isCustom: false,
                _editing: false,
                ControlID: null,
                ControlCode: sel.ControlCode,
                ControlDescription: sel.ControlDescription,
                ControlTypeID: sel.ControlTypeID,
                ControlType: sel.ControlType,
                controlid: sel.ControlID
            });
        }
        this.controlSearchCtrl.reset();
        this.resetNewControlInputs();
    }

    private resetNewControlInputs(): void {
        const desc = this.controlAssessmentForm.get('txtControlDescription');
        const type = this.controlAssessmentForm.get('ddlControlType');
        // Reset values
        desc?.setValue(null);
        type?.setValue(null);
        // Clear validators' errors if any
        desc?.setErrors(null);
        type?.setErrors(null);
        // Update validity AFTER clearing value & errors
        desc?.updateValueAndValidity({ emitEvent: false });
        type?.updateValueAndValidity({ emitEvent: false });
        // Reset UI states
        desc?.markAsPristine();
        desc?.markAsUntouched();
        type?.markAsPristine();
        type?.markAsUntouched();
    }

    addNewControlToTable() {
        const rawDesc = this.controlAssessmentForm.get('txtControlDescription')?.value as unknown;
        const desc = (typeof rawDesc === 'string' ? rawDesc.trim() : '');
        const ctype = this.controlAssessmentForm.get('ddlControlType')?.value;
        if (!desc || !ctype) return;
        const exists = this.controlsTable.some(r =>
            (r.ControlDescription || '').trim().toLowerCase() === desc.toLowerCase() &&
            r.ControlTypeID === ctype
        );

        if (exists) {
            this.saveError('Control with the same description and type already exists in controls table');
            return;
        }

        this.controlsTable.push({
            _isCustom: true,
            _editing: false,
            ControlID: null,
            ControlCode: null,
            ControlDescription: desc,
            ControlTypeID: ctype,
            ControlType: this.controlTypeLookup[ctype] || '',
            controlid: null
        });
        this.resetNewControlInputs();
    }

    editControlRow(i: number) {
        const r = this.controlsTable[i];
        if (!r._isCustom)
            return;
        r._editing = true;
        r._editDescription = r.ControlDescription;
        r._editControlTypeID = r.ControlTypeID;
    }

    saveControlRow(i: number) {
        const r = this.controlsTable[i];
        r.ControlDescription = r._editDescription;
        r.ControlTypeID = r._editControlTypeID;
        r.ControlType = this.controlTypeLookup[r.ControlTypeID] || '';
        r._editing = false;
    }

    cancelEditControlRow(i: number) {
        const r = this.controlsTable[i];
        r._editing = false;
        delete r._editDescription;
        delete r._editControlTypeID;
    }

    removeControlRow(i: number) {
        this.controlsTable.splice(i, 1);
    }
    private toNum(val: any): number {
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
    }

    private fromLookup(map: Record<number, string>, id: any): string {
        const key = this.toNum(id);
        return map[key] ?? '';
    }

    saveActionPlanRow() {
        if (this.actionImplementationForm.invalid) {
            this.saveError('Please fill all required fields including Control Type.');
            this.actionImplementationForm.markAllAsTouched();
            return;
        }

        const v = this.actionImplementationForm.getRawValue();
        const statusId = this.toNum(v.ddlStatus);
        const respId = this.toNum(v.ddlResponsiblePerson);
        const closeId = this.toNum(v.ddlConfirmation);
        const ctlTypeId = this.toNum(v.apControlTypeID);

        const row = {
            ScheduleActionPlanID: this.editingActionIndex != null
                ? (this.actionPlanTable[this.editingActionIndex]?.ScheduleActionPlanID ?? null)
                : null,
            IdentifiedAction: v.txtIdentifiedActionComment,
            Timeline: this.utils.formatTimeZone(v.txtTimeline),
            ActionPlanStatusID: statusId,
            ActionPlanStatusName: this.fromLookup(this.actionPlanStatusLookup, statusId),
            ActionResponsiblePersonID: respId,
            ActionResponsiblePersonName: this.fromLookup(this.actionPlanRespLookup, respId),
            ControlVerificationClosureID: closeId,
            ControlVerificationClosureName: this.fromLookup(this.actionPlanClosureLookup, closeId),
            ControlTypeID: ctlTypeId,
            ControlTypeName: this.controlTypeLookup[ctlTypeId] || '',
            ActionPlanComments: v.ddlComments,

            // NEW economics
            TotalCost: v.totalCost,
            TotalBenefit: v.totalBenefit,
            TotalPresentValueCost: v.totalPresentValueCost,
            TotalPresentValueBenefit: v.totalPresentValueBenefit,
            TotalNetBenefit: v.totalNetBenefit,
            BenefitCostRatio: v.benefitCostRatio,
            ProjectViability: v.projectViability,
        };

        if (this.editingActionIndex != null) {
            // update existing
            this.actionPlanTable = this.actionPlanTable.map((r, idx) =>
                idx === this.editingActionIndex ? row : r
            );

            // this.saveSuccess('Action Plan updated successfully.');

            this.editingActionIndex = null;
        } else {
            // add new record
            this.actionPlanTable = [...this.actionPlanTable, row];

            // this.saveSuccess('Action Plan added successfully.');
        }

        this.actionImplementationForm.reset();
        this.onActionPlansChanged();
    }

    openActionInfo(actionText: string | null | undefined): void {
        const payload = {
            title: 'Info',
            message: actionText || 'No action text available'
        };

        this.dialog.open(TemplateDialogComponent, {
            data: payload,
            width: '600px',     // preferred base width
            maxWidth: '90vw',   // will not exceed viewport width
            maxHeight: '90vh',  // keep dialog within viewport height
            panelClass: 'custom-info-dialog'
        });
    }



    editActionPlanRow(rowOrIndex: any) {
        let r: any;
        let idx: number;
        if (typeof rowOrIndex === 'number') {
            idx = rowOrIndex;
            r = this.actionPlanTable[idx];
        } else {
            r = rowOrIndex;
            idx = this.actionPlanTable.findIndex(x =>
                x === r || (x?.ScheduleActionPlanID && x.ScheduleActionPlanID === r?.ScheduleActionPlanID));
        }
        if (idx < 0 || !r)
            return;
        this.editingActionIndex = idx;
        this.actionImplementationForm.patchValue({
            txtIdentifiedActionComment: r.IdentifiedAction,
            txtTimeline: r.Timeline ? new Date(r.Timeline) : null,
            ddlStatus: r.ActionPlanStatusID,
            ddlResponsiblePerson: r.ActionResponsiblePersonID,
            ddlConfirmation: r.ControlVerificationClosureID,
            ddlComments: r.ActionPlanComments,
            apControlTypeID: r.ControlTypeID ?? null,
            totalCost: r.TotalCost,
            totalBenefit: r.TotalBenefit,
            totalPresentValueCost: r.TotalPresentValueCost,
            totalPresentValueBenefit: r.TotalPresentValueBenefit,
            totalNetBenefit: r.TotalNetBenefit,
            benefitCostRatio: r.BenefitCostRatio,
            projectViability: r.ProjectViability,
        });
    }

    removeActionPlanRow(rowOrIndex: any) {
        let idx = -1;
        if (typeof rowOrIndex === 'number') {
            idx = rowOrIndex;
        } else {
            const r = rowOrIndex;
            idx = this.actionPlanTable.findIndex(x =>
                x === r || (x?.ScheduleActionPlanID && x.ScheduleActionPlanID === r?.ScheduleActionPlanID));
        }
        if (idx < 0)
            return;
        this.actionPlanTable = this.actionPlanTable.filter((_, i) => i !== idx);
        if (this.editingActionIndex === idx)
            this.editingActionIndex = null;
        this.onActionPlansChanged();
    }
    private onActionPlansChanged() {
        if (!this.hasActionPlans) {
            this.apTreatmentForm.reset();
        }
    }

    selectFile(input: any): void {
        const files = input.target.files;
        if (files && files.length > 0) {
            const f = files[0];
            if (f.size < 10000 * 1024) {
                this.file_store = files;
            } else {
                this.file_store = [];
                this.FileuploadForm.patchValue({
                    display: ''
                });
                this.saveError("Selected File size should not be more than 10 MB.");
                return;
            }
            if (fileNamePattern(f.name)) {
                this.validFileNameErr = true;
            } else {
                this.validFileNameErr = false;
            }
            this.FileuploadForm.patchValue({
                display: f.name
            });
        } else {
            this.FileuploadForm.patchValue({
                display: ''
            });
            this.file_store = [];
        }
        input.target.value = "";
    }

    triggerFileChooser(): void {
        if (this.fileInput?.nativeElement) {
            this.fileInput.nativeElement.click();
        }
    }

    onFileChosen(inputEl: HTMLInputElement): void {
        const files = inputEl.files;
        if (files && files.length) {
            const f = files[0];
            if (f.size < 10000 * 1024) {
                this.file_store = [f];
            } else {
                this.file_store = [];
                this.FileuploadForm.patchValue({
                    display: ''
                });
                this.saveError('Selected File size should not more than 10 MB.');
                inputEl.value = '';
                return;
            }
            this.validFileNameErr = fileNamePattern(f.name);
            const count = files.length > 1 ? `(+${files.length - 1} files)` : '';
            this.FileuploadForm.patchValue({
                display: `${f.name}${count}`
            });
        } else {
            this.FileuploadForm.patchValue({
                display: ''
            });
            this.file_store = [];
        }
        inputEl.value = '';
    }

    upload(): void {
        if (!this.file_store?.length) {
            this.saveError('Please choose a file.');
            return;
        }
        const fd = new FormData();
        this.file_list = [];
        fd.append('UploadFile', this.file_store[0], this.file_store[0].name);
        this.file_list.push(this.file_store[0].name);
        fd.append('id', this.ScheduleAssessmentId.toString());
        this.selfAssessmentsService.uploadSelfAssessmentEvidence(fd).subscribe(res => {
            next:
            if (res.success == 1) {
                this.file_store = [];
                this.saveFileSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    downloadEvidence(fileId: any) {
        let data = {
            "evidenceID": fileId
        };
        this.selfAssessmentsService.downloadSelfAssessmentEvidence(data).subscribe(res => {
            next:
            if (res.success == 1) {
                const FileType = res["result"].fileData[0].FileContent.type;
                const TYPED_ARRAY = new Uint8Array(res.result.fileData[0].FileContent.data);
                const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, ''));
                const fileMetaType = res.FileType;
                const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
                const blob = new Blob([blobData], {
                    type: fileMetaType
                });
                saveAs(blob, res.result.fileData[0].OriginalFileName)
                this.saveFileSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    convertBase64ToBlobData(base64Data: any, contentType: string) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = window.atob(decodeURIComponent(base64Data));
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);
            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, {
            type: contentType
        });
    }

    deleteEvidence(rowOrId: any): void {
        if (!(this.formData?.ISSaveEnabled && this.canSaveSubmitAccess())) {
            this.saveError('You are not allowed to delete evidence.');
            return;
        }
        const isRowObj = rowOrId && typeof rowOrId === 'object';
        if (isRowObj && rowOrId._fromPrev) {
            this.saveError('Previous quarter evidence cannot be deleted here.');
            return;
        }
        const fileId =
            isRowObj
                ? (rowOrId.ScheduleAssessmentEvidenceID ?? rowOrId.evidenceID ?? rowOrId.id ?? null)
                : rowOrId;
        if (!fileId) {
            this.saveError('Could not determine evidence ID to delete.');
            return;
        }
        const payload = {
            evidenceID: fileId
        };
        this.selfAssessmentsService.deleteSelfAssessmentEvidence(payload).subscribe({
            next: (res: any) => {
                if (res?.success == 1) {
                    this.Evidences = (this.Evidences || []).filter(
                        (e: any) => e?.ScheduleAssessmentEvidenceID !== fileId);
                    if (this.dataEvidencesSource instanceof MatTableDataSource) {
                        this.dataEvidencesSource.data = this.Evidences;
                    } else {
                        this.dataEvidencesSource = this.Evidences;
                    }
                    this.saveFlag = (this.Evidences?.length ?? 0) > 0;
                    this.saveFileSuccess(res.message);
                } else {
                    if (res?.error?.errorCode === 'TOKEN_EXPIRED') {
                        this.utils.relogin(this._document);
                    } else {
                        this.saveError(res?.error?.errorMessage || 'Failed to delete evidence.');
                    }
                }
            },
            error: (err: any) => {
                console.error('deleteEvidence error:', err);
                this.saveError('Something went wrong while deleting the evidence.');
            }
        });
    }

    getEvidence(data: any): void {
        this.FileuploadForm.patchValue({
            display: ''
        });
        if (data.success == 1) {
            const current = data.result.recordset.Evidence ?? [];
            const prev = this.ScheduleInherentRiskStatusIDDB === 1
                ? (data.result.recordset.preQuarterEvidence ?? [])
                : [];
            const prevTagged = prev.map((e: any) => ({
                ...e,
                _fromPrev: true
            }));
            this.Evidences = [...current, ...prevTagged];
            this.dataEvidencesSource = this.Evidences;
            this.saveFlag = this.Evidences.length > 0;
        } else if (data.error?.errorCode == "TOKEN_EXPIRED") {
            this.utils.relogin(this._document);
        }
    }

    navigateToPreviousPage() {
        this.router.navigateByUrl('self-assessments/' + this.formData.ScheduleAssessmentID);
    }

    private patchPreviousQuarterData(prev: any) {
        if (!prev)
            return;
        const info = prev.SelfAssessmentInfo?.[0] ?? null;
        const controlData = prev.ControlData ?? [];
        const actionData = prev.ActionPlanData ?? [];
        if (info) {
            // Patch Control Assessment Form
            this.controlAssessmentForm.patchValue({
                txtControlDescription: info.ControlDescription ?? null,
                ddlControlType: info.ControlTypeID ?? null,
                ddlControlinPlace: info.ControlInPaceID ?? null,
                ddlNatureofControl: info.ControlNatureID ?? null,
                ddlAutomation: info.ControlAutomationID ?? null,
                ddlFrequency: info.ControlFrequencyID ?? null
            });
            // Patch Control Testing Form
            this.controlTestingForm.patchValue({
                ddlControlTestResul: info.ControlTestingResultID ?? null,
                txtcontrolTestingComment: info.ControlTestingResultComment ?? null
            });
            // Patch Residual Risk Form
            this.residualRiskForm.patchValue({
                ddlRiskResponse: info.ResidualRiskResponseID ?? null,
                ddlResidualRiskResponsePerson: info.ResidualRiskResponsiblePersonID ?? null
            });
            // Patch Saving Form
            this.savingForm.patchValue({
                txtSavingComment: info.SelfComment ?? null
            });
        }
        const arr = controlData || [];
        this.controlsTable = [];
        arr.forEach((x: any) => {
            const alreadyExists = this.controlsTable.some(
                r => r.ControlCode === x.ControlCode
            );
            if (alreadyExists) return;
            const row: any = {
                _isCustom: false,
                _editing: false,
                ControlID: x.ScheduleControlID,
                ControlCode: x.ControlCode,
                ControlDescription: x.ControlDescription,
                ControlTypeID: x.ControlTypeID,
                ControlType: x.ControlType,
                controlid: x.ScheduleControlID
            };
            this.controlsTable.push(row);
        });

        // Load Action Plan Table
        this.actionPlanTable = actionData.map((x: any) => ({
            ScheduleActionPlanID: x.ScheduleActionPlanID ?? null,
            IdentifiedAction: x.IdentifiedAction ?? null,
            ActionResponsiblePersonID: x.ActionResponsiblePersonID ?? null,
            ActionResponsiblePersonName: x.ActionResponsiblePersonName ?? null,
            Timeline: x.Timeline ?? null,
            ActionPlanStatusID: x.ActionPlanStatusID ?? null,
            ActionPlanStatusName: x.ActionPlanStatusName ?? null,
            ActionPlanComments: x.ActionPlanComments ?? null,
            ControlVerificationClosureID: x.ControlVerificationClosureID ?? null,
            ControlVerificationClosureName: x.ControlVerificationClosureName ?? null,
            ControlTypeID: x.ControlTypeID ?? null,
            ControlTypeName: x.ControlType ?? null,
            EstimatedCost: x.EstimatedCost ?? null,
            EstimatedBenefit: x.EstimatedBenefit ?? null,
            TotalNetBenefit: x.TotalNetBenefit ?? null,
            BenefitCostRatio: x.BenefitCostRatio ?? null
        }));

    }

    canSaveSubmitAccess(): boolean {
        if (this.utils.isStandardUser())
            return false;
        return !this.isReadOnlyStatus(this.ScheduleInherentRiskStatusIDDB);
    }

    private isReadOnlyStatus(id: number | null | undefined): boolean {
        return [3, 4, 6].includes(Number(id));
    }

    get hasActionPlans(): boolean {
        return (this.actionPlanTable?.length ?? 0) > 0;
    }

    private buildSavePayload(isSubmit: number = 0) {
        const controlData = this.controlsTable.map(r => ({
            // controlid: r.ControlID ?? null,
            controlcode: r.ControlCode ?? null,
            controldescription: r.ControlDescription ?? null,
            controltypeid: r.ControlTypeID ?? null,
            controlType: r.ControlType ?? null
        }));

        const controlAssessmentAndResidualRiskJSONData = [{
            ScheduleControlAssessmentAndResidualRiskID: this.formData?.ScheduleControlAssessmentAndResidualRiskID ?? null,
            ControlInPaceID: this.controlAssessmentForm.get('ddlControlinPlace')?.value,
            ControlAutomationID: this.controlAssessmentForm.get('ddlAutomation')?.value,
            ControlNatureID: this.controlAssessmentForm.get('ddlNatureofControl')?.value,
            ControlFrequencyID: this.controlAssessmentForm.get('ddlFrequency')?.value,
            ResidualRiskResponseID: this.residualRiskForm.get('ddlRiskResponse')?.value,
            ResidualRiskResponsiblePersonID: this.residualRiskForm.get('ddlResidualRiskResponsePerson')?.value,
            Unit: this.formData?.UnitID ?? null
        }
        ];
        const controlTestingJSONData = [{
            ScheduleControlTestingID: this.formData?.ScheduleControlTestingID ?? null,
            ControlTestingResultID: this.controlTestingForm.get('ddlControlTestResul')?.value,
            ControlTestingResultComment: this.controlTestingForm.get('txtcontrolTestingComment')?.value
        }
        ];
        const scheduleActionPlanJSONData = this.actionPlanTable.map(ap => ({
            ScheduleActionPlanID: ap.ScheduleActionPlanID ?? null,
            IdentifiedAction: ap.IdentifiedAction,
            Timeline: ap.Timeline,
            ActionPlanStatusID: ap.ActionPlanStatusID,
            ControlVerificationClosureID: ap.ControlVerificationClosureID,
            ActionResponsiblePersonID: ap.ActionResponsiblePersonID,
            ActionPlanComments: ap.ActionPlanComments,
            ControlTypeID: ap.ControlTypeID ?? null,
            TotalCost: ap.TotalCost?.toString() ?? null,
            TotalBenefit: ap.TotalBenefit?.toString() ?? null,
            TotalNetBenefit: ap.TotalNetBenefit?.toString() ?? null,
            TotalPresentValueCost: ap.TotalPresentValueCost?.toString() ?? null,
            TotalPresentValueBenefit: ap.TotalPresentValueBenefit?.toString() ?? null,
            BenefitCostRatio: ap.BenefitCostRatio?.toString() ?? null,
            ProjectViability: ap.ProjectViability ?? null,
        }));

        const hasAP = this.hasActionPlans;
        let RiskTreatmentJSONData = '';
        let PostTreatmentDescription = '';
        if (hasAP) {
            const rt = this.apTreatmentForm.getRawValue();
            const riskTreatmentArray = [{
                ScheduleRiskTreatmentPlanID: null,
                ControlInPaceID: rt.apControlInPlace ?? null,
                ControlAutomationID: rt.apAutomation ?? null,
                ControlNatureID: rt.apNature ?? null,
                ControlFrequencyID: rt.apFrequency ?? null
            }
            ];
            RiskTreatmentJSONData = JSON.stringify(riskTreatmentArray);
            PostTreatmentDescription = rt.postTreatmentDescription ?? '';
        }

        const obj: any = {
            id: this.ScheduleAssessmentId,
            controlData,
            controlAssessmentAndResidualRiskJSONData,
            controlTestingJSONData,
            scheduleActionPlanJSONData,
            selfComment: this.savingForm.get('txtSavingComment')?.value || '',
            isSubmit,
            token: localStorage.getItem('token'),
            ScheduleInherentRiskID: this.ScheduleAssessmentId,
            RiskTreatmentJSONData,
            PostTreatmentDescription,
            IsActionPlanImplemented: hasAP ? 1 : 0,
            OverallInherentRiskID: this.formData?.OverallInherentRiskID,
            appetiteResidualRiskRatingID: this.formData?.ResidualRiskRatingID
        };
        return obj;
    }

    private dedupeById<T extends Record<string,
        any>>(arr: T[] | null | undefined, idKey: keyof T): T[] {
        if (!Array.isArray(arr) || arr.length === 0)
            return [];
        const seen = new Set<string | number>();
        const out: T[] = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            const id = item?.[idKey];
            const isNullish = id === null || id === undefined || id === '';
            if (isNullish) {
                out.push(item);
            } else if (!seen.has(id)) {
                seen.add(id);
                out.push(item);
            }
        }
        return out.reverse();
    }

    private togglePostTreatmentValidators() {
        const desc = this.apTreatmentForm.get('postTreatmentDescription');
        const ctrlInPlace = this.apTreatmentForm.get('apControlInPlace');
        const nature = this.apTreatmentForm.get('apNature');
        const automation = this.apTreatmentForm.get('apAutomation');
        const frequency = this.apTreatmentForm.get('apFrequency');

        if (this.hasActionPlans) {
            desc?.setValidators([Validators.required]);
            if (this.showPTControlInPlace) ctrlInPlace?.setValidators([Validators.required]);
            else ctrlInPlace?.clearValidators();

            if (this.showPTNatureOfControl) nature?.setValidators([Validators.required]);
            else nature?.clearValidators();

            if (this.showPTAutomation) automation?.setValidators([Validators.required]);
            else automation?.clearValidators();

            if (this.showPTFrequency) frequency?.setValidators([Validators.required]);
            else frequency?.clearValidators();
        } else {
            // no action plans -> clear all
            desc?.clearValidators();
            ctrlInPlace?.clearValidators();
            nature?.clearValidators();
            automation?.clearValidators();
            frequency?.clearValidators();
        }

        // update validity without emitting UI events (avoid flicker)
        [desc, ctrlInPlace, nature, automation, frequency].forEach(c => c?.updateValueAndValidity({ emitEvent: false }));
    }


    onSave() {
        if (!this.canSaveSubmitAccess()) {
            this.saveError('You are not allowed to save.');
            return;
        }
        const cd = this.controlsTable;
        const hasControlData = Array.isArray(cd) && cd.length > 0;

        if (!hasControlData) {
            this.saveError('No control data found. Please complete Control Assessment before saving.');
            return;
        }

        if (!this.residualRiskForm.valid) {
            this.saveError('Please fill required Residual Risk fields.');
            return;
        }

        if (this.savingForm.invalid) {
            this.saveError('Please enter Self Comments.');
            this.savingForm.markAllAsTouched();
            return;
        }
        const needNature = this.showNatureOfControl && !this.controlAssessmentForm.get('ddlNatureofControl')?.value;
        const needAuto = this.showAutomation && !this.controlAssessmentForm.get('ddlAutomation')?.value;
        const needFreq = this.showFrequency && !this.controlAssessmentForm.get('ddlFrequency')?.value;
        const needInPlace = this.showControlInPlace && !this.controlAssessmentForm.get('ddlControlinPlace')?.value;
        if (needNature || needAuto || needFreq || needInPlace) {
            this.saveError('Please fill the Details section.');
            return;
        }


        if (this.formData?.ResidualRiskRatingID && this.formData?.OverallControlEnvironmentRiskRatingID) {
            const missingCt = (this.actionPlanTable || []).some(ap => !Number(ap?.ControlTypeID));
            if (missingCt) {
                this.saveError('Each Action Plan must have a Control Type selected.');
                return;
            }
            this.togglePostTreatmentValidators();
            if (this.hasActionPlans) {
                const descCtrl = this.apTreatmentForm.get('postTreatmentDescription');
                const descVal = descCtrl?.value;
                const needPTDesc = !descVal || !descVal.toString().trim();
                const needPTInPlace = this.showPTControlInPlace && !this.apTreatmentForm.get('apControlInPlace')?.value;
                const needPTNature = this.showPTNatureOfControl && !this.apTreatmentForm.get('apNature')?.value;
                const needPTAuto = this.showPTAutomation && !this.apTreatmentForm.get('apAutomation')?.value;
                const needPTFreq = this.showPTFrequency && !this.apTreatmentForm.get('apFrequency')?.value;
                if (needPTDesc || needPTInPlace || needPTNature || needPTAuto || needPTFreq) {
                    this.saveError('Action plan is not yet saved, Kindly provide the Post treatment plan details to Save it.');
                    if (needPTDesc) descCtrl?.markAsTouched();
                    if (needPTInPlace) this.apTreatmentForm.get('apControlInPlace')?.markAsTouched();
                    if (needPTNature) this.apTreatmentForm.get('apNature')?.markAsTouched();
                    if (needPTAuto) this.apTreatmentForm.get('apAutomation')?.markAsTouched();
                    if (needPTFreq) this.apTreatmentForm.get('apFrequency')?.markAsTouched();
                    return;
                }
            }
        }

        const payload = this.buildSavePayload(0);
        payload.unitName = this.UnitName;
        payload.UnitID = this.unitId;
        payload.scheduleAssessmentID = this.reqScheduleAssessmentID;
        payload.controlAssessmentAndResidualRiskJSONData = this.dedupeById(payload.controlAssessmentAndResidualRiskJSONData, 'ScheduleControlAssessmentAndResidualRiskID');
        payload.controlData = this.dedupeById(payload.controlData, 'controlid');

        payload.scheduleActionPlanJSONData = this.dedupeById(payload.scheduleActionPlanJSONData, 'ScheduleActionPlanID');
        this.selfAssessmentsService.updateScheduleAssessmentDetails(payload).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess(res.message);

            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    get isSaveDisabled() {
        return !(this.formData?.ISSaveEnabled && this.formData?.ISRMSaveEnabled && this.canSaveSubmitAccess());
    }

    setPreviousQuaterData(data: any) { }

    setFormValue(): void {
        this.controlAssessmentForm.patchValue({
            txtControlDescription: this.formData.ControlDescription,
            ddlAutomation: this.formData.ControlAutomationID,
            ddlControlinPlace: this.formData.ControlInPaceID,
            ddlControlType: this.formData.ControlTypeID,
            ddlFrequency: this.formData.ControlFrequencyID,
            ddlNatureofControl: this.formData.ControlNatureID,
        });
        this.controlTestingForm.patchValue({
            ddlControlTestResul: this.formData.ControlTestingResultID,
            txtcontrolTestingComment: this.formData.ControlTestingResultComment,
        });
        this.residualRiskForm.patchValue({
            ddlResidualRiskResponsePerson: this.formData.ResidualRiskResponsiblePersonID,
            ddlRiskResponse: this.formData.ResidualRiskResponseID
        });
        this.actionImplementationForm.patchValue({
            ddlComments: this.formData.ActionPlanComments,
            ddlConfirmation: this.formData.ControlVerificationClosureID,
            ddlResponsiblePerson: this.formData.ActionResponsiblePersonID,
            ddlStatus: this.formData.ActionPlanStatusID,
            txtTimeline: this.formData.Timeline,
            txtIdentifiedActionComment: this.formData.IdentifiedAction,
        });
        this.savingForm.patchValue({
            txtSavingComment: this.formData.SelfComment
        });

        if (this.ScheduleInherentRiskStatusIDDB !== 1) {
            this.apTreatmentForm.patchValue({
                postTreatmentDescription: this.formData?.PostTreatmentDescription ?? null,
                apControlInPlace: this.formData?.PostTreatmentControlInPaceID ?? null,
                apNature: this.formData?.PostTreatmentControlNatureID ?? null,
                apAutomation: this.formData?.PostTreatmentControlAutomationID ?? null,
                apFrequency: this.formData?.PostTreatmentControlFrequencyID ?? null
            });
        }

    }

    approveScheduleAssessment() {
        let obj = {
            reviewerComment: this.reviewerForm.get('txtReviewerRemark')?.value,
            id: this.ScheduleAssessmentId,
            scheduleInherentRiskStatusID: this.formData.ScheduleInherentRiskStatusID,
            IsInternalReviewer: this.IsInternalReviewer,
            IsInternalReviewRequired: this.IsInternalReviewRequired
        };
        this.selfAssessmentsService.scheduleAssessmentApproved(obj).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    RejectScheduleAssessment() {
        if (this.reviewerForm.get('txtReviewerRemark')?.value) {
            let obj = {
                reviewerComment: this.reviewerForm.get('txtReviewerRemark')?.value,
                id: this.ScheduleAssessmentId,
                scheduleInherentRiskStatusID: this.formData.ScheduleInherentRiskStatusID,
                IsInternalReviewer: this.IsInternalReviewer,
                IsInternalReviewRequired: this.IsInternalReviewRequired
            };
            this.selfAssessmentsService.scheduleAssessmentRejected(obj).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.saveSuccess(res.message);
                    this.reviewerForm.reset();
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveerror = res.error.errorMessage;
                }
                error: (err: any) =>
                console.log("err::", err);
            });
        } else {
            this.saveError("Please enter the reviewer comments");
        }
    }

    // Helper: returns true if any post-treatment input has a value
    private postTreatmentHasAnyValue(): boolean {
        if (!this.apTreatmentForm) return false;
        const v = this.apTreatmentForm.getRawValue();

        return !!(
            // text box
            (v.postTreatmentDescription && (v.postTreatmentDescription + '').trim()) ||

            // dropdown or numeric fields
            (v.apControlInPlace !== null && v.apControlInPlace !== undefined && v.apControlInPlace !== 0) ||
            (v.apNature !== null && v.apNature !== undefined && v.apNature !== 0) ||
            (v.apAutomation !== null && v.apAutomation !== undefined && v.apAutomation !== 0) ||
            (v.apFrequency !== null && v.apFrequency !== undefined && v.apFrequency !== 0)
        );
    }

    get isActionPlanRequired(): boolean {
        const isactinPlanRequired = !!this.formData?.IsActionPlanRequired;
        const statusIsTwo = this.ScheduleInherentRiskStatusIDDB === 2;
        const hasnotAPs = Array.isArray(this.actionPlanTable) && this.actionPlanTable.length == 0;
        return !!(statusIsTwo && hasnotAPs && isactinPlanRequired);
    }

    get showPostRiskTreatmentLabel(): boolean {
        const statusIsTwo = this.ScheduleInherentRiskStatusIDDB === 2;
        const hasAPs = Array.isArray(this.actionPlanTable) && this.actionPlanTable.length > 0;
        const noPTEntered = !this.postTreatmentHasAnyValue();
        return !!(statusIsTwo && hasAPs && noPTEntered);
    }

    saveSuccess(content: string): void {
        const timeout = 3000;
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "success",
            data: {
                title: "Success",
                content
            }
        });
        confirm.afterOpened().subscribe(_ => {
            setTimeout(() => {
                this.pageLoadData();
                confirm.close();
            }, timeout)
        });

    }
    saveFileSuccess(content: string): void {
        const timeout = 3000;
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "success",
            data: {
                title: "Success",
                content
            }
        });
        confirm.afterOpened().subscribe(_ => {
            setTimeout(() => {
                this.pageLoadData(true);
                confirm.close();
            }, timeout)
        });
    }

    saveError(content: string): void {
        const timeout = 3000;
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "error",
            data: {
                title: "Failed",
                content
            }
        });
        confirm.afterOpened().subscribe(_ => {
            setTimeout(() => {
                confirm.close();
            }, timeout)
        });
    }

    ErrorResponse(content: string): void {
        const timeout = 3000;
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "error",
            data: {
                title: "error",
                content
            }
        });
        confirm.afterOpened().subscribe(_ => {
            setTimeout(() => {
                confirm.close();
            }, timeout)
        });
    }

    private applySearchDisableState(): void {
        if (this.isSaveDisabled) {
            this.controlSearchCtrl.disable({
                emitEvent: false
            });
            this.ctrlAutoTrigger?.closePanel();
        } else {
            this.controlSearchCtrl.enable({
                emitEvent: false
            });
        }
    }

    onSearchInputFocus(event: FocusEvent): void {
        if (this.isSaveDisabled) {
            const el = event.target as HTMLElement;
            if (el && typeof el.blur === 'function') {
                el.blur();
            }
        }
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